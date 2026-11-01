// What every coach hook shares: reading the event from stdin, and knowing whether coach runs in
// this project at all. A project uses coach once it has .coach/process.md.

import fs from 'node:fs'
import path from 'node:path'

export const readEvent = () => {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8') || '{}')
  } catch {
    return {}
  }
}

export const projectDir = (event) => process.env.CLAUDE_PROJECT_DIR ?? event.cwd ?? process.cwd()

export const usesCoach = (dir) => fs.existsSync(path.join(dir, '.coach', 'process.md'))

/** Runs a hook so that nothing it does can fail the session: any error means no output. */
export const runHook = (handle) => {
  try {
    const event = readEvent()
    const dir = projectDir(event)
    if (!usesCoach(dir)) return
    const output = handle(event, dir)
    if (output) process.stdout.write(JSON.stringify(output))
  } catch {
    // A coach hook only ever adds a nudge; failing silently costs that nudge, nothing else.
  }
}
