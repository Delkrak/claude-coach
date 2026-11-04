---
name: ai-review-process
description: Review a draft pull request with AI against the project's work policies, round by round, fixing or answering every finding until a round is clean, then mark it ready for the owner. Use when a draft PR is ready for review.
---

# 4. AI review — Standard

A work process. It serves the objective's measure **<measure>**.

## Input

- A draft PR   ← must meet: `pr-policy` §2; its code the code work policies
- Checked: at 4.2, by the agent (CI green)
- Documented: the capture

## Records

- Impediments: at every step, through `impediment-and-metric-capture`.
- Metrics: review rounds and findings, at 4.5; time taken, at 4.8.

## Steps

4.1 **impediment-and-metric-capture** — start.
4.2 Check the input against each rule its work policies set. On a miss: stop, and report the work
    policy and rule it fails ("PR work policy 2.2").
4.3 Start a review round with a request naming the code work policies, `pr-policy` and the issue's
    acceptance criteria.
4.4 Fix each finding, or answer it on the PR with why not; take judgement calls to the owner.
4.5 Repeat 4.3–4.4 until a round finds nothing, up to the project's cap; past it, go to the owner.
4.6 Check the review against each rule of `review-policy`.
4.7 Mark the PR ready.
4.8 **impediment-and-metric-capture** — process summary: rounds, findings, impediments, time taken;
    then the item summary; end.

## Output

- A ready PR whose review trail is on it   ← must meet: `review-policy`, `pr-policy` 2.3
- Checked: at 4.6, by the agent
- Documented: the review rounds and answers on the PR; the capture

## Hands off to

User review (5), with the ready PR and its item summary.
