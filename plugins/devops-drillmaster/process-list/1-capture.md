---
name: capture-process
description: Capture an idea, a bug, a change or an incident as an issue in the tracker's backlog, quickly and without reading code. Use when the owner shares something to keep for later, or operate hands over an incident issue.
---

# 1. Capture — Light

A work process. It serves the objective's measure **<measure>**.

## Input

- The owner's idea, in their words   ← must meet: nothing (any idea may be captured)
- Or an incident issue (from operate)   ← must meet: `/incident-policy` 2.1–2.2
- Checked: at 1.2, by the agent
- Documented: the trace

## Trace

- Every step, through `/devops-drillmaster:trace`: start and end, in and out, state moves, decisions, questions and
  answers, impediments.
- Counted from it: time taken, at 1.8.

## Steps

1.1 **/devops-drillmaster:trace** — start.
1.2 Check the input against each rule its work policies set. On a miss: stop, and report the work
    policy and rule it fails ("incident work policy 2.1").
1.3 Search the tracker for the same thing; link or add to it instead of creating a duplicate.
1.4 Write the title and the owner's words as the description.
1.5 Set the kind and the epic or project, when the owner named them.
1.6 Check the issue against each rule of `/issue-policy` §2 (captured).
1.7 Save it in the backlog state.
1.8 **/devops-drillmaster:trace** — process summary: the issue saved, impediments, time taken; end.

## Output

- An issue in the backlog   ← must meet: `/issue-policy` §2 (captured)
- Checked: at 1.6, by the agent
- Documented: the trace

## Hands off to

Refine (2), with the issue; build (3) when the project has no refine.
