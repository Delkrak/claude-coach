---
name: impediment-log
description: Keep a work item's impediment log, close every process with its process summary, and write the item summary on the PR - recording the owner's corrections, development friction, missing information and time, where the project's log storage says (by default on the issue, then the PR). Never changes a skill. Use at the start and end of every process, when the owner corrects or redirects Claude (the prompt hook cues it), when work gets stuck or information is missing, and when a PR is marked ready. Only in a project with .drillmaster/process.md.
---

# Impediment log

The impediment log is a work item's running record. Every process closes with a **process summary**
in it; the **item summary** on the PR is built from those. All of it lives where
`.drillmaster/process.md`'s **Log storage** says ← `POLICIES.md` §4.2. This skill never changes a
skill ← §1.1.

`POLICIES.md` and `templates/` are at the plugin root, two folders up from this skill's base
directory. Read `.drillmaster/process.md` first: it names the processes, the log storage and the
templates.

**Arguments:** $ARGUMENTS: `start`, `entry`, `summary` or `item-summary`. With none, pick from the
situation.

Every step has an id, cited as `impediment-log <id>` ← §0.8.

## 1. Entries

Every entry follows `templates/impediment-log.md`: time (read from the clock ← §4.3), the process
step it belongs to by id (e.g. `build-process 3.5`), **kind**, what happened, the gap for an
impediment, and evidence ← §2.1, §3.

1.1 **start** — at the beginning of a process: `time · started`.

1.2 **entry** — whenever one of these happens:
    - **owner correction**: the owner corrects, redirects, repeats, stops or undoes something (the
      prompt hook cues this; decide whether it really is one — a new request is not);
    - **development friction**: work redone, retried, stuck, or slower than it needed to be;
    - **missing information**: something needed to continue was not where the process said.
    Classify each by gap: process, policy or not covered ← §3.2, §3.3.

1.3 **summary** — at the end of a process: its **process summary**: outcome, impediments by kind,
    time, plus anything not yet logged.

1.4 Write it where Log storage says ← §4.2:
    - **comments**: one running comment titled `Impediment log — <item>` on the issue during capture
      and refinement; when the PR opens, copied into one running comment on the PR and appended
      there. Update the running comment rather than posting a new one.
    - **items**: `.drillmaster/items/<work item id>/impediment-log.md`, committed on the work item's
      branch.

1.5 For an owner correction only, report to the owner in one line: "Logged: <the gap>."

## 2. Item summary

When the PR is marked ready for the owner's review (the done hook asks):

2.1 Read the item's process summaries, and cross-check time per process against the tracker's
    state times.

2.2 Write the item summary from `templates/summary.md`: its own PR comment (**comments**), or
    `.drillmaster/items/<work item id>/summary.md` (**items**).

2.3 Add an observation to each running experiment in `.drillmaster/experiments.md` that this item
    bears on: `seen | not seen — <link>` ← §2.1.

2.4 After the merge, update the item summary with the owner's review: rework rounds, comments, merge
    time.

2.5 Report in one line that `/devops-drillmaster:retrospective` is due when a running experiment has
    3 or more observations, or the project's retrospective rhythm says so. Otherwise say nothing more.
