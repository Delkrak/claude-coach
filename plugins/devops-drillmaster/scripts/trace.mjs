#!/usr/bin/env node
// The drill master's trace tool: the only writer of a `<key>-trace.json` trace. Each entry is
// stamped with the clock, checked against its kind's form, and chained with an FNV-1a checksum
// (XOR then multiply), so a trace edited by hand no longer verifies.
//
// The checksum catches edits made outside the tool. It is not a signature: anyone who runs the
// algorithm can write a trace that verifies. What it guarantees is that a trace changed by hand,
// without rerunning the tool, is found.
//
// Usage:
//   node trace.mjs add --file <folder or <key>-trace.json> --key KEE-16 --process /build-process \
//     --step 3.5 --kind <kind> --text "<what>" [the kind's fields]
//   node trace.mjs verify --file <key>-trace.json
// In Git Bash, set MSYS_NO_PATHCONV=1: otherwise "/build-process" arrives as a Windows path.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const GAPS = ['process', 'policy', 'not covered']

/** Each kind's own fields: required first, then optional. `text` and `link` are common. */
const KIND_FIELDS = {
  start: { required: ['version', 'session'], optional: ['text', 'link', 'before'] },
  end: { required: [], optional: ['text', 'link'] },
  in: { required: ['text', 'link'], optional: [] },
  out: { required: ['text', 'link'], optional: [] },
  state: { required: ['from', 'to'], optional: ['text', 'link'] },
  decision: { required: ['text', 'by'], optional: ['words', 'why', 'link'] },
  question: { required: ['text', 'state', 'link'], optional: [] },
  answer: { required: ['words', 'link'], optional: ['text'] },
  impediment: { required: ['text', 'gap', 'evidence'], optional: ['where', 'correction', 'link'] },
  observation: { required: ['experiment', 'seen', 'measure'], optional: ['text', 'link'] },
  summary: { required: ['text'], optional: ['link'] },
}

export const KINDS = Object.keys(KIND_FIELDS)

const COMMON = ['process', 'step', 'kind']

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

/** FNV-1a over `text`, continuing from `previous`: each byte is XORed in, then multiplied. */
const fnv1a = (previous, text) => {
  let hash = previous >>> 0
  for (const byte of Buffer.from(text, 'utf8')) {
    hash = Math.imul(hash ^ byte, 0x01000193) >>> 0
  }
  return hash
}

const hex = (hash) => hash.toString(16).padStart(8, '0')

const FNV_OFFSET = 0x811c9dc5

const withoutChecksum = ({ checksum, ...entry }) => entry

/** An entry's checksum: the one before it, folded with the entry as written. */
export const checksumOf = (previousChecksum, entry) =>
  hex(fnv1a(parseInt(previousChecksum, 16), JSON.stringify(withoutChecksum(entry))))

/** Where a trace's chain starts: its key and format version, so neither can change by hand. */
const seedOf = (trace) => hex(fnv1a(FNV_OFFSET, `${trace.key}\n${trace.version}`))

export const newTrace = (key) => {
  if (!/^[A-Za-z][A-Za-z0-9]*-\d+$/.test(key ?? '')) {
    throw new TraceError(`A key is a work item's id, like KEE-16; got "${key}".`)
  }
  return { key, version: 1, count: 0, head: null, entries: [] }
}

/**
 * Why the trace doesn't verify, or null when it does: every entry's checksum holds, and the count
 * and head match the last entry, so an entry removed from the end is found too.
 */
export const brokenReasonOf = (trace) => {
  if (!trace || typeof trace.key !== 'string' || !Array.isArray(trace.entries)) {
    return 'it is not a trace file: it has no key or no entries.'
  }
  let previous = seedOf(trace)
  for (const [index, entry] of trace.entries.entries()) {
    if (entry?.checksum !== checksumOf(previous, entry ?? {})) {
      return `entry ${index + 1} doesn't match its checksum.`
    }
    previous = entry.checksum
  }
  if (trace.count !== trace.entries.length || trace.head !== (trace.entries.at(-1)?.checksum ?? null)) {
    return `it should hold ${trace.count} entries ending at ${trace.head}; it holds ${trace.entries.length}.`
  }
  return null
}

