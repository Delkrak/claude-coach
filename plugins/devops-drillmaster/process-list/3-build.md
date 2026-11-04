---
name: build-process
description: Build one work-ready issue into a draft pull request that meets the code and PR work policies. Use when a session starts on a work-ready issue, or resumes one in progress.
---

# 3. Build — Light

A work process. It serves the objective's measure **<measure>**.

## Input

- A work-ready issue with its start-work brief   ← must meet: `issue-policy` §3 (work-ready)
- Checked: at 3.2, by the agent (including that its "today" still holds in the code)
- Documented: the capture

## Records

- Impediments: at every step, through `impediment-and-metric-capture`.
- Metrics: corrections made by the owner, at 3.5; time taken, at 3.9.

## Steps

3.1 **impediment-and-metric-capture** — start.
3.2 Check the input against each rule its work policies set, its "today" against the code
    included. On a miss: stop, and report the work policy and rule it fails ("issue work policy
    3.3"). If the issue it is blocked by has no PR yet, don't start.
3.3 Move the issue to in progress.
3.4 Choose the base branch (the blocker's branch while its PR is open) and create the issue's branch.
3.5 Build it.
3.6 File each thing noticed but out of scope as a new issue (capture-process).
3.7 Check the code against each rule of `code-architecture-policy`, `code-style-policy` and
    `code-test-policy`, and run the project's checks.
3.8 Open the PR as a draft and check it against each rule of `pr-policy` §2.
3.9 **impediment-and-metric-capture** — process summary: what was built, impediments, corrections made, noticed items,
    time taken; end.

## Output

- Code   ← must meet: `code-architecture-policy`, `code-style-policy`, `code-test-policy`
- A draft PR   ← must meet: `pr-policy` §2
- Checked: at 3.7 and 3.8, by the agent and the project's checks (CI)
- Documented: the capture; CI results on the PR

## Hands off to

AI review (4), with the draft PR; user review (5) when the project has no AI review, with the PR
marked ready.
