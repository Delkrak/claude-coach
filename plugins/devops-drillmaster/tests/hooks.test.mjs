import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { isCorrectionCue } from '../scripts/frictionCue.mjs'
import { workProcessesIn } from '../scripts/sessionBrief.mjs'

const scripts = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'scripts')

const project = ({ drillmaster = true, processText = '# Processes\n' } = {}) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'drillmaster-project-'))
  if (drillmaster) {
    fs.mkdirSync(path.join(dir, '.drillmaster'))
    fs.writeFileSync(path.join(dir, '.drillmaster', 'process.md'), processText)
  }
  return dir
}

const run = (script, args, dir, input) => {
  const result = spawnSync(process.execPath, [path.join(scripts, script), ...args], {
    input: typeof input === 'string' ? input : JSON.stringify(input),
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir },
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
  assert.match(output.hookSpecificOutput.additionalContext, /\/devops-drillmaster:trace/)
  assert.equal(run('frictionCue.mjs', [], project(), { prompt: 'Add a page' }), undefined)
})

const PROCESS = `# Keeper's process

Priority: Standard
Log storage: comments

# Work processes, in order

## 1. capture-process — scaffolded
- Skill: .claude/skills/capture-process/SKILL.md
- Serves: fewer corrections
- States: → Backlog, moved by capture-process
- Hands off to: refine-process

## 3. build-process — adopted
- Skill: .claude/skills/build-process/SKILL.md
- States: Ready → In Progress, moved by build-process

# Work policies

## issue-policy — scaffolded
- Skill: .claude/skills/issue-policy/SKILL.md
`

test('the work processes are read from process.md, work policies left out', () => {
  assert.deepEqual(workProcessesIn(PROCESS), [
    { name: 'capture-process', skill: 'capture-process', states: '→ Backlog, moved by capture-process' },
    { name: 'build-process', skill: 'build-process', states: 'Ready → In Progress, moved by build-process' },
  ])
})

test('the session hook briefs which work process skill to load, and the trace skill', () => {
  const output = run('sessionBrief.mjs', [], project({ processText: PROCESS }), { source: 'compact' })
  assert.equal(output.hookSpecificOutput.hookEventName, 'SessionStart')
  const brief = output.hookSpecificOutput.additionalContext
  assert.match(brief, /\/build-process.*Ready → In Progress/)
  assert.match(brief, /load the work process skill/i)
  assert.match(brief, /\/devops-drillmaster:trace/)
  assert.doesNotMatch(brief, /issue-policy/)
})

test('every hook is silent in a project without .drillmaster/process.md', () => {
  assert.equal(run('frictionCue.mjs', [], project({ drillmaster: false }), { prompt: 'No, wrong' }), undefined)
  assert.equal(run('sessionBrief.mjs', [], project({ drillmaster: false }), { source: 'startup' }), undefined)
})

test('a broken event never fails the hook', () => {
  assert.equal(run('frictionCue.mjs', [], project(), 'not json'), undefined)
})
