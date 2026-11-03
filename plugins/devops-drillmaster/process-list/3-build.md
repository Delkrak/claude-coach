---
name: build-process
description: Build one work-ready issue into a draft pull request that meets the code and PR policies. Use when a session starts on a work-ready issue, or resumes one in progress.
---

# 3. Build — Light

An AI agent process. It serves the objective's measure **<measure>**.

## Input

- A work-ready issue with its start-work brief   ← must meet: `issue-policy` §3 (work-ready)
- Checked: at 3.2, by the agent (including that its "today" still matches the code)
- Documented: the impediment log

## Steps

3.1 **log** — start.
3.2 Check the input against its policy and re-check its "today" against the code; a gap goes to the
    owner. If the issue it is blocked by has no PR yet, don't start.
3.3 Move the issue to in progress.
3.4 Choose the base branch (the blocker's branch while its PR is open) and create the issue's branch.
3.5 Build it; a bug fix starts with a failing test.
3.6 File each thing noticed but out of scope as a new issue (capture, 1).
3.7 Check the code against `code-architecture-policy`, `code-style-policy` and `code-test-policy`,
    and run the project's checks.
3.8 Open the PR as a draft and check it against `pr-policy`.
3.9 **log** — process summary: what was built, development friction, noticed items, time; end.

## Output

- Code   ← must meet: `code-architecture-policy`, `code-style-policy`, `code-test-policy`
- A draft PR   ← must meet: `pr-policy`
- Checked: at 3.7 and 3.8, by the agent and the project's checks (CI)
- Documented: the impediment log; CI results on the PR

## Hands off to

AI review (4), with the draft PR.
