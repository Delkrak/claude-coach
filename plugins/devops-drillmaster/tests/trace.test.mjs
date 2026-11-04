import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { addEntry, brokenReasonOf, localTimeOf, main, newTrace, parseArgs, TraceError } from '../scripts/trace.mjs'

const SCRIPT = fileURLToPath(new URL('../scripts/trace.mjs', import.meta.url))

const at = (minute) => new Date(2026, 10, 4, 20, minute)

const OPEN = { process: '/refine-process', step: '2.1', kind: 'start', version: 'v3', session: 'abc', before: 'nothing' }

const opened = () => addEntry(newTrace('KEE-16'), OPEN, at(45))

const out = (step, minute, trace) =>
  addEntry(trace, { process: '/refine-process', step, kind: 'out', text: 'done', link: 'session abc' }, at(minute))

const broken = (trace, change) => {
  const copy = structuredClone(trace)
  change(copy)
  return brokenReasonOf(copy)
}

test('an entry is stamped with the clock and chained; the head seals the chain', () => {
  const trace = out('2.4', 46, opened())
  const [first, second] = trace.entries
  assert.equal(first.at, localTimeOf(at(45)))
  assert.equal(second.iso, at(46).toISOString())
  assert.match(second.checksum, /^[0-9a-f]{8}$/)
  assert.match(trace.head, /^[0-9a-f]{8}$/)
  assert.notEqual(trace.head, second.checksum)
  assert.equal(brokenReasonOf(trace), null)
})

test('the stamp, and the counted fields, cannot be given on the command line', () => {
  const trace = opened()
  const add = (kind, extra) => addEntry(trace, { process: '/refine-process', step: '2.4', kind, text: 'x', link: 'y', ...extra }, at(46))
  for (const name of ['at', 'iso', 'checksum', 'stepTime', 'key2']) {
    assert.throws(() => add('out', { [name]: 'x' }), new RegExp(`doesn't take --${name}`))
  }
  for (const name of ['time', 'impediments', 'questions', 'corrections', 'uncounted']) {
    assert.throws(() => add('summary', { [name]: '9' }), new RegExp(`doesn't take --${name}`))
  }
})

test('an edited time, field, order, key or version breaks the chain', () => {
  const trace = out('2.4', 46, opened())
  assert.match(broken(trace, (t) => (t.entries[1].at = '04-11-2026 20:47')), /entry 2/)
  assert.match(broken(trace, (t) => (t.entries[0].session = 'other')), /entry 1/)
  assert.match(broken(trace, (t) => t.entries.reverse()), /entry 1/)
  assert.match(broken(trace, (t) => (t.key = 'KEE-17')), /entry 1/)
  assert.match(broken(trace, (t) => (t.version = 2)), /entry 1/)
})

