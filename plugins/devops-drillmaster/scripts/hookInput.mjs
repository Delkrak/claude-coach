// What every drill master hook shares: reading the event from stdin, and knowing whether the drill
// master runs in this project at all. A project uses it once it has .drillmaster/process.md.

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

export const processIndex = (dir) => path.join(dir, '.drillmaster', 'process.md')

export const usesDrillmaster = (dir) => fs.existsSync(processIndex(dir))

/** Runs a hook so that nothing it does can fail the session: any error means no output. */
export const runHook = (handle) => {
  try {
    const event = readEvent()
    const dir = projectDir(event)
    if (!usesDrillmaster(dir)) return
    const output = handle(event, dir)
    if (output) process.stdout.write(JSON.stringify(output))
  } catch {
    // A drill master hook only ever adds a nudge; failing silently costs that nudge, nothing else.
  }
}
