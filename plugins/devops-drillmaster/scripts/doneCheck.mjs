#!/usr/bin/env node
// Asks Claude, once, whether a process step is done after a tool call that often ends one, so the
// field log gets its end entry and a PR marked ready gets its debrief.
//   candidate (PostToolUse): a call like `gh pr ready` leaves a marker for this session.
//   stop (Stop): with a marker pending, block the stop once and ask; Claude decides.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { processIndex, runHook } from './hookInput.mjs'

const DEFAULT_BASH_HINTS = [
  /\bgh\s+pr\s+(create|ready|merge|review)\b/,
  /\bgh\s+issue\s+(create|close)\b/,
  /\bglab\s+mr\s+(create|merge)\b/,
]
const DEFAULT_TOOL_HINTS = [/^mcp__.*(save_issue|create_issue|update_issue|pull_request)/i]

/** The project's own done hints: every `Done hints:` entry in .drillmaster/process.md. */
export const doneHintsIn = (processText) =>
  [...processText.matchAll(/Done hints:\s*([^\n·]+)/gi)]
    .flatMap((match) => match[1].split(','))
    .map((hint) => hint.trim().replace(/^`|`$/g, ''))
    .filter(Boolean)

const callText = (event) =>
  event.tool_name === 'Bash' ? String(event.tool_input?.command ?? '') : String(event.tool_name ?? '')

/** The hint a tool call matched, or undefined when it doesn't look like the end of a work item. */
export const matchedHint = (event, projectHints = []) => {
  const text = callText(event)
  if (event.tool_name === 'Bash') {
    const builtIn = DEFAULT_BASH_HINTS.find((hint) => hint.test(text))
    if (builtIn) return text.match(builtIn)[0]
  } else if (DEFAULT_TOOL_HINTS.some((hint) => hint.test(text))) return text
  return projectHints.find((hint) => text.toLowerCase().includes(hint.toLowerCase()))
}

const markerDir = () =>
  process.env.DRILLMASTER_MARKER_DIR ?? path.join(os.tmpdir(), 'drillmaster-done')
const markerFile = (sessionId) =>
  path.join(markerDir(), `${String(sessionId).replace(/[^A-Za-z0-9-]/g, '_')}.json`)

export const askReason = (hint) =>
  `You may have finished a process step (\`${hint}\`). If it is done, log its end with the ` +
  'devops-drillmaster field-log skill; if a PR was just marked ready, write its debrief. If it ' +
  'is not done, carry on.'

export const candidate = (event, dir) => {
  const hint = matchedHint(event, doneHintsIn(fs.readFileSync(processIndex(dir), 'utf8')))
  if (!hint || !event.session_id) return undefined
  fs.mkdirSync(markerDir(), { recursive: true })
  fs.writeFileSync(markerFile(event.session_id), JSON.stringify({ hint }))
  return undefined
}

export const stop = (event) => {
  if (event.stop_hook_active || !event.session_id) return undefined
  const file = markerFile(event.session_id)
  if (!fs.existsSync(file)) return undefined
  const { hint } = JSON.parse(fs.readFileSync(file, 'utf8'))
  fs.rmSync(file)
  return { decision: 'block', reason: askReason(hint) }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const mode = process.argv[2]
  runHook(mode === 'stop' ? stop : candidate)
}
