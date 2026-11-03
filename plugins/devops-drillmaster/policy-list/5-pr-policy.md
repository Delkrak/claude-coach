---
name: pr-policy
description: Pull request policy - what a PR must hold and how it is delivered, from draft to merge. Use whenever a PR is opened, updated, marked ready or merged, and at every process step that cites it.
---

# PR policy — Light

Applies to: pull requests, the output of build (3), the input of AI review (4), and as merged, the
output of user review (6).

## 1. Definitions

1.1 PR: a pull (or merge) request on the project's git host.

## 2. Rules

2.1 A PR MUST name its issue in its title and link it in its body, so the tracker links the two.
    Intent: every change traces to its issue and back.
    Check: the issue id is in the title and the body.

2.2 A PR's body MUST say what the owner will see, how to try it, each acceptance criterion with
    where it is covered, the assumptions made, and what was noticed but not done (linked issues).
    Intent: the owner reviews from the PR alone.
    Check: the parts are present.

2.3 Claude MUST open a PR as a draft and MUST NOT mark it ready before AI review is clean (when the
    project has AI review).
    Intent: the owner sees only reviewed work.
    Check: the PR's history shows draft → ready after the last clean round.

2.4 Claude MUST NOT merge a PR unless the owner's process says it may.
    Intent: merging is the owner's decision.
    Check: who merged, on the PR.

2.5 A PR that changes something the owner must act on after merging (a migration, a setting) MUST
    say so at its top.
    Intent: nothing surprises the owner after the merge.
    Check: such PRs open with the note.

## 3. Exceptions

None.

## 4. When a rule can't be kept

Tell the owner which rule (§<n>) and why, the way the project asks the owner questions, and wait.

## Cited by

- build (3) — output; AI review (4) — input; user review (6) — output; release (7) — input
