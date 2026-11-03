---
name: operate-process
description: Watch the running system and turn each incident into an issue that feeds capture. Use when signals show errors, downtime or user-reported problems.
---

# 8. Operate — Full

An AI agent process. It serves the objective's measure **<measure>**.

## Input

- The signals the project chose (errors, uptime, user reports)   ← must meet: nothing
- Checked: —
- Documented: —

## Steps

8.1 Watch the signals.
8.2 For each incident, capture it as an issue (1), linked to the change that caused it when known,
    and check it against `incident-policy`.
8.3 **log** — on the incident issue: what happened, how it was found.

## Output

- Incident issues   ← must meet: `incident-policy`
- Checked: at 8.2, by the agent
- Documented: the incident issue

## Hands off to

Capture (1) and refine (2), with the incident issue.
