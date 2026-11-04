import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { buildProcessOverview, indexEntries } from '../scripts/processOverview.mjs'

const PROCESS = `# Acme's process

The drill master's index. The story is in the entry skill \`/how-we-work\`.

# Work processes, in order

## 1. Build — \`/build-process\`, scaffolded
- Skill: .claude/skills/build-process/SKILL.md
- States: Ready → In Progress, moved by \`/build-process\`

# Work policies

## PR — \`/pr-policy\`, scaffolded
- Skill: .claude/skills/pr-policy/SKILL.md
`

const write = (dir, file, text) => {
  fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
  fs.writeFileSync(path.join(dir, file), text)
}

const project = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'drillmaster-overview-'))
  write(dir, '.drillmaster/process.md', PROCESS)
  write(dir, '.drillmaster/objective.md', '# Objective\n\n## Goal\n\n"Ship it."\n\n## Measures\n\n- **Speed.** Fast.\n  Counted from: the traces.\n  Check: time.\n\n## Direction and constraints\n\n- none\n')
  write(dir, '.claude/skills/build-process/SKILL.md', '---\nname: build-process\ndescription: Build it.\n---\n\n# 1. Build\n\nServes **Speed**.\n\n## Steps\n\n1.1 Start   ← /pr-policy §2.1\n')
  write(dir, '.claude/skills/pr-policy/SKILL.md', '---\nname: pr-policy\ndescription: PRs.\n---\n\n# PR policy\n\n## 2. Rules\n\n2.1 A PR MUST name its issue.\n    Intent: trace.\n    Check: the title.\n')
  write(dir, '.claude/skills/how-we-work/SKILL.md', '---\nname: how-we-work\ndescription: Start here.\n---\n\n# How we work\n\n## Flow\n\nBuild.\n')
  return dir
}

test('process.md names the work processes and work policies, with their skills', () => {
  assert.deepEqual(indexEntries(PROCESS, 'Work processes'), [
    { stage: 'Build', skill: 'build-process', states: 'Ready → In Progress, moved by /build-process' },
  ])
  assert.deepEqual(indexEntries(PROCESS, 'Work policies').map((e) => e.skill), ['pr-policy'])
})

test('the overview names no tracker or state of its own: every project brings its own', () => {
  const html = buildProcessOverview(project())
  assert.doesNotMatch(html, /Linear|AI Review/)
})

test('the process overview is one page of the project, read from its process.md', () => {
  const html = buildProcessOverview(project())
  assert.match(html, /<title>Acme's process<\/title>/)
  const data = JSON.parse(html.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1])
  assert.equal(data.processes[0].name, 'build-process')
  assert.deepEqual(data.processes[0].states, ['Ready', 'In Progress'])
  assert.deepEqual(data.processes[0].serves, ['Speed'])
  assert.deepEqual(data.processes[0].steps[0].cites, ['/pr-policy §2.1'])
  assert.equal(data.policies[0].rules[0].check, 'the title.')
  assert.equal(data.entry.name, 'how-we-work')
  assert.equal(data.measures[0].by, 'the traces.')
})

test('a state line with an alternative, and a citation mid-step, keep their parts apart', () => {
  const dir = project()
  write(dir, '.drillmaster/process.md', PROCESS.replace(
    '- States: Ready → In Progress, moved by `/build-process`',
    '- States: Review → Done (after the owner merges), or → Pre-Review (feedback), moved by `/build-process`',
  ))
  write(dir, '.claude/skills/build-process/SKILL.md', '---\nname: build-process\ndescription: Build it.\n---\n\n# 1. Build\n\n## Steps\n\n1.1 Update the issue   ← /pr-policy §2.1; put the PR back to draft and\n    rerun the review   ← /pr-policy §2.1\n')
  const html = buildProcessOverview(dir)
  const data = JSON.parse(html.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1])
  assert.deepEqual(data.processes[0].states, ['Review', 'Done', 'Pre-Review'])
  assert.match(data.processes[0].steps[0].text, /put the PR back to draft and\s+rerun the review/)
  assert.deepEqual(data.processes[0].steps[0].cites, ['/pr-policy §2.1', '/pr-policy §2.1'])
})
