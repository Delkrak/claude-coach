---
name: incident-policy
description: Incident work policy - what an incident issue must hold so it can be fixed and learned from. Use whenever an incident is captured, and at every work process step that cites it.
---

# Incident work policy — Full

Applies to: incident issues, the output of operate (7) and an input of capture (1).

## 1. Definitions

1.1 Incident: something users or the running system suffered that a change should not have caused,
    or that the system should have handled.

## 2. Rules

2.1 An incident issue MUST say what happened, when, who or what was affected, and how it was found.
    Intent: it can be reproduced and prioritised.
    Check: the four are on the issue.

2.2 An incident issue MUST link the change that caused it, when known.
    Intent: the work process that let it through can be improved in the retrospective.
    Check: the link is on the issue, or it says the cause is unknown.

## 3. Exceptions

None.

## 4. When a rule can't be kept

Tell the owner which rule (`incident-policy <rule id>`) and why, the way the project asks the owner
questions, and wait.

## Cited by

- operate (7) — output; capture (1) — input
