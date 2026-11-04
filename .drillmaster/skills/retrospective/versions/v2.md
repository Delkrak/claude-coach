---
name: retrospective
description: The drill master's retrospective - what was supposed to happen, what happened, why, what to keep and what to improve - from the work items' traces on issues and PRs, with session transcripts for extended analysis if available. Judges running experiments, then decides deliberate, independently measurable changes to work processes and work policies with the owner, and hands each approved one to process-change. Use when the owner asks for a retro or review, wants to know why something keeps going wrong, or when the trace says one is due.
---

# Retrospective

The only place changes to work processes and work policies are decided ← `POLICIES.md` §1.1. The
owner decides every change; `/devops-drillmaster:process-change` makes it.

`POLICIES.md` is at the plugin root, two folders up from this skill's base directory. Read `POLICIES.md` first; each step names the rule it applies.

**Arguments:** $ARGUMENTS: a scope (`recent`, the default: since the last retrospective; a list of
work items; `all`), then an optional focus in free text ("only review", "why do builds stall").

Every step has an id, cited as `/devops-drillmaster:retrospective <id>` ← §0.8.

## 1. What was supposed to happen

1.1 Read `.drillmaster/objective.md` (its measures), `process.md`, `toolchain.md`, `experiments.md`,
    the last report in `retrospectives/`, and each listed skill with its `history.md` ← §5.2. If
    `.drillmaster/process.md` doesn't exist, offer `/devops-drillmaster:setup` and stop.

## 2. What happened

2.1 **Traces**: for each work item in scope, read its trace (with its process summaries and
    observations) and its item summary where Log storage says (issue and PR comments by default). A
    JSON trace is run through `scripts/trace.mjs verify` first; one that fails is itself an
    impediment, and its entries are evidence only as far as the chain holds.
    This is what the retrospective works from ← §2.5. Add each observation to its experiment in
    `experiments.md`.

2.2 Removed.

2.3 **Extended analysis**, if session transcripts are available: `transcripts.mjs` in this skill's
    base directory (Node, no dependencies) gives each session's prompts and interrupts, worktree
    sessions included. Use it to deepen what the traces show, and to find what they left
    out; mark every such finding as extended analysis ← §2.5:

    ```
    node "<base dir>/transcripts.mjs" --project "<project dir>" [--since <ISO date>] [--session <id>] [--grep <text>]
    ```

    With more than 5 sessions in scope, give them to read-only subagents in batches of 5 and keep
    only their findings (session id, quote, step).

2.4 Compute each measure in the objective over the scope from the traces, time per work process and
    per step, and impediment counts per gap and per step id ← §3.

## 3. Why

3.1 **Running experiments first**: for each, read its observations and the items since it started,
    and propose a verdict with evidence: is its impediment gone, and does the measure hold against
    its baseline ← §2.1, §2.2, §2.4. The owner confirms. A change that is rethought can be reverted
    from `versions/` as a change of its own.

3.2 Group the impediments by cause, each cause tied to evidence and to the step id it happened at.
    Note what worked ← §5.1.

3.3 Check each work process's traces: can what happened be rebuilt from them, can every measure be
    counted, and did impediments go untraced? Any of these is a process gap at that work process.

## 4. Keep and improve

4.1 Present the full list before deciding anything ← §1.2: verdicts; causes ranked by how often and
    how much they cost the measures, each with its gap, the step id, the proposed change, the
    impediment it removes and the measure it must not worsen ← §1.3; what to keep.

4.2 Decide each change with the owner, one decision per question ← §1.3–§1.5, §6.1:
    - policy gap → change the rule (written per §0); process gap → change the step, what its trace
      leaves out, or add the missing `← <work policy> <rule id>` citation ← §3.3; not covered →
      propose a new work process or work policy and hand it to `/devops-drillmaster:setup`;
    - a new step gets a new id; a removed one's id is never reused ← §0.8.

4.3 Hand each approved change to `/devops-drillmaster:process-change`, with the retrospective's
    report, the impediment, the measure and its baseline ← §1.1, §1.6, §1.7.

4.4 Write a short report to `.drillmaster/retrospectives/<DD-MM-YYYY>.md`: the scope, the measures
    over it, the top causes with their step ids, what was kept, and each change decided or
    rejected, one line each. Copy the traces of merged work items in scope to
    `.drillmaster/traces/<id>.md` (a JSON trace keeps its file: `traces/<key>-trace.json`), and
    delete the ones this retrospective has used ← §4.1.

4.5 Rebuild the process overview with `/devops-drillmaster:process-overview`, and report to the
    owner ← §6.5, e.g.
    "Status: 2 changes made, E3 kept, E4 rethink. Watch build 3.5. Dismissed!"

Impediments with the drill master itself are reviewed the same way, in the plugin's repository ←
§3.4.
