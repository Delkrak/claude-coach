---
name: summary-process
description: Write a work item's item summary on its PR before the owner reviews it, from the process summaries in its impediment log, and update it after the merge. Use when a PR is marked ready, and after it merges.
---

# 5. Item summary — Light

An AI agent process. It serves the objective's measure **<measure>**.

## Input

- The work item's impediment log, with a process summary for every process so far   ← must meet:
  drill master POLICIES §3, §4.5 (entries in form)
- Checked: at 5.1, by the agent
- Documented: —

## Steps

5.1 Check the impediment log is complete: every process so far has a start and a process summary.
5.2 Write the item summary from `templates/summary.md`: outcome, time per process, impediments by
    kind, review rounds, noticed items, built from the process summaries.
5.3 Add an observation to each running experiment this item bears on.
5.4 After the merge, update the item summary with the owner's review.

## Output

- An item summary   ← must meet: `templates/summary.md` (all sections filled)
- Checked: at 5.2, by the agent
- Documented: where Log storage says (PR comment or `.drillmaster/items/<id>/summary.md`)

## Hands off to

User review (6); after the merge, the retrospective (9).
