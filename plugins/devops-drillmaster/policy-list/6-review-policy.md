---
name: review-policy
description: Review policy - what a review must check, how its findings are handled, and the trail it leaves on the PR. Use whenever a PR is reviewed, by AI or the owner, and at every process step that cites it.
---

# Review policy — Standard

Applies to: reviews, the output of AI review (4), and the input of user review (6).

## 1. Definitions

1.1 Round: one request for review and its answer.
1.2 Finding: one point a round raises.

## 2. Rules

2.1 Each round MUST be asked against the project's code policies, `pr-policy` and the issue's
    acceptance criteria, named in the request.
    Intent: the review checks the project's own rules, not a general taste.
    Check: each request names them; each finding names the rule or criterion.

2.2 Claude MUST fix every finding, or answer it on the PR with why not; a judgement call goes to the
    owner.
    Intent: no finding is silently dropped; the owner's choices stay the owner's.
    Check: each finding has a fix commit or a reply.

2.3 Every round, finding and what was done about it MUST stay visible on the PR.
    Intent: the trail shows that the review happened, what it found, and what was done.
    Check: the rounds, findings and replies are on the PR.

2.4 Rounds MUST stop at a clean round, or at the project's cap, past which the owner decides.
    Intent: review settles instead of looping.
    Check: the PR shows a clean round, or the owner's decision after the cap.

## 3. Exceptions

None.

## 4. When a rule can't be kept

Tell the owner which rule (§<n>) and why, the way the project asks the owner questions, and wait.

## Cited by

- AI review (4) — output; user review (6) — input
