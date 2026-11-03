---
name: capture-process
description: Capture an idea, a bug or a change as an issue in the tracker's backlog, quickly and without reading code. Use when the owner shares something to keep for later.
---

# 1. Capture — Light

An AI agent process. It serves the objective's measure **<measure>**.

## Input

- The owner's idea, in their words   ← must meet: nothing (any idea may be captured)
- Checked: —
- Documented: —

## Actions

1.1 **log** — start.
1.2 Search the tracker for the same thing; link or add to it instead of creating a duplicate.
1.3 Write the title and the owner's words as the description.
1.4 Set the kind and the epic or project, when the owner named them.
1.5 Check the issue against `issue-policy` §2 (captured).
1.6 Save it in the backlog state.
1.7 **log** — the owner's words, anything missing; end.

## Output

- An issue in the backlog   ← must meet: `issue-policy` §2 (captured)
- Checked: at 1.5, by the agent
- Documented: the field log

## Hands off to

Refine (2), with the issue.
