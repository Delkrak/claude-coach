---
name: operate-process
description: Watch the running system and turn each incident into an issue that feeds capture. Use when signals show errors, downtime or user-reported problems.
---

# 7. Operate — Full

A work process. It serves the objective's measure **<measure>**.

## Input

- A release, verified, with its notes (from release)   ← must meet: `/release-policy`
- The signals the project chose (errors, uptime, user reports)
- Checked: at 7.2, by the agent
- Documented: the trace

## Trace

- Every step, through `/devops-drillmaster:trace`: start and end, in and out, state moves, decisions, questions and
  answers, impediments.
- Counted from it: incidents, and time from release to found, at 7.4.

## Steps

7.1 **/devops-drillmaster:trace** — start, on the release.
7.2 Check the input against each rule its work policies set. On a miss: stop, and report the work
    policy and rule it fails ("release work policy 2.2").
7.3 Watch the signals.
7.4 For each incident, write an incident issue, linked to the change that caused it when known, and
    check it against each rule of `/incident-policy`.
7.5 **/devops-drillmaster:trace** — process summary: incidents found, impediments, time to found; end.

## Output

- Incident issues   ← must meet: `/incident-policy`
- Checked: at 7.4, by the agent
- Documented: the incident issue; the trace

## Hands off to

Capture (1), with each incident issue.
