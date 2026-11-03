---
name: release-process
description: Get merged work to its users - deploy, verify it in the deployed environment, and write the release notes. Use when merged work is to be released or deployed.
---

# 7. Release — Full

An AI agent process. It serves the objective's measure **<measure>**.

## Input

- Merged PRs not yet released   ← must meet: `pr-policy` (as merged)
- Checked: at 7.2, by the agent
- Documented: the field log

## Steps

7.1 **log** — start.
7.2 Check the input against its policy.
7.3 Deploy, or confirm the automatic deploy ran.
7.4 Verify the change in the deployed environment.
7.5 Write the release notes and check them against `release-policy`.
7.6 **log** — what shipped, deploy problems; end.

## Output

- A release, verified, with its notes   ← must meet: `release-policy`
- Checked: at 7.4 and 7.5, by the agent
- Documented: the release notes; the field log

## Hands off to

Operate (8).
