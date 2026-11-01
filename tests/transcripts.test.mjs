import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import {
  projectSlug,
  projectSessions,
  readSession,
  selectSessions,
  formatSession,
} from '../skills/coach-improve-process/transcripts.mjs'

const project = path.resolve(os.tmpdir(), 'repo', 'app')
const worktree = path.join(project, '.claude', 'worktrees', 'fix-login')
const sibling = path.resolve(os.tmpdir(), 'repo', 'app-old')

const prompt = (sessionId, cwd, timestamp, text) => ({
  type: 'user',
  origin: { kind: 'human' },
  message: { role: 'user', content: text },
  sessionId,
  cwd,
  timestamp,
  gitBranch: 'main',
})
const reply = (sessionId, timestamp, text, tools = 0) => ({
  type: 'assistant',
  message: {
    content: [
      { type: 'text', text },
      ...Array.from({ length: tools }, () => ({ type: 'tool_use', name: 'Bash' })),
    ],
  },
  sessionId,
  timestamp,
})
const toolError = (sessionId, timestamp) => ({
  type: 'user',
  message: { content: [{ type: 'tool_result', is_error: true, content: 'boom' }] },
  sessionId,
  timestamp,
})
const interrupt = (sessionId, timestamp) => ({
  type: 'user',
  message: { content: [{ type: 'text', text: '[Request interrupted by user]' }] },
  sessionId,
  timestamp,
})

const writeSession = (root, folder, id, lines) => {
  fs.mkdirSync(path.join(root, folder), { recursive: true })
  fs.writeFileSync(
    path.join(root, folder, `${id}.jsonl`),
    lines.map((l) => JSON.stringify(l)).join('\n') + '\nnot json\n',
  )
}

const makeRoot = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'coach-transcripts-'))
  const slug = projectSlug(project)
  writeSession(root, slug, 'a', [
    { type: 'ai-title', aiTitle: 'auto title', sessionId: 'a' },
    prompt('a', project, '2026-10-01T10:00:00.000Z', 'Add a login page'),
    reply('a', '2026-10-01T10:01:00.000Z', 'Done, I used cookies.', 2),
    toolError('a', '2026-10-01T10:01:30.000Z'),
    prompt('a', project, '2026-10-01T10:02:00.000Z', 'No, I said tokens'),
    { type: 'custom-title', customTitle: 'Login', sessionId: 'a' },
    { ...reply('a', '2026-10-01T10:02:30.000Z', 'side work'), isSidechain: true },
  ])
  // A worktree session, stored under a slug whose drive letter has the other case.
  const worktreeSlug = projectSlug(worktree)
  const flipped = worktreeSlug[0] === worktreeSlug[0].toUpperCase()
    ? worktreeSlug[0].toLowerCase() + worktreeSlug.slice(1)
    : worktreeSlug[0].toUpperCase() + worktreeSlug.slice(1)
  writeSession(root, flipped, 'b', [
    prompt('b', worktree, '2026-10-05T09:00:00.000Z', 'Fix the login redirect'),
    reply('b', '2026-10-05T09:01:00.000Z', 'Working on it'),
    interrupt('b', '2026-10-05T09:02:00.000Z'),
  ])
  // A sibling folder whose slug starts with the project's: not the project.
  writeSession(root, projectSlug(sibling), 'c', [
    prompt('c', sibling, '2026-10-06T09:00:00.000Z', 'Old app'),
  ])
  return root
}

test('projectSlug replaces every non-alphanumeric character with a dash', () => {
  if (process.platform === 'win32') assert.equal(projectSlug('C:\\repo\\My.App'), 'C--repo-My-App')
  else assert.equal(projectSlug('/repo/My.App'), '-repo-My-App')
  assert.match(projectSlug(worktree), /-claude-worktrees-fix-login$/)
})

test('finds the project and its worktree sessions, not a sibling with the same prefix', () => {
  const root = makeRoot()
  const ids = projectSessions({ project, root }).map((s) => s.id)
  assert.deepEqual(ids, ['a', 'b'])
})

test('keeps human prompts and interrupts, with the assistant text before each', () => {
  const root = makeRoot()
  const [a, b] = projectSessions({ project, root })
  assert.deepEqual(
    a.events.map((e) => [e.kind, e.text, e.before]),
    [
      ['prompt', 'Add a login page', ''],
      ['prompt', 'No, I said tokens', 'Done, I used cookies.'],
    ],
  )
  assert.deepEqual(b.events.map((e) => e.kind), ['prompt', 'interrupt'])
})

test('reads title, branch, tool calls and errors, and skips sidechain lines', () => {
  const root = makeRoot()
  const [a] = projectSessions({ project, root })
  assert.equal(a.title, 'Login')
  assert.equal(a.branch, 'main')
  assert.equal(a.toolCalls, 2)
  assert.equal(a.toolErrors, 1)
  assert.equal(a.end, '2026-10-01T10:02:00.000Z')
})

test('selects by since, session, grep and latest', () => {
  const root = makeRoot()
  const all = projectSessions({ project, root })
  assert.deepEqual(selectSessions(all, { since: '2026-10-03' }).map((s) => s.id), ['b'])
  assert.deepEqual(selectSessions(all, { session: 'a' }).map((s) => s.id), ['a'])
  assert.deepEqual(selectSessions(all, { grep: 'TOKENS' }).map((s) => s.id), ['a'])
  assert.equal(selectSessions(all, { latest: true }).length, 1)
})

test('formats a session as readable text', () => {
  const text = formatSession(
    readSession([
      prompt('x', project, '2026-10-01T10:00:00.000Z', 'Hello'),
      reply('x', '2026-10-01T10:01:00.000Z', 'Hi'),
      interrupt('x', '2026-10-01T10:02:00.000Z'),
    ]),
  )
  assert.match(text, /## session x/)
  assert.match(text, /USER 2026-10-01T10:00:00.000Z:\n {4}Hello/)
  assert.match(text, / {4}Hi\n {2}INTERRUPTED/)
})
