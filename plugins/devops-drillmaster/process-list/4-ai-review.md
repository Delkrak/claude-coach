---
name: ai-review-process
description: Review a draft pull request with AI against the project's policies, round by round, fixing or answering every finding until a round is clean, then mark it ready for the owner. Use when a draft PR is ready for review.
---

# 4. AI review — Standard

An AI agent process. It serves the objective's measure **<measure>**.

## Input

- A draft PR   ← must meet: `pr-policy`; its code the code policies
- Checked: at 4.2, by the agent (CI green)
- Documented: the field log

## Steps

4.1 **log** — start.
4.2 Check the input against its policies.
4.3 Start a review round with a brief naming the code policies, `pr-policy` and the issue's
    acceptance criteria.
4.4 Fix each finding, or answer it on the PR with why not; take judgement calls to the owner.
4.5 Repeat 4.3–4.4 until a round finds nothing, up to the project's cap; past it, go to the owner.
4.6 Check the review against `review-policy`.
4.7 Mark the PR ready.
4.8 **log** — rounds, findings, fixes; end.

## Output

- A ready PR whose review trail is on it   ← must meet: `review-policy`
- Checked: at 4.6, by the agent
- Documented: the review rounds and answers on the PR; the field log

## Hands off to

Debrief (5) and user review (6), with the ready PR.
