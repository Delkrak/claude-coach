import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { addEntry, brokenReasonOf, localTimeOf, newTrace, parseArgs, TraceError } from '../scripts/trace.mjs'

const SCRIPT = fileURLToPath(new URL('../scripts/trace.mjs', import.meta.url))

const at = (minute) => new Date(2026, 10, 4, 20, minute)

const OPEN = { process: '/refine-process', step: '2.1', kind: 'start', version: 'v3', session: 'abc', before: 'nothing' }

const opened = () => addEntry(newTrace('KEE-16'), OPEN, at(45))

const out = (step, minute, trace) =>
  addEntry(trace, { process: '/refine-process', step, kind: 'out', text: 'done', link: 'session abc' }, at(minute))

test('an entry is stamped with the clock and chained; the file keeps the count and head', () => {
  const trace = out('2.4', 46, opened())
  const [first, second] = trace.entries
  assert.equal(first.at, localTimeOf(at(45)))
  assert.equal(second.iso, at(46).toISOString())
  assert.match(second.checksum, /^[0-9a-f]{8}$/)
  assert.equal(trace.count, 2)
  assert.equal(trace.head, second.checksum)
  assert.equal(brokenReasonOf(trace), null)
})

test('the stamp, and the counted fields, cannot be given on the command line', () => {
  const trace = opened()
  const add = (extra) => addEntry(trace, { process: '/refine-process', step: '2.4', kind: 'out', text: 'x', link: 'y', ...extra }, at(46))
  assert.throws(() => add({ at: '01-01-2020 00:00' }), /doesn't take --at/)
  assert.throws(() => add({ iso: '2020-01-01T00:00:00Z' }), /doesn't take --iso/)
  assert.throws(() => add({ time: '9:99' }), /doesn't take --time/)
  assert.throws(() => add({ checksum: '00000000' }), /doesn't take --checksum/)
  assert.throws(() => add({ key2: 'x' }), /doesn't take --key2/)
})

test('an edited time, field, order, key or version breaks the chain', () => {
  const trace = out('2.4', 46, opened())
  const broken = (change) => {
    const copy = structuredClone(trace)
    change(copy)
    return brokenReasonOf(copy)
  }
  assert.match(broken((t) => (t.entries[1].at = '04-11-2026 20:47')), /entry 2/)
  assert.match(broken((t) => (t.entries[0].session = 'other')), /entry 1/)
  assert.match(broken((t) => t.entries.reverse()), /entry 1/)
  assert.match(broken((t) => (t.key = 'KEE-17')), /entry 1/)
  assert.match(broken((t) => (t.version = 2)), /entry 1/)
})

test('removing the last entry, or every entry, is found', () => {
  const trace = out('2.4', 46, opened())
  const popped = structuredClone(trace)
  popped.entries.pop()
  assert.match(brokenReasonOf(popped), /should hold 2 entries/)
  const emptied = structuredClone(trace)
  emptied.entries = []
  assert.match(brokenReasonOf(emptied), /should hold 2 entries/)
})

test('an entry inserted by hand, even with a copied checksum, breaks the chain', () => {
  const trace = opened()
  const forged = structuredClone(trace)
  forged.entries.unshift({ ...trace.entries[0], step: '2.0' })
  assert.match(brokenReasonOf(forged), /entry 1/)
})

test('the same change made to two bytes 32 apart is found (the plain XOR fold missed it)', () => {
  const text = 'Ship A now and B later, after the review of B is in'
  const trace = addEntry(opened(), { process: '/refine-process', step: '2.7', kind: 'decision', text, by: 'agent', why: 'x' }, at(46))
  const edited = structuredClone(trace)
  edited.entries[1].text = 'Ship i now and B later, after the revAew of B is in'
  assert.match(brokenReasonOf(edited), /entry 2/)
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
  const captured = addEntry(newTrace('KEE-46'), { ...OPEN, process: '/capture-process', step: '1.6', before: 'capture 1.1–1.5, before the issue existed' }, at(45))
  assert.equal(captured.entries[0].before, 'capture 1.1–1.5, before the issue existed')
})

test("each kind's form is checked, evidence included", () => {
  const trace = opened()
  const add = (fields) => addEntry(trace, { process: '/refine-process', step: '2.7', ...fields }, at(47))
  assert.throws(() => add({ kind: 'impediment', text: 'slow', evidence: 'x', gap: 'other' }), /gap is one of/)
  assert.throws(() => add({ kind: 'impediment', text: 'slow', gap: 'process' }), /needs --evidence/)
  assert.throws(() => add({ kind: 'impediment', text: 'slow', gap: 'process', evidence: 'x' }), /names --where/)
  assert.doesNotThrow(() => add({ kind: 'impediment', text: 'slow', gap: 'not covered', evidence: 'x' }))
  assert.throws(() => add({ kind: 'decision', text: 'B2 first', by: 'owner', why: 'x' }), /owner carries --words/)
  assert.throws(() => add({ kind: 'question', text: 'which?', state: 'Refinement' }), /needs --link/)
  assert.throws(() => add({ kind: 'out', text: 'spec' }), /needs --link/)
  assert.throws(() => add({ kind: 'note', text: 'x' }), /kind is one of/)
  assert.throws(() => addEntry(trace, { ...OPEN, process: 'refine-process' }, at(47)), /command that runs it/)
  assert.doesNotThrow(() => add({ kind: 'decision', text: 'B2 first', by: 'owner', words: 'B2 first' }))
})

test('a value Git Bash rewrote is refused, wherever it is', () => {
  const trace = opened()
  assert.throws(() => addEntry(trace, { ...OPEN, step: '2.2', process: 'C:/Program Files/Git/refine-process' }, at(46)), /MSYS_NO_PATHCONV/)
  assert.throws(
    () => addEntry(trace, { process: '/refine-process', step: '2.4', kind: 'out', text: 'x', link: 'C:/Program Files/Git/pull/52' }, at(46)),
    /--link looks rewritten/,
  )
})

test('end and summary count the whole run of a work process, from its first start, per process', () => {
  let trace = opened()
  const add = (fields, minute) => {
    trace = addEntry(trace, fields, at(minute))
  }
  const refine = (step, kind, extra = {}) => ({ process: '/refine-process', step, kind, ...extra })
  add(refine('2.4', 'start', { version: 'v3', session: 'abc' }), 46)
  add(refine('2.7', 'question', { text: 'order?', state: 'Refinement', link: 'c1' }), 47)
  add({ process: '/capture-process', step: '1.1', kind: 'start', version: 'v1', session: 'abc' }, 48)
  add({ process: '/capture-process', step: '1.3', kind: 'impediment', text: 'other process', gap: 'not covered', evidence: 'x' }, 48)
  add(refine('2.7', 'impediment', { text: 'stale', gap: 'not covered', evidence: 'x' }), 49)
  add(refine('2.12', 'impediment', { text: 'times guessed', gap: 'process', where: '/trace 1', evidence: 'owner', correction: true }), 50)
  add(refine('2.12', 'end'), 52)
  add(refine('2.12', 'summary', { text: 'Ready' }), 52)
  const [end, summary] = trace.entries.slice(-2)
  assert.equal(end.time, '0:07')
  assert.deepEqual(
    [summary.time, summary.impediments, summary.questions, summary.corrections],
    ['0:07', 2, 1, 1],
  )
  add(refine('2.1', 'start', { version: 'v3', session: 'abc' }), 55)
  add(refine('2.12', 'summary', { text: 'Ready again' }), 58)
  assert.deepEqual([trace.entries.at(-1).time, trace.entries.at(-1).impediments], ['0:03', 0])
  assert.throws(() => addEntry(trace, { process: '/build-process', step: '3.9', kind: 'end' }, at(59)), /no start entry/)
})

test('a key is a work item id', () => {
  assert.throws(() => newTrace('trace'), TraceError)
  assert.equal(newTrace('KEE-16').key, 'KEE-16')
})

test('arguments: --seen yes or no, --correction a bare flag, and no value taken for a name', () => {
  assert.deepEqual(parseArgs(['--seen', 'yes']), { seen: true })
  assert.deepEqual(parseArgs(['--seen', 'no', '--correction']), { seen: false, correction: true })
  assert.throws(() => parseArgs(['--seen', 'true']), /yes or no/)
  assert.throws(() => parseArgs(['--correction', 'false']), /"false" isn't a --name/)
  assert.throws(() => parseArgs(['--text', '--by', 'owner']), /--text needs a value/)
  assert.throws(() => parseArgs(['--text']), /--text needs a value/)
  assert.throws(() => parseArgs(['kind', 'out']), /isn't a --name/)
})

test('localTimeOf pads to DD-MM-YYYY HH:mm', () => {
  assert.equal(localTimeOf(new Date(2026, 0, 2, 3, 4)), '02-01-2026 03:04')
})

const run = (args, env = {}) =>
  JSON.parse(execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', env: { ...process.env, ...env } }))

const failure = (args) => {
  try {
    execFileSync(process.execPath, [SCRIPT, ...args], { stdio: 'pipe' })
  } catch (error) {
    return { status: error.status, message: error.stderr.toString() }
  }
  return { status: 0, message: '' }
}

const START_ARGS = ['--key', 'KEE-16', '--process', '/refine-process', '--step', '2.1', '--kind', 'start', '--version', 'v3', '--session', 'abc', '--before', 'nothing']

test('the command line makes a missing folder, writes <key>-trace.json and verifies it', () => {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'drillmaster-trace-')), 'traces')
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

test('the stamp is local time, whatever the time zone', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'drillmaster-trace-'))
  const { added } = run(['add', '--file', dir, ...START_ARGS], { TZ: 'Pacific/Kiritimati' })
  const [, hour] = added.at.split(' ')[1].match(/^(\d\d)/)
  assert.equal(Number(hour), (new Date(added.iso).getUTCHours() + 14) % 24)
})

test('the file and the key must agree, and a wrong key writes nothing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'drillmaster-trace-'))
  run(['add', '--file', dir, ...START_ARGS])
  const file = path.join(dir, 'KEE-16-trace.json')
  const before = fs.readFileSync(file, 'utf8')
  assert.match(failure(['add', '--file', file, '--key', 'KEE-2', '--process', '/refine-process', '--step', '2.2', '--kind', 'end']).message, /KEE-16's trace, not KEE-2's/)
  assert.equal(fs.readFileSync(file, 'utf8'), before)
  assert.match(failure(['add', '--file', path.join(dir, 'KEE-9-trace.json'), ...START_ARGS]).message, /must be named KEE-16-trace.json/)
  fs.copyFileSync(file, path.join(dir, 'KEE-9-trace.json'))
  assert.match(failure(['verify', '--file', path.join(dir, 'KEE-9-trace.json')]).message, /must be named KEE-16-trace.json/)
})

test('bad input fails with a message, never a stack trace', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'drillmaster-trace-'))
  const bad = path.join(dir, 'KEE-1-trace.json')
  fs.writeFileSync(bad, '{ not json')
  assert.match(failure(['verify', '--file', bad]).message, /Can't read/)
  fs.writeFileSync(bad, '{}')
  assert.match(failure(['verify', '--file', bad]).message, /not a trace file/)
  assert.match(failure(['verify', '--file', path.join(dir, 'missing.json')]).message, /Can't read/)
  assert.match(failure(['remove', '--file', bad]).message, /commands are add and verify/)
  for (const args of [['verify', '--file', bad]]) assert.doesNotMatch(failure(args).message, /at .*\.mjs:\d+/)
})
