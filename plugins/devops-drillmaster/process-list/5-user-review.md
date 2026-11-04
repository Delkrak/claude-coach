---
name: user-review-process
description: The owner's review of a ready pull request - merged, or sent back with feedback that is built into the same PR and reviewed again. Use when a PR is ready for the owner, or the owner comments on or merges it.
---

# 5. User review — Light

A work process (the agent carries out the owner's review decisions). It serves the objective's
measure **<measure>**.

## Input

- A ready PR whose review trail is on it (from AI review), or the PR marked ready (from build, when
  the project has no AI review)   ← must meet: `pr-policy` 2.3; `review-policy` when the project
  has AI review
- Checked: at 5.2, by the agent
- Documented: the capture

## Records

- Impediments: at every step, through `impediment-and-metric-capture`.
- Metrics: rework rounds, at 5.4; time taken, at 5.6.

## Steps

5.1 **impediment-and-metric-capture** — start.
5.2 Check the input against each rule its work policies set. On a miss: stop, and report the work
    policy and rule it fails ("PR work policy 2.3").
5.3 The owner reviews the PR.
5.4 Feedback: return the PR to draft, build the feedback into it (build-process 3.5–3.8), and run
    AI review (4) again.
5.5 The owner merges; check the merged PR against each rule of `pr-policy` §3 (merged).
5.6 **impediment-and-metric-capture** — process summary: the owner's feedback, impediments, rework rounds, time taken;
    end.

## Output

- A merged PR; the issue done   ← must meet: `pr-policy` §3 (merged)
- Checked: at 5.5, by the agent
- Documented: the merge on the PR; the item summary, updated (`impediment-and-metric-capture` 2.4)

## Hands off to

Release (6), with the merged PR, when the project deploys beyond merge.