test('removing entries is found, even with the head copied from what is left', () => {
  const trace = out('2.5', 47, out('2.4', 46, opened()))
  assert.match(broken(trace, (t) => t.entries.pop()), /head doesn't seal/)
  assert.match(broken(trace, (t) => { t.entries.pop(); t.head = t.entries.at(-1).checksum }), /head doesn't seal/)
  assert.match(broken(trace, (t) => { t.entries = []; t.head = null }), /head doesn't seal/)
  assert.match(broken(trace, (t) => (t.head = '00000000')), /head doesn't seal/)
})

test('an entry inserted by hand, even with a copied checksum, breaks the chain', () => {
  const trace = opened()
  assert.match(broken(trace, (t) => t.entries.unshift({ ...trace.entries[0], step: '2.0' })), /entry 1/)
})

test('the same change made to two bytes 32 apart is found (the plain XOR fold missed it)', () => {
  const text = 'Ship A now and B later, after the review of B is in'
  const trace = addEntry(opened(), { process: '/refine-process', step: '2.7', kind: 'decision', text, by: 'agent', why: 'x', link: 'y' }, at(46))
  assert.match(broken(trace, (t) => (t.entries[1].text = 'Ship i now and B later, after the revAew of B is in')), /entry 2/)
})

test('nothing is added to a trace that no longer verifies', () => {
  const trace = opened()
  trace.entries[0].at = '04-11-2026 20:40'
  assert.throws(() => out('2.2', 46, trace), /changed outside the trace tool/)
})

test('a trace opens with a start that says what happened before it began', () => {
  const { before, ...withoutBefore } = OPEN
  assert.throws(() => addEntry(newTrace('KEE-16'), withoutBefore, at(45)), /--before/)
  assert.throws(() => out('2.1', 45, newTrace('KEE-16')), /opens with a start entry/)
})

test('every entry carries evidence, and no field is blank', () => {
  const trace = opened()
  const add = (fields) => addEntry(trace, { process: '/refine-process', step: '2.7', ...fields }, at(47))
  for (const fields of [
    { kind: 'end' },
    { kind: 'state', from: 'Refinement', to: 'Ready' },
    { kind: 'summary', text: 'Ready' },
    { kind: 'observation', experiment: 'E1', seen: true, measure: '1' },
    { kind: 'decision', text: 'B2 first', by: 'agent', why: 'order' },
    { kind: 'question', text: 'which?', state: 'Refinement' },
    { kind: 'out', text: 'spec' },
  ]) {
    assert.throws(() => add(fields), /needs --link/, fields.kind)
  }
  assert.throws(() => add({ kind: 'out', text: 'spec', link: '  ' }), /needs --link/)
  assert.throws(() => add({ kind: 'impediment', text: 'slow', gap: 'not covered', evidence: ' ' }), /needs --evidence/)
  assert.throws(() => add({ kind: 'impediment', text: 'slow', gap: 'not covered', evidence: 'x', where: ' ' }), /--where is empty/)
})

test("each kind's form is checked", () => {
  const trace = opened()
  const add = (fields) => addEntry(trace, { process: '/refine-process', step: '2.7', ...fields }, at(47))
  assert.throws(() => add({ kind: 'impediment', text: 'slow', evidence: 'x', gap: 'other' }), /gap is one of/)
  assert.throws(() => add({ kind: 'impediment', text: 'slow', gap: 'process', evidence: 'x' }), /names --where/)
  assert.doesNotThrow(() => add({ kind: 'impediment', text: 'slow', gap: 'not covered', evidence: 'x' }))
  assert.throws(() => add({ kind: 'decision', text: 'B2', by: 'owner', why: 'x', link: 'y' }), /owner carries --words/)
  assert.throws(() => add({ kind: 'decision', text: 'B2', by: 'agent', words: 'x', link: 'y' }), /agent carries --why/)
  assert.throws(() => add({ kind: 'decision', text: 'B2', by: 'team', words: 'x', link: 'y' }), /owner or the agent/)
  assert.throws(() => add({ kind: 'note', text: 'x' }), /kind is one of/)
  assert.throws(() => addEntry(trace, { ...OPEN, process: 'refine-process' }, at(47)), /command that runs it/)
  assert.doesNotThrow(() => add({ kind: 'decision', text: 'B2 first', by: 'owner', words: 'B2 first', link: 'y' }))
})

const refine = (step, kind, extra = {}) => ({ process: '/refine-process', step, kind, link: 'l', ...extra })

test('end counts its step; summary counts the whole run, per process', () => {
  let trace = opened()
  const add = (fields, minute) => {
    trace = addEntry(trace, fields, at(minute))
  }
  const { link, ...startFields } = refine('2.4', 'start', { version: 'v3', session: 'abc' })
  add(startFields, 46)
  add(refine('2.7', 'question', { text: 'order?', state: 'Refinement' }), 47)
  add({ process: '/capture-process', step: '1.1', kind: 'start', version: 'v1', session: 'abc' }, 48)
  add({ process: '/capture-process', step: '1.3', kind: 'impediment', text: 'other', gap: 'not covered', evidence: 'x' }, 48)
  add(refine('2.7', 'impediment', { text: 'stale', gap: 'not covered', evidence: 'x' }), 49)
  add(refine('2.12', 'impediment', { text: 'times guessed', gap: 'process', where: '/trace 1', evidence: 'owner', correction: true }), 50)
  add(refine('2.12', 'end'), 52)
  add(refine('2.12', 'summary', { text: 'Ready' }), 52)
  const [end, summary] = trace.entries.slice(-2)
  assert.equal(end.stepTime, '0:06')
  assert.equal(end.uncounted, undefined)
  assert.deepEqual([summary.time, summary.impediments, summary.questions, summary.corrections], ['0:07', 2, 1, 1])
  const { link: _, ...again } = refine('2.1', 'start', { version: 'v3', session: 'abc' })
  add(again, 55)
  add(refine('2.12', 'summary', { text: 'Ready again' }), 58)
  assert.deepEqual([trace.entries.at(-1).time, trace.entries.at(-1).impediments], ['0:03', 0])
  assert.throws(() => addEntry(trace, { process: '/build-process', step: '3.9', kind: 'end', link: 'l' }, at(59)), /no start entry/)
})

test('a run that began before the trace says what it leaves uncounted', () => {
  const capture = { process: '/capture-process', step: '1.7', kind: 'start', version: 'v1', session: 'abc', before: 'capture 1.1–1.6, before the issue existed' }
  let trace = addEntry(newTrace('KEE-46'), capture, at(45))
  trace = addEntry(trace, { process: '/capture-process', step: '1.8', kind: 'summary', text: 'saved', link: 'KEE-46' }, at(45))
  assert.equal(trace.entries.at(-1).uncounted, 'capture 1.1–1.6, before the issue existed')
})

test('a key is a work item id', () => {
  assert.throws(() => newTrace('trace'), TraceError)
  assert.equal(newTrace('KEE-16').key, 'KEE-16')
})

test('arguments: --name value or --name=value, --seen yes or no, --correction bare, nothing twice', () => {
  assert.deepEqual(parseArgs(['--seen', 'yes']), { seen: true })
  assert.deepEqual(parseArgs(['--seen', 'no', '--correction']), { seen: false, correction: true })
  assert.deepEqual(parseArgs(['--words=--no-verify is fine']), { words: '--no-verify is fine' })
  assert.throws(() => parseArgs(['--seen', 'true']), /yes or no/)
  assert.throws(() => parseArgs(['--correction', 'false']), /"false" isn't a --name/)
  assert.throws(() => parseArgs(['--correction=false']), /takes no value/)
  assert.throws(() => parseArgs(['--text', '--by', 'owner']), /--text needs a value/)
  assert.throws(() => parseArgs(['--text']), /--text needs a value/)
  assert.throws(() => parseArgs(['--text', 'a', '--text', 'b']), /given twice/)
  assert.throws(() => parseArgs(['--__proto__', 'x']), /isn't a field name/)
  assert.throws(() => parseArgs(['kind', 'out']), /isn't a --name/)
})

test('localTimeOf pads to DD-MM-YYYY HH:mm', () => {
  assert.equal(localTimeOf(new Date(2026, 0, 2, 3, 4)), '02-01-2026 03:04')
})

test('Git Bash without MSYS_NO_PATHCONV is refused before anything is read', () => {
  assert.throws(() => main(['verify', '--file', 'x.json'], { MSYSTEM: 'MINGW64' }), /MSYS_NO_PATHCONV=1/)
  assert.throws(() => main(['verify', '--file', 'missing.json'], { MSYSTEM: 'MINGW64', MSYS_NO_PATHCONV: '1' }), /Can't read/)
})

const ENV = (() => {
  const { MSYSTEM, ...env } = process.env
  return env
})()

const run = (args, env = {}) =>
  JSON.parse(execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', env: { ...ENV, ...env } }))

const failure = (args) => {
  try {
    execFileSync(process.execPath, [SCRIPT, ...args], { stdio: 'pipe', env: ENV })
  } catch (error) {
    return { status: error.status, message: error.stderr.toString() }
  }
  return { status: 0, message: '' }
}

const START_ARGS = ['--key', 'KEE-16', '--process', '/refine-process', '--step', '2.1', '--kind', 'start', '--version', 'v3', '--session', 'abc', '--before', 'nothing']

const tempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'drillmaster-trace-'))

test('the command line makes a missing folder, writes <key>-trace.json and verifies it', () => {
  const dir = path.join(tempDir(), 'traces')
  const added = run(['add', '--file', dir, ...START_ARGS])
  const file = path.join(dir, 'KEE-16-trace.json')
  assert.equal(added.filename, 'KEE-16-trace.json')
  assert.equal(added.size, fs.statSync(file).size)
  assert.equal(run(['verify', '--file', file]).verified, true)
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/"step": "2.1"/, '"step": "2.2"'))
  const { status, message } = failure(['verify', '--file', file])
  assert.equal(status, 1)
  assert.match(message, /changed outside the trace tool/)
})

test('a .json file in a missing folder is written there, whatever the case of its extension', () => {
  const file = path.join(tempDir(), 'new', 'KEE-16-trace.json')
  run(['add', '--file', file, ...START_ARGS])
  assert.ok(fs.statSync(file).isFile())
  const upper = path.join(tempDir(), 'KEE-16-trace.JSON')
  assert.match(failure(['add', '--file', upper, ...START_ARGS]).message, /must be named KEE-16-trace.json/)
  assert.equal(fs.existsSync(upper), false)
})

test('a downloaded trace saved with a BOM still reads and verifies', () => {
  const dir = tempDir()
  run(['add', '--file', dir, ...START_ARGS])
  const file = path.join(dir, 'KEE-16-trace.json')
  fs.writeFileSync(file, `﻿${fs.readFileSync(file, 'utf8')}`)
  assert.equal(run(['verify', '--file', file]).verified, true)
})

test('the stamp is local time, whatever the time zone', () => {
  const { added } = run(['add', '--file', tempDir(), ...START_ARGS], { TZ: 'Pacific/Kiritimati' })
  const hour = Number(added.at.split(' ')[1].slice(0, 2))
  assert.equal(hour, (new Date(added.iso).getUTCHours() + 14) % 24)
})

test('the file and the key must agree, and a wrong key writes nothing', () => {
  const dir = tempDir()
  run(['add', '--file', dir, ...START_ARGS])
  const file = path.join(dir, 'KEE-16-trace.json')
  const before = fs.readFileSync(file, 'utf8')
  assert.match(failure(['add', '--file', file, '--key', 'KEE-2', '--process', '/refine-process', '--step', '2.2', '--kind', 'end', '--link', 'l']).message, /KEE-16's trace, not KEE-2's/)
  assert.equal(fs.readFileSync(file, 'utf8'), before)
  assert.match(failure(['add', '--file', path.join(dir, 'KEE-9-trace.json'), ...START_ARGS]).message, /must be named KEE-16-trace.json/)
  fs.copyFileSync(file, path.join(dir, 'KEE-9-trace.json'))
  assert.match(failure(['verify', '--file', path.join(dir, 'KEE-9-trace.json')]).message, /must be named KEE-16-trace.json/)
})

test('verify takes only --file, and bad input fails with a message, never a stack trace', () => {
  const dir = tempDir()
  const bad = path.join(dir, 'KEE-1-trace.json')
  fs.writeFileSync(bad, '{ not json')
  assert.match(failure(['verify', '--file', bad]).message, /Can't read/)
  fs.writeFileSync(bad, '{}')
  assert.match(failure(['verify', '--file', bad]).message, /not a trace file/)
  assert.match(failure(['verify', '--file', bad, '--key', 'KEE-9']).message, /verify takes only --file/)
  assert.match(failure(['verify', '--file', path.join(dir, 'missing.json')]).message, /Can't read/)
  assert.match(failure(['remove', '--file', bad]).message, /commands are add and verify/)
  assert.doesNotMatch(failure(['verify', '--file', bad]).message, /at .*\.mjs:\d+/)
})
