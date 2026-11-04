---
name: issue-policy
description: Issue work policy - what an issue must hold at each stage it passes (captured, work-ready). Use whenever an issue is written, changed or moved, and at every work process step that cites it.
---

# Issue work policy — Light (§2), Standard (§3)

Applies to: issues, the output of capture (1) and refine (2), and the input of refine (2) and
build (3).

## 1. Definitions

1.1 Issue: an item in the project's tracker.
1.2 Kind: what an issue is (e.g. feature, bug, task), as the project labels it.
1.3 Owner: the person who decides for the project.

## 2. Captured

2.1 A captured issue MUST NOT duplicate an issue already in the tracker, and MUST link a related one.
    Intent: no duplicates; related work stays connected.
    Check: a tracker search for its title finds no other issue for the same thing; related issues
    are linked.

2.2 A captured issue MUST hold the owner's words.
    Intent: refinement starts from what the owner actually said.
    Check: the description quotes the owner.

## 3. Work-ready

3.1 Every claim a work-ready issue makes about today's behaviour MUST hold in the current code, and
    MUST name its files.
    Intent: the spec describes the system as it is.
    Check: the "today" section names files; reading them confirms each claim.

3.2 A work-ready issue MUST state why, today, what, acceptance criteria, out of scope, and notes.
    Intent: every builder finds the same things in the same place.
    Check: the sections are present, in that order.

3.3 Each acceptance criterion MUST name the check that proves it.
    Intent: done is provable.
    Check: every criterion names a test or a check.

3.4 A work-ready issue MUST hold the owner's answer to every decision the code can't answer, and to
    every consequence that isn't obvious.
    Intent: the owner decides, knowing the cost.
    Check: the questions and answers are on the issue.

3.5 A work-ready issue MUST fit in one PR; larger work MUST be split into sub-issues that each ship
    something usable.
    Intent: every PR is reviewable and every merge leaves the system working.
    Check: no work-ready issue spans more than one PR; split work has sub-issues with blocked-by
    links.

3.6 An issue MUST become work-ready only on the owner's approval, and MUST then end with a
    start-work brief: a paste-ready kickoff line naming the build work process, the issue it is
    blocked by or none, and the branch and PR it delivers.
    Intent: ready is the owner's approval; a build starts from the issue alone.
    Check: the approval is on the issue; the brief is its last section.

## 4. Exceptions

None.

## 5. When a rule can't be kept

Tell the owner which rule (`issue-policy <rule id>`) and why, the way the project asks the owner
questions, and wait.

## Cited by

- capture (1) — output; refine (2) — input, output; build (3) — input
