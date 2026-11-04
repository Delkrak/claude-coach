---
name: code-architecture-policy
description: Code architecture work policy - how code is structured - where a piece lives, how modules depend on each other, the structural invariants. Use whenever code is placed, structured or named, and at every work process step that cites it.
---

# Code architecture work policy — Light

Applies to: code, the output of build (3), and the input of AI review (4).

Its rules are the project's own: setup drafts them from the project's architecture notes and
CLAUDE.md files, each principle checked against the code first (live? enforced? structural?), and
accepted by the owner rule by rule. Typical subjects: where shared logic lives; one entry point per
mutation; what may depend on what; where configuration is read; naming of files and folders.

## 1. Definitions

1.1 TODO

## 2. Rules

2.1 TODO: Code MUST <structural property>.
    Intent: <why the structure is this way>.
    Check: <what in the diff shows it kept; where the result is documented>.

## 3. Exceptions

None.

## 4. When a rule can't be kept

Tell the owner which rule (`code-architecture-policy <rule id>`) and why, the way the project asks
the owner questions, and wait.

## Cited by

- build (3) — output; AI review (4) — input
