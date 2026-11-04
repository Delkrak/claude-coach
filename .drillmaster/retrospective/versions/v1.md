---
name: after-action-review
description: The drill master's after-action review (AAR) - what was supposed to happen, what happened, why, and what to sustain or improve - from the field logs and debriefs on issues and PRs, tracker state times and session transcripts. Judges running experiments, then changes processes and policies one approved change at a time, each an experiment tied to a measure in the objective, and adds or removes steps by the project's step model. Use when the owner asks for a retro or review, wants to know why something keeps going wrong, or when a debrief says one is due.
---

# After-action review

The only place the drill master changes the process ← `POLICIES.md` §1.1. The owner decides every
change.

`POLICIES.md` and `templates/` are at the plugin root, two folders up from this skill's base
directory. Read `POLICIES.md` first; each step names the rule it applies.

**Arguments:** $ARGUMENTS: a scope (`recent`, the default: since the last AAR; a list of work items;
`all`), then an optional focus in free text ("only review", "why do builds stall").

## 1. What was supposed to happen

1. Read `.drillmaster/objective.md` (its measures), `process.md`, `toolchain.md`, `experiments.md`,
   the last report in `aar/`, and each listed skill with its `history.md` ← §5.2. If
   `.drillmaster/process.md` doesn't exist, offer `/devops-drillmaster:setup` and stop.

## 2. What happened

1. **Field logs and debriefs**: for each work item in scope, read its field log and debrief where
   Log storage says (issue and PR comments by default).
2. **Tracker times**: each item's time in each state.
3. **Sessions**: `transcripts.mjs` in this skill's base directory (Node, no dependencies) gives each
   session's prompts and interrupts, worktree sessions included. Use it to catch friction the field
   log missed and to cross-check time ← §4.3:

   ```
   node "<base dir>/transcripts.mjs" --project "<project dir>" [--since <ISO date>] [--session <id>] [--grep <text>]
   ```

   With more than 5 sessions in scope, give them to read-only subagents in batches of 5 and keep
   only their findings (session id, quote, kind).
4. Compute each measure in the objective over the scope, time per stage (median and worst), and
   friction counts per kind and per gap ← §3.

## 3. Why

1. **Running experiments first**: for each, read its observations and the items since it started,
   and propose a verdict with evidence ← §2.1, §2.2. The owner confirms. A change that didn't work
   can be reverted from `versions/` as a change of its own.
2. Group the friction by cause, each cause tied to evidence. Note what worked ← §5.1.

## 4. Sustain and improve

1. Present the full list before changing anything ← §1.2: verdicts; causes ranked by how often and
   how much time they cost, each with its gap, the proposed change and the measure it should move;
   steps the step model allows to add or remove, with their cost from the time log ← §1.8; what to
   sustain.
2. One change at a time ← §1.3–§1.5, one decision per question ← §6.1:
   - policy gap → edit the rule (written per §0); process gap → edit the step, or add the missing
     `← <policy> §<n>` citation ← §3.3; not covered → propose a new process or policy and hand it
     to `/devops-drillmaster:setup`;
   - a step added or removed only as the step model in `process.md` allows ← §1.8.
3. For each approved change ← §1.6, §1.7: snapshot `.drillmaster/<skill>/versions/v<N>.md`, append
   the history entry, and open an experiment in `experiments.md` from `templates/experiment.md`
   naming its measure.
4. Write the report to `.drillmaster/aar/<DD-MM-YYYY>.md` from `templates/after-action-report.md`,
   and tell the owner what changed, which experiments run, and what to watch for.

Friction about the drill master itself is reviewed the same way, in the plugin's repository ← §3.4.