const verified = (trace) => {
  const reason = brokenReasonOf(trace)
  if (reason) throw new TraceError(`The trace was changed outside the trace tool: ${reason}`)
  return trace
}

/**
 * A work process's run: from its first start after its last summary. Every step has a start, so
 * the run begins at the first of them, not the last.
 */
const runStartOf = (trace, process) => {
  const own = trace.entries.map((entry, index) => ({ entry, index })).filter(({ entry }) => entry.process === process)
  const afterSummary = own.slice(own.findLastIndex(({ entry }) => entry.kind === 'summary') + 1)
  return afterSummary.find(({ entry }) => entry.kind === 'start')?.index ?? -1
}

/** What `end` and `summary` count: the work process's run, from its first start to now. */
const counted = (trace, process, now) => {
  const startIndex = runStartOf(trace, process)
  if (startIndex < 0) throw new TraceError(`${process} has no start entry to count from.`)
  const run = trace.entries.slice(startIndex).filter((entry) => entry.process === process)
  const count = (test) => run.filter(test).length
  return {
    time: durationOf(now.getTime() - Date.parse(trace.entries[startIndex].iso)),
    impediments: count((entry) => entry.kind === 'impediment'),
    questions: count((entry) => entry.kind === 'question'),
    corrections: count((entry) => entry.kind === 'impediment' && entry.correction === true),
  }
}

/** A value Git Bash rewrote: "/build-process" arrives as "C:/Program Files/Git/build-process". */
const MSYS_PATH = /^[A-Za-z]:[\\/](?:.*[\\/])?Git[\\/]/

const checked = (trace, fields) => {
  const { process, step, kind } = fields
  for (const [name, value] of Object.entries(fields)) {
    if (typeof value === 'string' && MSYS_PATH.test(value)) {
      throw new TraceError(
        `--${name} looks rewritten by Git Bash ("${value}"). Run with MSYS_NO_PATHCONV=1.`,
      )
    }
  }
  if (!/^\/[a-z0-9:-]+$/.test(process ?? '')) {
    throw new TraceError(`A process is the command that runs it, like /build-process; got "${process}".`)
  }
  if (!step) throw new TraceError('Every entry names its step, like 3.5.')
  if (!KINDS.includes(kind)) throw new TraceError(`A kind is one of ${KINDS.join(', ')}; got "${kind}".`)
  const { required, optional } = KIND_FIELDS[kind]
  const unknown = Object.keys(fields).filter((name) => ![...COMMON, ...required, ...optional].includes(name))
  if (unknown.length) {
    throw new TraceError(`A ${kind} entry doesn't take ${unknown.map((name) => `--${name}`).join(', ')}.`)
  }
  const missing = required.filter((name) => fields[name] === undefined || fields[name] === '')
  if (missing.length) throw new TraceError(`A ${kind} entry needs ${missing.map((name) => `--${name}`).join(', ')}.`)
  if (!trace.entries.length && (kind !== 'start' || !fields.before)) {
    throw new TraceError(
      'A trace opens with a start entry whose --before says what happened before it began, e.g. "capture 1.1–1.5, before the issue existed", or "nothing".',
    )
  }
  if (kind === 'decision' && !['owner', 'agent'].includes(fields.by)) {
    throw new TraceError('A decision is by the owner or the agent.')
  }
  if (kind === 'decision' && !(fields.by === 'owner' ? fields.words : fields.why)) {
    throw new TraceError("A decision by the owner carries --words; one by the agent carries --why.")
  }
  if (kind === 'impediment' && !GAPS.includes(fields.gap)) {
    throw new TraceError(`An impediment's gap is one of ${GAPS.join(', ')}.`)
  }
  if (kind === 'impediment' && fields.gap !== 'not covered' && !fields.where) {
    throw new TraceError('A process or policy gap names --where: the skill and its step or rule.')
  }
}

