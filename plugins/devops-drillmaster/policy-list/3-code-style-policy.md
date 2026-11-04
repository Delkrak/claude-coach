---
name: code-style-policy
description: Code style work policy - how code reads - naming, the project's terms, formatting, lint, clean-code rules. Use whenever code is written or changed, and at every work process step that cites it.
---

# Code style work policy — Light

Applies to: code, the output of build (3), and the input of AI review (4).

Its rules are the project's own, drafted at setup from its conventions, glossary and linters.

## 1. Definitions

1.1 TODO

## 2. Rules

2.1 Code MUST name things with the project's terms (its glossary, where it has one).
    Intent: one word for one thing, in code, docs and conversation.
    Check: new names for listed concepts use the listed term; the AI review checks it.

2.2 Code MUST pass the project's formatter and linter; a disabled lint rule MUST say why in the code.
    Intent: style is enforced by tools, not argued in review.
    Check: format and lint checks green in CI; no unexplained disable in the diff.

2.3 TODO: <the project's own style rules>.

## 3. Exceptions

None.

## 4. When a rule can't be kept

Tell the owner which rule (`code-style-policy <rule id>`) and why, the way the project asks the
owner questions, and wait.

## Cited by

- build (3) — output; AI review (4) — input
