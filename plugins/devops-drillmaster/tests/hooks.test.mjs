import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { isCorrectionCue } from '../scripts/frictionCue.mjs'

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
  assert.match(output.hookSpecificOutput.additionalContext, /impediment-and-metric-capture skill/)
  assert.equal(run('frictionCue.mjs', [], project(), { prompt: 'Add a page' }), undefined)
})

test('every hook is silent in a project without .drillmaster/process.md', () => {
  assert.equal(run('frictionCue.mjs', [], project({ drillmaster: false }), { prompt: 'No, wrong' }), undefined)
})

test('a broken event never fails the hook', () => {
  assert.equal(run('frictionCue.mjs', [], project(), 'not json'), undefined)
})