/** `trace` with one more entry, stamped `now`; refuses a trace that doesn't verify. */
export const addEntry = (trace, fields, now = new Date()) => {
  verified(trace)
  checked(trace, fields)
  const { process, step, kind, ...rest } = fields
  const entry = { at: localTimeOf(now), iso: now.toISOString(), process, step, kind, ...rest }
  if (kind === 'end') entry.time = counted(trace, process, now).time
  if (kind === 'summary') Object.assign(entry, counted(trace, process, now))
  entry.checksum = checksumOf(trace.entries.at(-1)?.checksum ?? seedOf(trace), entry)
  const entries = [...trace.entries, entry]
  return { ...trace, count: entries.length, head: entry.checksum, entries }
}

const FLAGS = ['correction']

/** `--name value` pairs, `--seen yes|no` and the bare flag `--correction`; anything else is refused. */
export const parseArgs = (argv) => {
  const fields = {}
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) throw new TraceError(`"${argv[i]}" isn't a --name or its value.`)
    const name = argv[i].slice(2)
    if (FLAGS.includes(name)) {
      fields[name] = true
      continue
    }
    const value = argv[i + 1]
    if (value === undefined || value.startsWith('--')) throw new TraceError(`--${name} needs a value.`)
    fields[name] = value
    i++
  }
  if (fields.seen !== undefined) {
    if (!['yes', 'no'].includes(fields.seen)) throw new TraceError('--seen is yes or no.')
    fields.seen = fields.seen === 'yes'
  }
  return fields
}

const read = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (error) {
    throw new TraceError(`Can't read ${file} as a trace: ${error.message}`)
  }
}

const write = (file, trace) => fs.writeFileSync(file, `${JSON.stringify(trace, null, 2)}\n`)

/** `--file` names a `.json` file, or a folder (made if missing) that holds `<key>-trace.json`. */
const fileFor = (where, key) => {
  if (where.endsWith('.json')) return where
  if (!key) throw new TraceError('Name the trace by --key, or give its file.')
  fs.mkdirSync(where, { recursive: true })
  return path.join(where, fileNameOf(key))
}

const checkedName = (file, trace) => {
  if (path.basename(file) !== fileNameOf(trace.key)) {
    throw new TraceError(`${path.basename(file)} holds ${trace.key}'s trace; it must be named ${fileNameOf(trace.key)}.`)
  }
}

export const main = (argv) => {
  const [command, ...rest] = argv
  if (!['add', 'verify'].includes(command)) throw new TraceError('The commands are add and verify.')
  const { file: where, key, ...fields } = parseArgs(rest)
  if (!where) throw new TraceError('Name the trace file, or its folder, with --file.')
  if (command === 'verify') {
    const trace = verified(read(where))
    checkedName(where, trace)
    return { file: where, key: trace.key, entries: trace.entries.length, verified: true }
  }
  const file = fileFor(where, key)
  const existing = fs.existsSync(file) ? read(file) : null
  if (existing && key && existing.key !== key) throw new TraceError(`${file} is ${existing.key}'s trace, not ${key}'s.`)
  const trace = addEntry(existing ?? newTrace(key), fields)
  checkedName(file, trace)
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

const invokedDirectly = () => {
  try {
    return fs.realpathSync(fileURLToPath(import.meta.url)) === fs.realpathSync(path.resolve(process.argv[1]))
  } catch {
    return false
  }
}

if (process.argv[1] && invokedDirectly()) {
  try {
    console.log(JSON.stringify(main(process.argv.slice(2)), null, 2))
  } catch (error) {
    console.error(error instanceof TraceError ? error.message : `The trace tool failed: ${error.message}`)
    process.exitCode = 1
  }
}
