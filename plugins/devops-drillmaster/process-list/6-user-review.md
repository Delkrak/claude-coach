---
name: user-review-process
description: The owner's review of a ready pull request - merged, or sent back with feedback that is built into the same PR and reviewed again. Use when a PR is ready for the owner, or the owner comments on or merges it.
---

# 6. User review — Light

An AI agent process (the agent carries out the owner's review decisions). It serves the objective's
measure **<measure>**.

## Input

- A ready PR with its debrief   ← must meet: `review-policy`
- Checked: at 6.2, by the agent
- Documented: the field log

## Steps

6.1 **log** — start.
6.2 Check the input against its policy.
6.3 The owner reviews the PR.
6.4 Feedback: return the PR to draft, build the feedback into it (3.5–3.8), and run AI review (4)
    again.
6.5 The owner merges; the issue moves to done.
6.6 **log** — the owner's feedback, rework rounds; end.

## Output

- A merged PR; the issue done   ← must meet: `pr-policy` (as merged)
- Checked: at 6.5, by the owner
- Documented: the merge on the PR; the debrief, updated (5.4)

## Hands off to

Release (7) when the project deploys beyond merge; otherwise the after-action review (9).
