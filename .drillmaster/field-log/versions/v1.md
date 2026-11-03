---
name: field-log
description: Keep a work item's field log and write its debrief - the logging step every process begins and ends with, recording the owner's corrections, development friction, missing information and time, where the project's log storage says (by default on the issue, then the PR). Never changes a skill. Use at the start and end of every process step, when the owner corrects or redirects Claude (the prompt hook cues it), when work gets stuck or information is missing, and when a PR is marked ready (debrief). Only in a project with .drillmaster/process.md.
---

# Field log

The field log is a work item's running record; the debrief is its summary on the PR. Both are
artifacts of the work, kept where `.drillmaster/process.md`'s **Log storage** says, never in the
repository ← `POLICIES.md` §4.2. This skill never changes a skill ← §1.1.

`POLICIES.md` and `templates/` are at the plugin root, two folders up from this skill's base
directory. Read `.drillmaster/process.md` first: it names the processes, the log storage and the
templates.

**Arguments:** $ARGUMENTS: `start`, `entry`, `end` or `debrief`. With none, pick from the situation.

## Entries

Every entry follows `templates/field-log.md`: time (read from the clock ← §4.3), stage and step,
**kind**, what happened, the gap for friction, and evidence ← §2.1, §3.

- **start** — at the beginning of a process step: `time · started`.
- **entry** — whenever one of these happens during a step:
  - **owner correction**: the owner corrects, redirects, repeats, stops or undoes something (the
    prompt hook cues this; decide whether it really is one — a new request is not);
  - **development friction**: work redone, retried, stuck, or slower than it needed to be;
  - **missing information**: something needed to continue was not where the process said.
  Classify each by gap: process, policy or not covered ← §3.2, §3.3.
- **end** — at the end of a process step: `time · ended`, plus anything not yet logged.

Where it goes: the place Log storage names for this stage. By default that is one running comment
titled `Field log — <item>` on the issue during capture and refinement; when the PR opens, the log
is copied into one running comment on the PR and appended there from then on. Update the running
comment rather than posting a new one.

After writing, one line to the owner, only for an owner correction: "Logged: <the gap, a few words>."

## Debrief

When the PR is marked ready for the owner's review (the done hook asks):

1. Read the item's field log, and cross-check time per stage against the tracker's state times.
2. Write the debrief from `templates/debrief.md` as its own PR comment, or where Log storage says.
3. Add an observation to each running experiment in `.drillmaster/experiments.md` that this item
   bears on: `seen | not seen — <link>` ← §2.1.
4. After the merge, update the debrief with the owner's review: rework rounds, comments, merge time.
5. Suggest `/devops-drillmaster:after-action-review` in one line when a running experiment has 3 or
   more observations, or the owner's chosen AAR rhythm says it is due. Otherwise say nothing more.
