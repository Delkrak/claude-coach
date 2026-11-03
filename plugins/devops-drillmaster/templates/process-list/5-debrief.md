---
name: debrief-process
description: Summarise a work item's field log as its debrief on the PR before the owner reviews it, and update it after the merge. Use when a PR is marked ready, and after it merges.
---

# 5. Debrief — Light

An AI agent process. It serves the objective's measure **<measure>**.

## Input

- The work item's field log   ← must meet: drill master POLICIES §3, §4.5 (entries in form)
- Checked: at 5.1, by the agent
- Documented: —

## Actions

5.1 Check the field log is complete: every process so far has a start and an end.
5.2 Write the debrief from `templates/debrief.md`: outcome, time per stage, friction by kind,
    review rounds, noticed items.
5.3 Add an observation to each running experiment this item bears on.
5.4 After the merge, update the debrief with the owner's review.

## Output

- A debrief   ← must meet: `templates/debrief.md` (all sections filled)
- Checked: at 5.2, by the agent
- Documented: where Log storage says (PR comment or `.drillmaster/drills/<id>/`)

## Hands off to

User review (6); after the merge, the after-action review (9).
