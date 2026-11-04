#!/usr/bin/env node
// The drill master's trace tool: the only writer of a work item's trace. Each entry is stamped with
// the clock, checked against its kind's form, and chained with an XOR checksum, so a trace edited by
// hand no longer verifies. The trace is a JSON file, `<key>-trace.json`.
//
// The checksum catches edits made outside the tool. It is not a signature: anyone who runs the tool
// can write entries. What it guarantees is that every entry went through here, in order, at the
// time it carries.
//
// Usage:
//   node trace.mjs add --file <dir or file> --key KEE-16 --process /build-process --step 3.5 \
//     --kind <kind> --text "<what>" [kind's fields]
//   node trace.mjs verify --file <file>
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const KINDS = [
  'start',
  'end',
  'in',
  'out',
  'state',
  'decision',
  'question',
  'answer',
  'impediment',
  'observation',
  'summary',
]

export const GAPS = ['process', 'policy', 'not covered']

/** Fields each kind needs beyond process, step and kind; `end` and `summary` are counted here. */
const REQUIRED = {
  start: ['version', 'session'],
  end: [],
  in: ['text'],
  out: ['text'],
  state: ['from', 'to'],
  decision: ['text', 'by'],
  question: ['text', 'state'],
  answer: ['words'],
  impediment: ['text', 'gap', 'evidence'],
  observation: ['experiment', 'seen', 'measure'],
  summary: ['text'],
}

export class TraceError extends Error {}

export const fileNameOf = (key) => `${key}-trace.json`

const pad = (n) => String(n).padStart(2, '0')

/** `DD-MM-YYYY HH:mm`, local time (POLICIES.md §4.3). */
export const localTimeOf = (date) =>
  `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`

const durationOf = (ms) => {
  const minutes = Math.max(0, Math.round(ms / 60000))
  return `${Math.floor(minutes / 60)}:${pad(minutes % 60)}`
}

/** XOR-folds `text` into 32 bits, starting from `previous`; rotating first makes order count. */
const fold = (previous, text) => {
  let hash = previous >>> 0
  for (const byte of Buffer.from(text, 'utf8')) {
    hash = (((hash << 5) | (hash >>> 27)) ^ byte) >>> 0
  }
  return hash
}

const hex = (hash) => hash.toString(16).padStart(8, '0')

const withoutChecksum = ({ checksum, ...entry }) => entry

/** An entry's checksum: the one before it, folded with the entry as written. */
export const checksumOf = (previousChecksum, entry) =>
  hex(fold(parseInt(previousChecksum, 16), JSON.stringify(withoutChecksum(entry))))

const seedOf = (key) => hex(fold(0, key))

export const newTrace = (key) => {
  if (!/^[A-Za-z][A-Za-z0-9]*-\d+$/.test(key ?? '')) {
    throw new TraceError(`A key is a work item's id, like KEE-16; got "${key}".`)
  }
  return { key, version: 1, entries: [] }
}

/** The index of the first entry whose checksum doesn't hold, or -1 when the chain is whole. */
export const firstBrokenEntry = (trace) => {
  let previous = seedOf(trace.key)
  for (const [index, entry] of trace.entries.entries()) {
    if (entry.checksum !== checksumOf(previous, entry)) return index
    previous = entry.checksum
  }
  return -1
}

const verified = (trace) => {
  const broken = firstBrokenEntry(trace)
  if (broken >= 0) {
    throw new TraceError(
      `The trace was changed outside the trace tool: entry ${broken + 1} doesn't match its checksum.`,
    )
  }
  return trace
}

const lastStartOf = (trace, process) =>
  trace.entries.findLastIndex((entry) => entry.process === process && entry.kind === 'start')

/** What `end` and `summary` count: from the work process's last start to now. */
const counted = (trace, process, now) => {
  const startIndex = lastStartOf(trace, process)
  if (startIndex < 0) throw new TraceError(`${process} has no start entry to count from.`)
  const since = trace.entries.slice(startIndex).filter((entry) => entry.process === process)
  const count = (test) => since.filter(test).length
  return {
    time: durationOf(now.getTime() - Date.parse(trace.entries[startIndex].iso)),
    impediments: count((entry) => entry.kind === 'impediment'),
    questions: count((entry) => entry.kind === 'question'),
    corrections: count((entry) => entry.kind === 'impediment' && entry.correction === true),
  }
}

