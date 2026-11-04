---
name: trace
description: Trace a work item - every step's start and end, what went in and came out (linked), decisions, questions and answers, state moves and every impediment - so what happened can be rebuilt and the objective's measures computed from it; close every work process with its process summary and write the item summary on the PR. Where the project's log storage says: a `<key>-trace.json` attached to the issue, a running comment on the issue then the PR, or the repo. Never changes a skill. Use at every step of every work process, whenever friction happens (the owner corrects or redirects Claude, work is redone or stuck, information is missing - the prompt hook cues corrections), and when a PR is marked ready. Only in a project with .drillmaster/process.md.
---

# Trace

The trace is a work item's running record: enough to rebuild what happened at every step. The
objective's measures are computed from it; every work process closes with a **process summary**;
the **item summary** on the PR is built from those. Only what is traced reaches the retrospective
← `POLICIES.md` §2.5. All of it lives where `.drillmaster/process.md`'s **Log storage** says ←
§4.2. This skill never changes a skill ← §1.1.

`POLICIES.md` and `templates/` are at the plugin root, two folders up from this skill's base
directory. Read `.drillmaster/process.md` first: it names the work processes, the log storage and
the templates.

**Arguments:** $ARGUMENTS, optional: what happened, in the owner's own words (e.g. "the review was
slow"). Work out the work process, the step and the kind of entry from the situation.

Every step has an id, cited as `/devops-drillmaster:trace <id>` ← §0.8.

## 1. Entries

Every entry is written at the moment it happens, never later from memory, with its time read from
the clock ← §4.3, in the form of `templates/trace.md`. With **attachment** storage, the trace tool
`scripts/trace.mjs` at the plugin root writes every entry: it stamps the clock, checks the
entry's form and chains an FNV-1a checksum, so a trace edited by hand no longer verifies.

```
node "<plugin root>/scripts/trace.mjs" add --file <folder> --key <work item id> \
  --process /<work process> --step <id> --kind <kind> --text "<what>" [the kind's fields]
node "<plugin root>/scripts/trace.mjs" verify --file <folder>/<key>-trace.json
```

In Git Bash, run it with `MSYS_NO_PATHCONV=1`: otherwise `/build-process` reaches the tool as a
Windows path, and the tool refuses it. A refusal from the tool is fixed by adding what it asks
for, never by writing the file another way.

Each entry names the work process step by id (e.g. `/build-process 3.5`), its kind, and a link as
evidence ← §2.1. Link what the tracker, the git host and the session already hold (an issue, a
commit, a PR, a comment, a session id); never copy it.

1.1 **start** and **end** — when a step starts and ends; the start of a work process names the skill
    and its version, and the session.

1.2 **in** and **out** — what a step took in and handed on, linked (the issue, the spec, a commit,
    the PR, a review round's comment).

1.3 **state** — every tracker state move, from → to.

1.4 **decision** — a choice made at the step, and who made it (the owner, quoted, or the agent, with
    why).

1.5 **question** and **answer** — a question to the owner and the answer, with the state the issue
    was in.

1.6 **impediment** — whenever there is friction of any kind, such as what slowed the work down,
    what was missing, or what the owner had to correct (the prompt hook cues corrections; decide
    whether it really is one — a new request is not) ← §3.1. Record what happened and its gap:
    process, policy or not covered ← §3.2, §3.3.

1.7 **observation** — when the work item bears on a running experiment in
    `.drillmaster/experiments.md`: whether its impediment was seen, and the measure's value. The
    retrospective reads it from the trace; never write to `experiments.md` on a work item's branch.

1.8 **summary** — at the end of a work process: its **process summary**: outcome, time taken,
    impediments, questions and corrections counted from the trace, over the whole run of the work
    process (from its first step's start). With the tool, give the outcome and the tool counts the
    rest; an impediment the owner caused by correcting Claude carries `--correction`.

1.9 Write it where Log storage says ← §4.2:
    - **attachment**: `<key>-trace.json`, written by the tool in the session's scratch folder and
      attached to the issue (1.11), for the work item's whole life. Nothing else holds the trace.
    - **comments**: one running comment titled `Trace — <item>` on the issue until the PR opens;
      then copied into one running comment on the PR and appended there, after the merge too.
      Update the running comment rather than posting a new one. Before the issue exists, keep the
      entries in the session and post them once it does.
    - **items**: `.drillmaster/items/<work item id>/trace.md`, committed on the work item's branch.

1.10 For an owner correction only, report to the owner in one line, e.g. "Traced: build 3.5,
     process gap. Carry on."

1.11 **attachment** storage, at every entry:
     - The trace begins once the issue exists, since its key names the file. Its first entry is a
       start whose `--before` says what happened before it: for a capture, "capture 1.1–1.5,
       before the issue existed"; otherwise "nothing".
     - Before the first entry of a session, download the issue's current `<key>-trace.json` (the
       tracker's attachment) into the scratch folder and run `verify`. A trace that fails is not
       written to: report it to the owner as an impediment.
     - After `add`, upload the file with the tracker's connector, as one file, the bytes unchanged
       (the tool prints its filename, size and content type), then link the new upload and unlink
       the attachment it replaces. The stored old uploads stay; they are the trace's history.

## 2. Item summary

When the PR is marked ready for the owner's review (the work process that marks it ready has this as
a step):

2.1 Read the item's trace.

2.2 Write the item summary from `templates/summary.md`: its own PR comment (**comments** and
    **attachment**), or
    `.drillmaster/items/<work item id>/summary.md` (**items**). On a rework pass, update it.

2.3 Removed: observations are trace entries (1.7).

2.4 After the merge, update the item summary with the owner's review: rework rounds and their
    causes, merge time.

2.5 Report in one line when a retrospective is due: a running experiment has 3 or more observations,
    or the project's retrospective rhythm says so, e.g. "Status: E2 has 3 observations.
    Retrospective due. Move!" Otherwise say nothing more.
