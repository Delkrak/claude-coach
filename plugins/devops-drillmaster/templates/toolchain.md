# Toolchain

The tools the process runs on, as configured in this project. Written by `setup`; updated whenever
a tool's configuration changes, with what depends on it in `process.md` checked (POLICIES.md §4.6).
Every claim cites the doc it was read from or says "unverified".

Researched: <DD-MM-YYYY HH:mm>

## Changes

- <DD-MM-YYYY HH:mm> · <tool> · <what changed> · process.md checked: <what was affected, or nothing>


## Tracker (<Linear / Jira / GitHub Issues / …>)

- Team / project: <name, key>
- States: <each state, its type, its description>
- Labels: <kinds and others>
- Templates: <issue templates, if any>
- Automations: <what moves states on git events; verified or not>
- Agents and AI features: <e.g. agents, delegation, coding sessions, skills, plan-gated?>
- Docs read: <links>

## Git host (<GitHub / GitLab / …>)

- Repository: <owner/name>, default branch <name>
- Workflows: <each workflow, its triggers and what it does>
- Apps installed: <e.g. Claude GitHub App, Linear, Railway>
- Branch protection and required checks: <…>
- Docs read: <links>

## CI and environments

- CI: <jobs and what each runs>
- Preview / review environments: <e.g. a deploy per PR>
- Release and deploy: <how and where>

## Claude

- Plan tier: <Pro / Max / Ultra / Team / Enterprise>
- Available: <cloud sessions, Code Review, Auto-fix, routines — each with its plan gate>
- In this repo: <CLAUDE.md files, skills, agents, hooks, plugins the repo enables>
- Docs read: <links>

## Vendor-designed workflows found

- <vendor>: <the flow they design for, in steps> — <adopted / adapted / not used, and why>

## Unverified

- <what could not be checked, and how it would be>
