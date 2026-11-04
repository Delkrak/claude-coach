---
name: impediment-and-metric-capture
description: Record a work item's impediments and metrics as each work process's specification says, close every work process with its process summary, and write the item summary on the PR - where the project's log storage says (by default on the issue, then the PR). Never changes a skill. Use at the start and end of every work process, whenever friction happens (the owner corrects or redirects Claude, work is redone or stuck, information is missing - the prompt hook cues corrections), and when a PR is marked ready. Only in a project with .drillmaster/process.md.
---

# Impediment and metric capture

The impediment and metric capture is a work item's running record. Each work process's
specification says what it records; every work process closes with a **process summary**; the
**item summary** on the PR is built from those. Only what is recorded here reaches the
retrospective ← `POLICIES.md` §2.5. All of it lives where `.drillmaster/process.md`'s **Log
storage** says ← §4.2. This skill never changes a skill ← §1.1.

`POLICIES.md` and `templates/` are at the plugin root, two folders up from this skill's base
directory. Read `.drillmaster/process.md` first: it names the work processes, the log storage and
the templates.

**Arguments:** $ARGUMENTS, optional: what happened, in the owner's own words (e.g. "the review was
slow"). Work out the work process, the step and whether it is a start, impediment, metric, summary
or item summary from the situation.

Every step has an id, cited as `impediment-and-metric-capture <id>` ← §0.8.

## 1. Entries

Every entry follows `templates/capture.md`: time (read from the clock ← §4.3), the work process
step it belongs to by id (e.g. `build-process 3.5`), and evidence ← §2.1.

1.1 **start** — at the beginning of a work process: `time · started`.

1.2 **impediment** — whenever there is friction of any kind, such as what slowed the work down,
    what was missing, or what the owner had to correct (the prompt hook cues corrections; decide
    whether it really is one — a new request is not) ← §3.1. Record what happened and its gap:
    process, policy or not covered ← §3.2, §3.3.

1.3 **metric** — whenever the work process's specification names a metric to record at this step
    (time taken, corrections made, review rounds), record its value ← §3.1.

1.4 **summary** — at the end of a work process: its **process summary**: outcome, impediments,
    the metrics its specification names, plus anything not yet recorded.

1.5 Write it where Log storage says ← §4.2:
    - **comments**: one running comment titled `Capture — <item>` on the issue during capture and
      refinement; when the PR opens, copied into one running comment on the PR and appended there.
      Update the running comment rather than posting a new one.
    - **items**: `.drillmaster/items/<work item id>/capture.md`, committed on the work item's
      branch.

1.6 For an owner correction only, report to the owner in one line, e.g. "Recorded: build 3.5,
    process gap. Carry on."

## 2. Item summary

When the PR is marked ready for the owner's review (the done hook asks):

2.1 Read the item's process summaries.

2.2 Write the item summary from `templates/summary.md`: its own PR comment (**comments**), or
    `.drillmaster/items/<work item id>/summary.md` (**items**).

2.3 Add an observation to each running experiment in `.drillmaster/experiments.md` that this item
    bears on: whether its impediment was seen, and the measure's value, with a link ← §2.1.

2.4 After the merge, update the item summary with the owner's review: rework rounds, comments, merge
    time.

2.5 Report in one line when a retrospective is due: a running experiment has 3 or more observations,
    or the project's retrospective rhythm says so, e.g. "Status: E2 has 3 observations.
    Retrospective due. Move!" Otherwise say nothing more.
