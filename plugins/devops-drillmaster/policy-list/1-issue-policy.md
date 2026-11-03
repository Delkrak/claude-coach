---
name: issue-policy
description: Issue policy - what an issue must hold at each stage it passes (captured, work-ready). Use whenever an issue is written, changed or moved, and at every process step that cites it.
---

# Issue policy — Light (§2), Standard (§3)

Applies to: issues, the output of capture (1) and refine (2), and the input of refine (2) and
build (3).

## 1. Definitions

1.1 Issue: an item in the project's tracker.
1.2 Kind: what an issue is (e.g. feature, bug, task), as the project labels it.
1.3 Owner: the person who decides for the project.

## 2. Captured

2.1 Claude MUST search the tracker for the same thing before creating an issue, and link a related one.
    Intent: no duplicates; related work stays connected.
    Check: a tracker search precedes the save; documented in the impediment log.

2.2 A captured issue MUST hold the owner's words.
    Intent: refinement starts from what the owner actually said.
    Check: the description quotes the owner.

## 3. Work-ready

3.1 Claude MUST base every claim about today's behaviour on code read in the current checkout, and
    name the files.
    Intent: the spec describes the system as it is.
    Check: the "today" section names files; the impediment log shows them read before the save.

3.2 A work-ready issue MUST state why, today, what, acceptance criteria, out of scope, and notes.
    Intent: every builder finds the same things in the same place.
    Check: the sections are present, in that order.

3.3 Each acceptance criterion MUST name the check that proves it.
    Intent: done is provable.
    Check: every criterion names a test or a check.

3.4 Claude MUST ask the owner every decision the code can't answer, and the consequences that
    aren't obvious, and record the answers on the issue.
    Intent: the owner decides, knowing the cost.
    Check: the questions and answers are on the issue; the impediment log counts them.

3.5 Claude MUST split work too big for one PR into sub-issues that each ship something usable.
    Intent: every PR is reviewable and every merge leaves the system working.
    Check: big issues have sub-issues with blocked-by links.

3.6 An issue MUST become work-ready only on the owner's approval, and MUST then hold a start-work
    brief (`templates/start-work-brief.md`).
    Intent: ready is the owner's approval; a build starts from the issue alone.
    Check: the approval is on the issue; the brief is its last section.

## 4. Exceptions

None.

## 5. When a rule can't be kept

Tell the owner which rule (§<n>) and why, the way the project asks the owner questions, and wait.

## Cited by

- capture (1) — output; refine (2) — input, output; build (3) — input
