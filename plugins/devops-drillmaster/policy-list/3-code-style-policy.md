---
name: code-style-policy
description: Code style policy - how code reads - naming, the project's terms, formatting, lint, clean-code rules. Use whenever code is written or changed, and at every process step that cites it.
---

# Code style policy — Light

Applies to: code, the output of build (3), and what AI review (4) checks.

Its rules are the project's own, drafted at setup from its conventions, glossary and linters.

## 1. Definitions

1.1 TODO

## 2. Rules

2.1 Claude MUST name things with the project's terms (its glossary, where it has one).
    Intent: one word for one thing, in code, docs and conversation.
    Check: new names for listed concepts use the listed term; the AI review checks it.

2.2 Claude MUST leave the project's formatter and linter green, and MUST NOT disable a rule to get
    there without saying why in the code.
    Intent: style is enforced by tools, not argued in review.
    Check: format and lint checks green in CI; no unexplained disable in the diff.

2.3 TODO: <the project's own style rules>.

## 3. Exceptions

None.

## 4. When a rule can't be kept

Tell the owner which rule (§<n>) and why, the way the project asks the owner questions, and wait.

## Cited by

- build (3) — output; AI review (4) — input
