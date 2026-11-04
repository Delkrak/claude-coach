---
name: release-process
description: Get merged work to its users - deploy, verify it in the deployed environment, and write the release notes. Use when merged work is to be released or deployed.
---

# 6. Release — Full

A work process. It serves the objective's measure **<measure>**.

## Input

- Merged PRs, their issues done, not yet released   ← must meet: `/pr-policy` §3 (merged)
- Checked: at 6.2, by the agent
- Documented: the trace

## Trace

- Every step, through `/devops-drillmaster:trace`: start and end, in and out, state moves, decisions, questions and
  answers, impediments.
- Counted from it: deploy failures, at 6.3; time taken, at 6.6.

## Steps

6.1 **/devops-drillmaster:trace** — start.
6.2 Check the input against each rule its work policies set. On a miss: stop, and report the work
    policy and rule it fails ("PR work policy 3.2").
6.3 Deploy, or confirm the automatic deploy ran.
6.4 Verify the change in the deployed environment.
6.5 Write the release notes; check the release against each rule of `/release-policy`.
6.6 **/devops-drillmaster:trace** — process summary: what shipped, impediments, deploy failures, time taken; end.

## Output

- A release, verified, with its notes   ← must meet: `/release-policy`
- Checked: at 6.5, by the agent
- Documented: the release notes; the trace

## Hands off to

Operate (7), with the release.
