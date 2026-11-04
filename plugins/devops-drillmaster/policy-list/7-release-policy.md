---
name: release-policy
description: Release work policy - what a release must have before it counts as shipped. Use whenever merged work is released or deployed, and at every work process step that cites it.
---

# Release work policy — Full

Applies to: releases, the output of release (6) and the input of operate (7).

## 1. Definitions

1.1 Release: merged work deployed where its users get it.

## 2. Rules

2.1 Every change in a release MUST be verified in the deployed environment before the release
    counts as shipped.
    Intent: released means working where users are, not merged.
    Check: the trace records each verification.

2.2 Each release MUST have notes listing its issues, in the users' words.
    Intent: users and the owner know what changed.
    Check: the notes exist and list every issue in the release.

2.3 TODO: <the project's release rules: environments, approvals, rollback>.

## 3. Exceptions

None.

## 4. When a rule can't be kept

Tell the owner which rule (`release-policy <rule id>`) and why, the way the project asks the owner
questions, and wait.

## Cited by

- release (6) — output; operate (7) — input
