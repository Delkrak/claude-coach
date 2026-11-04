---
name: pr-policy
description: Pull request work policy - what a PR must hold from draft to ready, and what holds once it is merged. Use whenever a PR is opened, updated, marked ready or merged, and at every work process step that cites it.
---

# PR work policy — Light

Applies to: pull requests, the output of build (3), the input of AI review (4) and user review (5),
and as merged, the output of user review (5) and the input of release (6).

## 1. Definitions

1.1 PR: a pull (or merge) request on the project's git host.

## 2. Open

2.1 A PR MUST name its issue in its title and link it in its body, so the tracker links the two.
    Intent: every change traces to its issue and back.
    Check: the issue id is in the title and the body.

2.2 A PR's body MUST say what the owner will see, how to try it, each acceptance criterion with
    where it is covered, the assumptions made, and what was noticed but not done (linked issues).
    Intent: the owner reviews from the PR alone.
    Check: the parts are present.

2.3 A PR MUST be opened as a draft, and MUST be marked ready only after a clean AI review round
    (when the project has AI review).
    Intent: the owner sees only reviewed work.
    Check: the PR's history shows draft → ready after the last clean round.

2.4 A PR MUST be merged only by the owner, or as the project's process allows.
    Intent: merging is the owner's decision.
    Check: who merged, on the PR.

2.5 A PR that changes something the owner must act on after merging (a migration, a setting) MUST
    say so at its top.
    Intent: nothing surprises the owner after the merge.
    Check: such PRs open with the note.

## 3. Merged

3.1 A merged PR MUST be merged into the project's default branch, with its checks green.
    Intent: merged work is what the next release takes.
    Check: the PR's base is the default branch; CI was green at the merge.

3.2 A merged PR's issue MUST be in the done state.
    Intent: the tracker shows what is finished.
    Check: the linked issue's state.

## 4. Exceptions

None.

## 5. When a rule can't be kept

Tell the owner which rule (`pr-policy <rule id>`) and why, the way the project asks the owner
questions, and wait.

## Cited by

- build (3) — output; AI review (4) — input, output; user review (5) — input, output; release (6) —
  input
