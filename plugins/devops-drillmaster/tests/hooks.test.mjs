import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { isCorrectionCue } from '../scripts/frictionCue.mjs'
import { doneHintsIn, matchedHint } from '../scripts/doneCheck.mjs'

const scripts = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'scripts')

const project = ({ drillmaster = true, processText = '# Processes\n' } = {}) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'drillmaster-project-'))
  if (drillmaster) {
    fs.mkdirSync(path.join(dir, '.drillmaster'))
    fs.writeFileSync(path.join(dir, '.drillmaster', 'process.md'), processText)
  }
  return dir
}

const markers = fs.mkdtempSync(path.join(os.tmpdir(), 'drillmaster-markers-'))

const run = (script, args, dir, event) => {
  const result = spawnSync(process.execPath, [path.join(scripts, script), ...args], {
    input: JSON.stringify(event),
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir, DRILLMASTER_MARKER_DIR: markers },
    encoding: 'utf8',
  })
  assert.equal(result.status, 0, result.stderr)
  return result.stdout ? JSON.parse(result.stdout) : undefined
}

test('correction cues match corrections and leave ordinary requests alone', () => {
  for (const prompt of [
    'No, use tokens',
    'that is wrong',
    'I already said the header goes first',
    'undo that',
    'use a list instead',
    "That's not what I meant",
    'wait',
  ])
    assert.ok(isCorrectionCue(prompt), prompt)
  for (const prompt of ['Add a login page', 'Looks good, commit it', 'Is there another option?', '/devops-drillmaster:retrospective no'])
    assert.ok(!isCorrectionCue(prompt), prompt)
})

test('the prompt hook adds the note cue as context on a correction', () => {
  const output = run('frictionCue.mjs', [], project(), { prompt: 'No, I said tokens' })
  assert.equal(output.hookSpecificOutput.hookEventName, 'UserPromptSubmit')
  assert.match(output.hookSpecificOutput.additionalContext, /capture skill/)
  assert.equal(run('frictionCue.mjs', [], project(), { prompt: 'Add a page' }), undefined)
})

test('done hints are read from process.md', () => {
  const text = '## build — adopted\n- Cites: x · Done hints: `make release`, deploy.sh\n## other\n- Done hints: mcp__jira__transition'
  assert.deepEqual(doneHintsIn(text), ['make release', 'deploy.sh', 'mcp__jira__transition'])
})

test('a call that may end a work item is recognised, others are not', () => {
  assert.equal(matchedHint({ tool_name: 'Bash', tool_input: { command: 'gh pr create --draft' } }), 'gh pr create')
  assert.equal(matchedHint({ tool_name: 'Bash', tool_input: { command: 'gh pr ready 12' } }), 'gh pr ready')
  assert.equal(matchedHint({ tool_name: 'mcp__tracker__save_issue' }), 'mcp__tracker__save_issue')
  assert.equal(matchedHint({ tool_name: 'Bash', tool_input: { command: './deploy.sh prod' } }, ['deploy.sh']), 'deploy.sh')
  assert.equal(matchedHint({ tool_name: 'Bash', tool_input: { command: 'git status' } }), undefined)
  assert.equal(matchedHint({ tool_name: 'Read' }), undefined)
})

test('after a candidate call, the next stop is blocked once with the question, then not again', () => {
  const dir = project()
  const session = { session_id: 'session-1' }
  run('doneCheck.mjs', ['candidate'], dir, { ...session, tool_name: 'Bash', tool_input: { command: 'gh pr create' } })
  const first = run('doneCheck.mjs', ['stop'], dir, { ...session, stop_hook_active: false })
  assert.equal(first.decision, 'block')
  assert.match(first.reason, /gh pr create/)
  assert.match(first.reason, /capture skill/)
  assert.match(first.reason, /process summary/)
  assert.match(first.reason, /item summary/)
  assert.equal(run('doneCheck.mjs', ['stop'], dir, { ...session, stop_hook_active: false }), undefined)
})

test('a stop already continued by a stop hook is never blocked', () => {
  const dir = project()
  const session = { session_id: 'session-2' }
  run('doneCheck.mjs', ['candidate'], dir, { ...session, tool_name: 'Bash', tool_input: { command: 'gh pr merge 3' } })
  assert.equal(run('doneCheck.mjs', ['stop'], dir, { ...session, stop_hook_active: true }), undefined)
})

test('every hook is silent in a project without .drillmaster/process.md', () => {
  const dir = project({ drillmaster: false })
  const session = { session_id: 'session-3' }
  assert.equal(run('frictionCue.mjs', [], dir, { prompt: 'No, wrong' }), undefined)
  run('doneCheck.mjs', ['candidate'], dir, { ...session, tool_name: 'Bash', tool_input: { command: 'gh pr create' } })
  assert.equal(run('doneCheck.mjs', ['stop'], dir, { ...session, stop_hook_active: false }), undefined)
})

test('a broken event never fails the hook', () => {
  const result = spawnSync(process.execPath, [path.join(scripts, 'doneCheck.mjs'), 'stop'], {
    input: 'not json',
    env: { ...process.env, CLAUDE_PROJECT_DIR: project(), DRILLMASTER_MARKER_DIR: markers },
    encoding: 'utf8',
  })
  assert.equal(result.status, 0)
  assert.equal(result.stdout, '')
})
