---
name: code-test-policy
description: Code test policy - what tests a change carries and when it counts as verified. Use whenever code is written or changed, and at every process step that cites it.
---

# Code test policy — Light

Applies to: tests and checks, part of build's (3) output, and what AI review (4) checks.

## 1. Definitions

1.1 Checks: the commands the project runs to verify a change (tests, typecheck, lint, build).

## 2. Rules

2.1 Claude MUST start a bug fix with a test that fails without the fix.
    Intent: the test proves the bug was real and stays fixed.
    Check: the impediment log shows the failing run before the fix.

2.2 Each acceptance criterion MUST be covered by the check it names.
    Intent: done is proven, not claimed.
    Check: the PR maps each criterion to its test or check.

2.3 Claude MUST NOT call a change done until the project's checks are green.
    Intent: done means verified.
    Check: green checks precede the claim; CI results on the PR.

2.4 TODO: <the project's test layers and where each kind of test belongs>.

## 3. Exceptions

None.

## 4. When a rule can't be kept

Tell the owner which rule (§<n>) and why, the way the project asks the owner questions, and wait.

## Cited by

- build (3) — output; AI review (4) — input
