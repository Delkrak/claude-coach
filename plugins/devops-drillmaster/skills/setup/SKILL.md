---
name: setup
description: Set up or update a project's DevOps way of working with the drill master - the owner's objective first, then the toolchain researched (tracker, git host, CI, Claude plan), then the stages, processes, policies, artifacts, state ownership and log storage decided with the owner one question at a time, then a stress test before it goes live. Use when the owner wants a process for building software with Claude, asks to set up or redo their way of working, or when an after-action review finds work no process covers.
---

# Set up the process

The drill master turns the owner's **objective** into a way of working: **processes** (skills made
of steps), **policies** (skills made of rules) and **artifacts** (what steps produce), mapped onto
the project's real tools. The owner decides; the drill master researches, proposes, records and
carries out.

Read `POLICIES.md` at the plugin root (two folders up from this skill's base directory) before step
1, and the templates in `templates/` beside it. Every step names the rule it applies.

**Arguments:** $ARGUMENTS, optional: what to set up or redo (e.g. "only review"). With none, all.

If `.drillmaster/process.md` exists, this is an **update**: read every `.drillmaster/` file first,
keep what stands, and change only what the owner decides now.

## 1. The objective

1. Ask the owner, one question at a time ← §6.1: the goal in their words; how they'd know it is
   working (1–3 measures, each with how it is counted); the direction and constraints (e.g. what
   should run where, what to avoid).
2. Draft `.drillmaster/objective.md` from `templates/objective.md`, quoting the owner. Show it and
   write it only on approval ← §6.3.

## 2. Research the toolchain

Before any question about a tool ← §6.2:

1. Inventory what the project uses: tracker, git host, CI and environments, Claude (plan tier,
   features, the repo's CLAUDE.md files, skills, hooks, enabled plugins), and existing docs.
2. Read each tool's documentation and the project's actual configuration (states, labels,
   templates, automations, agents; workflows, apps, branch protection; CI jobs; plan gates). Use
   the tools' own doc search where one exists, and read-only subagents for broad sweeps.
3. Look for each vendor's **designed workflow** (e.g. how the AI vendor intends build, review and
   fix to run; how the tracker intends PRs to move issues). Research it thoroughly: docs, plan-tier
   gates, what is unverified.
4. Write `.drillmaster/toolchain.md` from `templates/toolchain.md`, every claim with its source or
   marked unverified.

## 3. The owner and the priority

1. Ask how much experience the owner has with this kind of process (new · some · experienced). Adapt:
   a new owner gets more explanation and recommended defaults; an experienced one gets terser
   questions and more choices.
2. Ask the priority: how much process to start with, showing the full loop with each stage's likely
   relevance to this project, from step 2's findings:
   - **Light**: capture → build → user review.
   - **Standard**: + refine and AI review.
   - **Full**: + release/deploy, operate/monitor, incidents feeding back into capture.
   Then single stages may be added or dropped.

## 4. Take stock of what exists

1. Read the project's skills, commands and CLAUDE.md files, and docs that state rules
   (architecture notes, contribution guides).
2. Sort each into **process**, **policy** or **artifact** ← §3. A thing a step produces (a brief, a
   spec) is an artifact, never a process or a policy.
3. For written principles that would become policy rules, run a read-only check against the code:
   is each still live, already enforced (test, type, lint), and what kind is it (structure,
   integrity, API, style)? Report before proposing anything.

## 5. Design it with the owner

One decision per question ← §6.1. Where a default is still being worked out, ask it with pros and
cons ← §6.4. When step 2 found a vendor's designed workflow, always propose it as the default, adapted to the
plan tier and the other tools, and say what was adapted and why.

1. **Stages and processes**: for each stage in the chosen priority, adopt an existing skill (show it),
   scaffold a new one, or skip.
2. **Co-developed defaults**, each its own question with pros and cons:
   - an entry skill a new person or agent reads first (flow, states, policies, pointer to
     `objective.md`);
   - naming (`-process` / `-policy` suffixes);
   - drafting policies from the owner's existing text, rule by rule, against step 4's check;
   - how questions to the owner are asked and counted (e.g. a "Needs input" state as the measure of
     a miss).
3. **Policies**: which ones, and for each the source of its rules.
4. **Artifacts**: each artifact a step produces, its template, and where it is stored.
5. **States**: for each tracker state, who moves it — the tool's automation (only if step 2
   verified it is configured) or a process step. Ask per state.
6. **Log storage**: offer this default and change it on the owner's word:

   | Stage | Logged | Name | Stored |
   |---|---|---|---|
   | Capture | owner's words, what was missing | Field log | one running comment on the issue |
   | Refine | decisions, questions, consequences, time | Field log | same issue comment |
   | Build | development friction, noticed items, time | Field log | copied to one running PR comment when the PR opens |
   | AI review | each round: findings, fixes or answers, time | Field log | PR comment |
   | Debrief | what happened, friction, missing info, time per stage | Debrief | own PR comment, when ready for review; updated after merge |
   | User review | owner's feedback, rework | Field log | PR comment |
   | Release/deploy | what shipped, problems | Field log | the PR or the tracker's release |
   | Operate/monitor | incidents | Field log | an incident issue, feeding capture |
   | After-action review | intended vs actual, sustain/improve | After-action report | `.drillmaster/aar/` |

7. **Step model**: how steps are added later — evidence + experiment, measure-driven ladder, or
   owner decides — and N, the number of items after which an unused step may be proposed for
   removal ← §1.8.
8. **Time logging**: field log entries at each step's start and end, cross-checked by the
   after-action review against tracker state times and session transcripts. Confirm.

## 6. Show the whole setup

Show `.drillmaster/process.md` as it would be written (from `templates/process-index.md`) and the
list of files. Write nothing until approved ← §1.2, §1.3. A modified approval is restated whole and
confirmed ← §1.4.

## 7. Write

1. `.drillmaster/process.md`, `toolchain.md`, `objective.md` (already approved), `templates/` (the
   artifact templates chosen in step 5), `experiments.md` (empty), and a creation entry in
   `.drillmaster/<skill>/history.md` for every skill ← §4.1, §4.5.
2. Each scaffolded process from `templates/process-skill.md`: every process begins and ends with a
   field log step. Each scaffolded policy from `templates/policy-skill.md`, its rules drafted as
   step 5 decided and accepted by the owner rule by rule ← §0, §2.3.
3. An adopted skill changes only by approved, one-at-a-time edits ← §1.3.

## 8. Stress test before going live

1. Start 3 read-only reviewers with the same brief: read `objective.md`, `process.md` and every
   process and policy; walk real items from the tracker and invented scenarios end to end; report
   gaps, contradictions, unfollowable or uncheckable rules, stuck states, and anything working
   against the objective, each with where, scenario, severity and fix.
2. Merge their findings, note which reviewers raised each, rank them, and decide them with the owner
   one at a time. Apply the decisions.
3. Run one reviewer again with the same brief to confirm what was fixed and catch anything new.

## 9. Go live

1. Deliver the change the way the owner decides (e.g. as the first work item through the new
   process, or a plain PR).
2. Claude Code deletes session transcripts after `cleanupPeriodDays` (30 by default) and the
   after-action review reads them: offer to raise it in `~/.claude/settings.json`, only on a yes.
3. Tell the owner what was adopted, scaffolded and skipped, and the next step: work as usual; every
   step keeps the field log, every PR gets a debrief, and `/devops-drillmaster:after-action-review`
   turns them into improvements.
