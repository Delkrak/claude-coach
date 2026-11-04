#!/usr/bin/env node
// SessionStart (startup, resume, clear, compact): briefs Claude on the project's work processes from
// .drillmaster/process.md, so it loads the right work process skill before working on a work item,
// and still knows to after a compaction.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { processIndex, runHook } from './hookInput.mjs'

const fieldOf = (section, field) => section.match(new RegExp(`^- ${field}:\\s*(.+)$`, 'm'))?.[1].trim()

/** Each work process in process.md's "Work processes" part, in order: its name, skill and states. */
export const workProcessesIn = (processText) => {
  const part = processText.split(/^# Work processes.*$/m)[1]?.split(/^# /m)[0] ?? ''
  return part
    .split(/^## /m)
    .slice(1)
    .map((section) => {
      const name = section.match(/^(?:\d+\.\s*)?(.+?)\s+—/)?.[1] ?? section.split('\n')[0].trim()
      const skillPath = fieldOf(section, 'Skill') ?? ''
      const skill = path.basename(path.dirname(skillPath)) || name
      return { name, skill, states: fieldOf(section, 'States') ?? '' }
    })
}

export const briefFor = (processes) =>
  [
    "This project runs the drill master's work processes (.drillmaster/process.md). Before working " +
      'on a work item, load the work process skill for its stage:',
    ...processes.map(({ name, skill, states }) => `- ${name}: skill \`${skill}\`${states ? ` — ${states}` : ''}`),
    'At every step, record impediments and metrics with the devops-drillmaster ' +
      'impediment-and-metric-capture skill, as the work process says.',
  ].join('\n')

export const brief = (_event, dir) => {
  const processes = workProcessesIn(fs.readFileSync(processIndex(dir), 'utf8'))
  if (processes.length === 0) return undefined
  return { hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: briefFor(processes) } }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runHook(brief)
