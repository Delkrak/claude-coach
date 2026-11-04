import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  addEntry,
  firstBrokenEntry,
  localTimeOf,
  newTrace,
  parseArgs,
  TraceError,
} from '../scripts/trace.mjs'

const SCRIPT = fileURLToPath(new URL('../scripts/trace.mjs', import.meta.url))

const at = (minute) => new Date(2026, 10, 4, 20, minute)

const START = { process: '/refine-process', step: '2.1', kind: 'start', version: 'v3', session: 'abc' }

const started = () => addEntry(newTrace('KEE-16'), START, at(45))

test('an entry is stamped with the clock, in local time, and chained', () => {
  const trace = addEntry(started(), { process: '/refine-process', step: '2.4', kind: 'out', text: 'Today checked' }, at(46))
  const [first, second] = trace.entries
  assert.equal(first.at, '04-11-2026 20:45')
  assert.equal(second.at, '04-11-2026 20:46')
  assert.equal(second.iso, at(46).toISOString())
  assert.match(second.checksum, /^[0-9a-f]{8}$/)
  assert.notEqual(first.checksum, second.checksum)
  assert.equal(firstBrokenEntry(trace), -1)
})

test('a time, text or order changed by hand breaks the chain at that entry', () => {
  const trace = addEntry(started(), { process: '/refine-process', step: '2.4', kind: 'out', text: 'x' }, at(46))
  const retimed = structuredClone(trace)
  retimed.entries[1].at = '04-11-2026 20:47'
  assert.equal(firstBrokenEntry(retimed), 1)
  const reworded = structuredClone(trace)
  reworded.entries[0].session = 'other'
  assert.equal(firstBrokenEntry(reworded), 0)
  const reordered = structuredClone(trace)
  reordered.entries.reverse()
  assert.equal(firstBrokenEntry(reordered), 0)
})

test('an entry inserted by hand, even with a copied checksum, breaks the chain', () => {
  const trace = started()
  const forged = structuredClone(trace)
  forged.entries.unshift({ ...trace.entries[0], step: '2.0' })
  assert.equal(firstBrokenEntry(forged), 0)
})

test('nothing is added to a trace that no longer verifies', () => {
  const trace = started()
  trace.entries[0].at = '04-11-2026 20:40'
  assert.throws(() => addEntry(trace, { ...START, step: '2.2' }, at(46)), /changed outside the trace tool/)
})

test("each kind's form is checked", () => {
  const trace = started()
  const add = (fields) => addEntry(trace, { process: '/refine-process', step: '2.7', ...fields }, at(47))
  assert.throws(() => add({ kind: 'impediment', text: 'slow', evidence: 'x', gap: 'other' }), /gap is one of/)
  assert.throws(() => add({ kind: 'impediment', text: 'slow', gap: 'process' }), /needs evidence/)
  assert.throws(() => add({ kind: 'decision', text: 'B2 first', by: 'owner' }), /owner's words or the agent's why/)
  assert.throws(() => add({ kind: 'question', text: 'which?' }), /needs state/)
  assert.throws(() => add({ kind: 'note', text: 'x' }), /kind is one of/)
  assert.throws(() => addEntry(trace, { ...START, process: 'refine-process' }, at(47)), /command that runs it/)
  assert.doesNotThrow(() => add({ kind: 'decision', text: 'B2 first', by: 'owner', words: 'B2 first' }))
})

test('end and summary are counted from the work process’s last start, not written by hand', () => {
  let trace = started()
  const add = (fields, minute) => {
    trace = addEntry(trace, { process: '/refine-process', step: '2.7', ...fields }, at(minute))
  }
  add({ kind: 'question', text: 'order?', state: 'Refinement' }, 46)
  add({ kind: 'impediment', text: 'stale', gap: 'not covered', evidence: 'session abc' }, 47)
  add({ kind: 'impediment', text: 'times guessed', gap: 'process', evidence: 'owner', correction: true }, 50)
  add({ kind: 'end', step: '2.12' }, 52)
  add({ kind: 'summary', step: '2.12', text: 'Ready' }, 52)
  const [end, summary] = trace.entries.slice(-2)
  assert.equal(end.time, '0:07')
  assert.deepEqual(
    { time: summary.time, impediments: summary.impediments, questions: summary.questions, corrections: summary.corrections },
    { time: '0:07', impediments: 2, questions: 1, corrections: 1 },
  )
  assert.throws(() => addEntry(trace, { process: '/build-process', step: '3.9', kind: 'end' }, at(53)), /no start entry/)
})

test('a key is a work item id', () => {
  assert.throws(() => newTrace('trace'), TraceError)
  assert.equal(newTrace('KEE-16').key, 'KEE-16')
})

test('arguments read as name and value, with --correction as a flag and --seen as yes or no', () => {
  assert.deepEqual(parseArgs(['--kind', 'impediment', '--correction', '--seen', 'no']), {
    kind: 'impediment',
    correction: true,
    seen: false,
  })
})

test('localTimeOf pads to DD-MM-YYYY HH:mm', () => {
  assert.equal(localTimeOf(new Date(2026, 0, 2, 3, 4)), '02-01-2026 03:04')
})

test('the command line writes <key>-trace.json in a folder and verifies it', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'drillmaster-trace-'))
  const run = (...args) => JSON.parse(execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' }))
  const added = run('add', '--file', dir, '--key', 'KEE-16', '--process', '/refine-process', '--step', '2.1', '--kind', 'start', '--version', 'v3', '--session', 'abc')
  assert.equal(added.filename, 'KEE-16-trace.json')
  assert.equal(added.contentType, 'application/json')
  assert.equal(added.size, fs.statSync(path.join(dir, 'KEE-16-trace.json')).size)
  assert.equal(run('verify', '--file', path.join(dir, 'KEE-16-trace.json')).verified, true)

  const file = path.join(dir, 'KEE-16-trace.json')
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/"step": "2.1"/, '"step": "2.2"'))
  assert.throws(
    () => execFileSync(process.execPath, [SCRIPT, 'verify', '--file', file], { stdio: 'pipe' }),
    (error) => error.status === 1 && /changed outside the trace tool/.test(error.stderr.toString()),
  )
})
