---
name: trace
description: Trace a work item - every step's start and end, what went in and came out (linked), decisions, questions and answers, state moves and every impediment - so what happened can be rebuilt and the objective's measures computed from it; close every work process with its process summary and write the item summary on the PR. Where the project's log storage says (by default a running comment on the issue, then the PR). Never changes a skill. Use at every step of every work process, whenever friction happens (the owner corrects or redirects Claude, work is redone or stuck, information is missing - the prompt hook cues corrections), and when a PR is marked ready. Only in a project with .drillmaster/process.md.
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

Every entry is one line in the form of `templates/trace.md`: time (read from the clock ← §4.3), the
work process step by id (e.g. `/build-process 3.5`), the kind, and a link as evidence ← §2.1. Link
what the tracker, the git host and the session already hold (an issue, a commit, a PR, a comment,
a session id); never copy it.

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
    impediments, questions and corrections counted from the trace.

1.9 Write it where Log storage says ← §4.2:
    - **comments**: one running comment titled `Trace — <item>` on the issue until the PR opens;
      then copied into one running comment on the PR and appended there, after the merge too.
      Update the running comment rather than posting a new one. Before the issue exists, keep the
      entries in the session and post them once it does.
    - **items**: `.drillmaster/items/<work item id>/trace.md`, committed on the work item's branch.

1.10 For an owner correction only, report to the owner in one line, e.g. "Traced: build 3.5,
     process gap. Carry on."

## 2. Item summary

When the PR is marked ready for the owner's review (the work process that marks it ready has this as
a step):

2.1 Read the item's trace.

2.2 Write the item summary from `templates/summary.md`: its own PR comment (**comments**), or
    `.drillmaster/items/<work item id>/summary.md` (**items**). On a rework pass, update it.

2.3 Removed: observations are trace entries (1.7).

2.4 After the merge, update the item summary with the owner's review: rework rounds and their
    causes, merge time.

2.5 Report in one line when a retrospective is due: a running experiment has 3 or more observations,
    or the project's retrospective rhythm says so, e.g. "Status: E2 has 3 observations.
    Retrospective due. Move!" Otherwise say nothing more.