const checked = (fields) => {
  const { process, step, kind } = fields
  if (!/^\/[a-z0-9:-]+$/.test(process ?? '')) {
    throw new TraceError(`A process is the command that runs it, like /build-process; got "${process}".`)
  }
  if (!step) throw new TraceError('Every entry names its step, like 3.5.')
  if (!KINDS.includes(kind)) throw new TraceError(`A kind is one of ${KINDS.join(', ')}; got "${kind}".`)
  const missing = REQUIRED[kind].filter((name) => fields[name] === undefined || fields[name] === '')
  if (missing.length) throw new TraceError(`A ${kind} entry needs ${missing.join(', ')}.`)
  if (kind === 'decision' && !['owner', 'agent'].includes(fields.by)) {
    throw new TraceError('A decision is by the owner or the agent.')
  }
  if (kind === 'decision' && !(fields.words || fields.why)) {
    throw new TraceError("A decision carries the owner's words or the agent's why.")
  }
  if (kind === 'impediment' && !GAPS.includes(fields.gap)) {
    throw new TraceError(`An impediment's gap is one of ${GAPS.join(', ')}.`)
  }
}

/** `trace` with one more entry, stamped `now`; refuses a trace that doesn't verify. */
export const addEntry = (trace, fields, now = new Date()) => {
  verified(trace)
  checked(fields)
  const { process, step, kind, ...rest } = fields
  const entry = { at: localTimeOf(now), iso: now.toISOString(), process, step, kind, ...rest }
  if (kind === 'end') entry.time = counted(trace, process, now).time
  if (kind === 'summary') Object.assign(entry, counted(trace, process, now))
  const previous = trace.entries.at(-1)?.checksum ?? seedOf(trace.key)
  entry.checksum = checksumOf(previous, entry)
  return { ...trace, entries: [...trace.entries, entry] }
}

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

const write = (file, trace) => fs.writeFileSync(file, `${JSON.stringify(trace, null, 2)}\n`)

const FLAGS = ['correction']

/** `--name value` pairs, `--seen yes|no`, and bare flags. */
export const parseArgs = (argv) => {
  const fields = {}
  for (let i = 0; i < argv.length; i++) {
    const name = argv[i].replace(/^--/, '')
    if (FLAGS.includes(name)) fields[name] = true
    else fields[name] = argv[++i]
  }
  if (fields.seen !== undefined) fields.seen = fields.seen === 'yes'
  return fields
}

const fileFor = (where, key) =>
  fs.existsSync(where) && fs.statSync(where).isDirectory() ? path.join(where, fileNameOf(key)) : where

const main = (argv) => {
  const [command, ...rest] = argv
  const { file: where, key, ...fields } = parseArgs(rest)
  if (!where) throw new TraceError('Name the trace file, or its folder, with --file.')
  if (command === 'verify') {
    const trace = verified(read(where))
    return { file: where, key: trace.key, entries: trace.entries.length, verified: true }
  }
  if (command !== 'add') throw new TraceError('The commands are add and verify.')
  const file = fileFor(where, key)
  const trace = addEntry(fs.existsSync(file) ? read(file) : newTrace(key), fields)
  if (key && trace.key !== key) throw new TraceError(`${file} is ${trace.key}'s trace, not ${key}'s.`)
  write(file, trace)
  return {
    file,
    filename: path.basename(file),
    contentType: 'application/json',
    size: fs.statSync(file).size,
    entries: trace.entries.length,
    added: trace.entries.at(-1),
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    console.log(JSON.stringify(main(process.argv.slice(2)), null, 2))
  } catch (error) {
    if (!(error instanceof TraceError)) throw error
    console.error(error.message)
    process.exitCode = 1
  }
}
