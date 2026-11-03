#!/usr/bin/env node
// UserPromptSubmit: when the owner's message reads like a correction, remind Claude to log it in
// the impediment log. Claude decides whether it really is one.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runHook } from './hookInput.mjs'

const CORRECTION_CUES = [
  /^\s*(no|nope|nah)\b/i,
  /\bwrong\b/i,
  /\bI (already|just) (said|told|asked)\b/i,
  /\bI told you\b/i,
  /\bas I said\b/i,
  /\b(undo|revert|roll back)\b/i,
  /\binstead\b/i,
  /\bthat'?s not\b/i,
  /\bthat is not\b/i,
  /\bnot what I\b/i,
  /^\s*(stop|wait)\b/i,
  /\bdon'?t do that\b/i,
  /\bwhy did you\b/i,
]

export const NOTE_CUE =
  'This message may correct or redirect you. If it does, log it as an owner correction with the ' +
  'devops-drillmaster impediment-log skill, then carry on with what the owner asked.'

export const isCorrectionCue = (prompt = '') =>
  !prompt.trimStart().startsWith('/') && CORRECTION_CUES.some((cue) => cue.test(prompt))

export const cueFor = (event) =>
  isCorrectionCue(event.prompt)
    ? { hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: NOTE_CUE } }
    : undefined

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runHook(cueFor)
