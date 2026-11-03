---
name: release-policy
description: Release policy - what a release must have before it counts as shipped. Use whenever merged work is released or deployed, and at every process step that cites it.
---

# Release policy — Full

Applies to: releases, the output of release (7).

## 1. Definitions

1.1 Release: merged work deployed where its users get it.

## 2. Rules

2.1 Claude MUST verify each change in the deployed environment before calling it released.
    Intent: released means working where users are, not merged.
    Check: the field log records the verification.

2.2 Each release MUST have notes listing its issues, in the users' words.
    Intent: users and the owner know what changed.
    Check: the notes exist and list every issue in the release.

2.3 TODO: <the project's release rules: environments, approvals, rollback>.

## 3. Exceptions

None.

## 4. When a rule can't be kept

Tell the owner which rule (§<n>) and why, the way the project asks the owner questions, and wait.

## Cited by

- release (7) — output
