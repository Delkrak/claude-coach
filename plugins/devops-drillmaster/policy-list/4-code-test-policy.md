---
name: code-test-policy
description: Code test work policy - what tests a change carries and when it counts as verified. Use whenever code is written or changed, and at every work process step that cites it.
---

# Code test work policy — Light

Applies to: tests and checks, part of build's (3) output, and the input of AI review (4).

## 1. Definitions

1.1 Checks: the commands the project runs to verify a change (tests, typecheck, lint, build).

## 2. Rules

2.1 A bug fix MUST carry a test that fails without the fix.
    Intent: the test proves the bug was real and stays fixed.
    Check: the test fails on the base branch and passes on the PR.

2.2 Each acceptance criterion MUST be covered by the check it names.
    Intent: done is proven, not claimed.
    Check: the PR maps each criterion to its test or check.

2.3 A change MUST have the project's checks green before it is called done.
    Intent: done means verified.
    Check: green checks precede the claim; CI results on the PR.

2.4 TODO: <the project's test layers and where each kind of test belongs>.

## 3. Exceptions

None.

## 4. When a rule can't be kept

Tell the owner which rule (`code-test-policy <rule id>`) and why, the way the project asks the
owner questions, and wait.

## Cited by

- build (3) — output; AI review (4) — input
