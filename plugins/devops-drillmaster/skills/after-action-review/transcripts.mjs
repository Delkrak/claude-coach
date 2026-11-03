#!/usr/bin/env node
// Prints a project's Claude Code sessions as compact text for a coach review: per session its id,
// start, branch, title and tool counts, then every human prompt and interrupt with the end of the
// assistant text before it. Reads ~/.claude/projects/<slug>/*.jsonl; never writes.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ASSISTANT_TAIL = 400
const PROMPT_HEAD = 1200
const INTERRUPT = '[Request interrupted'

const clip = (text) =>
  text.length > PROMPT_HEAD
    ? `${text.slice(0, PROMPT_HEAD)} … (${text.length - PROMPT_HEAD} more chars)`
    : text

export const projectSlug = (dir) => path.resolve(dir).replace(/[^A-Za-z0-9]/g, '-')

export const defaultProjectsRoot = () =>
  path.join(process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), '.claude'), 'projects')

const insideOrSame = (child, parent) => {
  const c = path.resolve(child).toLowerCase()
  const p = path.resolve(parent).toLowerCase()
  return c === p || c.startsWith(p + path.sep)
}

/** Folders whose slug is the project's or starts with it: its subfolders and worktrees. */
const candidateFolders = (root, slug) => {
  const lower = slug.toLowerCase()
  if (!fs.existsSync(root)) return []
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => {
      const name = entry.name.toLowerCase()
      return name === lower || name.startsWith(lower + '-')
    })
    .map((entry) => path.join(root, entry.name))
}

const readLines = (file) =>
  fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)]
      } catch {
        return []
      }
    })

const textOf = (content) =>
  typeof content === 'string'
    ? content
    : content
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('\n')

const isHumanPrompt = (line) => line.type === 'user' && line.origin?.kind === 'human'

const isInterrupt = (line) =>
  line.type === 'user' && !line.origin && textOf(line.message.content).startsWith(INTERRUPT)

/** One session, read from its JSONL lines. */
export const readSession = (lines) => {
  const main = lines.filter((line) => !line.isSidechain)
  const stamped = main.filter((line) => line.timestamp)
  const session = {
    id: main.find((line) => line.sessionId)?.sessionId,
    cwd: main.find((line) => line.cwd)?.cwd,
    branch: stamped.findLast((line) => line.gitBranch)?.gitBranch,
    start: stamped[0]?.timestamp,
    end: stamped.at(-1)?.timestamp,
    title:
      main.findLast((line) => line.type === 'custom-title')?.customTitle ??
      main.findLast((line) => line.type === 'ai-title')?.aiTitle,
    toolCalls: 0,
    toolErrors: 0,
    events: [],
  }
  let assistantText = ''
  for (const line of main) {
    if (line.type === 'assistant') {
      for (const part of line.message.content) {
        if (part.type === 'text') assistantText += (assistantText ? '\n' : '') + part.text
        if (part.type === 'tool_use') session.toolCalls++
      }
    } else if (line.type === 'user' && Array.isArray(line.message.content)) {
      session.toolErrors += line.message.content.filter(
        (part) => part.type === 'tool_result' && part.is_error,
      ).length
    }
    const kind = isHumanPrompt(line) ? 'prompt' : isInterrupt(line) ? 'interrupt' : undefined
    if (!kind) continue
    session.events.push({
      kind,
      at: line.timestamp,
      text: textOf(line.message.content),
      before: assistantText.slice(-ASSISTANT_TAIL),
    })
    assistantText = ''
  }
  return session
}

/** Every session that ran in the project folder or under it, oldest first. */
export const projectSessions = ({ project, root = defaultProjectsRoot() }) =>
  candidateFolders(root, projectSlug(project))
    .flatMap((folder) =>
      fs
        .readdirSync(folder)
        .filter((name) => name.endsWith('.jsonl'))
        .map((name) => path.join(folder, name)),
    )
    .map((file) => ({ file, mtime: fs.statSync(file).mtimeMs, ...readSession(readLines(file)) }))
    .filter((session) => session.cwd && insideOrSame(session.cwd, project))
    .sort((a, b) => (a.start ?? '').localeCompare(b.start ?? ''))

export const selectSessions = (sessions, { since, session, latest, grep } = {}) => {
  let chosen = sessions
  if (session) chosen = chosen.filter((s) => s.id === session)
  if (since) chosen = chosen.filter((s) => (s.end ?? '') >= new Date(since).toISOString())
  if (grep) {
    const needle = grep.toLowerCase()
    chosen = chosen.filter((s) =>
      s.events.some((e) => (e.text + '\n' + e.before).toLowerCase().includes(needle)),
    )
  }
  if (latest) chosen = chosen.toSorted((a, b) => b.mtime - a.mtime).slice(0, 1)
  return chosen
}

const indent = (text, prefix) =>
  text
    .trim()
    .split('\n')
    .map((line) => prefix + line)
    .join('\n')

export const formatSession = (s) => {
  const head = [
    `## session ${s.id}`,
    `start ${s.start} · end ${s.end} · branch ${s.branch ?? '-'} · ${s.toolCalls} tool calls, ${s.toolErrors} errors`,
    s.title ? `title: ${s.title}` : undefined,
    `cwd: ${s.cwd}`,
  ].filter(Boolean)
  const events = s.events.map((e) => {
    const before = e.before.trim() ? indent(e.before, '    ') + '\n' : ''
    const label = e.kind === 'interrupt' ? 'INTERRUPTED' : 'USER'
    return `${before}  ${label} ${e.at}:\n${indent(clip(e.text), '    ')}`
  })
  return [...head, '', ...events].join('\n')
}

const parseArgs = (argv) => {
  const options = { project: process.cwd() }
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i]
    if (flag === '--latest') options.latest = true
    else if (['--project', '--since', '--session', '--grep', '--root'].includes(flag))
      options[flag.slice(2)] = argv[++i]
    else throw new Error(`Unknown flag ${flag}`)
  }
  return options
}

const main = () => {
  const options = parseArgs(process.argv.slice(2))
  const sessions = selectSessions(projectSessions(options), options)
  if (!sessions.length) {
    console.log(`No sessions for ${options.project} with these filters.`)
    return
  }
  console.log(sessions.map(formatSession).join('\n\n'))
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
