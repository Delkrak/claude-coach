---
name: setup
description: Set up or update a project's DevOps way of working with the drill master - the owner's objective first, then the toolchain researched (tracker, git host, CI, Claude plan), then the owner's experience and priority, then the stages, processes, policies, artifacts, state ownership and log storage decided with the owner one question at a time, then a stress test before it goes live. Use when the owner wants a process for building software with Claude, asks to set up or redo their way of working, or when an after-action review finds work no process covers.
---

# Set up the process

The drill master turns the owner's **objective** into a way of working: **processes** (skills made
of steps), **policies** (skills made of rules) and **artifacts** (what steps produce), mapped onto
the project's real tools. The owner decides; the drill master researches, proposes, records and
carries out.

Read `POLICIES.md` at the plugin root (two folders up from this skill's base directory) before step
1.1, and the templates in `templates/` beside it. Every step names the rule it applies.

Every step has an id, cited as `setup <id>` (e.g. `setup 2.3`) ← §0.8.

**Arguments:** $ARGUMENTS, optional: what to set up or redo (e.g. "only review"). With none, all.

If `.drillmaster/process.md` exists, this is an **update**: read every `.drillmaster/` file first,
keep what stands, and change only what the owner decides now.

## 1. The objective

1.1 Ask the owner, one question at a time ← §6.1: the goal in their words; how they'd know it is
    working (1–3 measures, each with how it is counted); the direction and constraints (e.g. what
    should run where, what to avoid).

1.2 Draft `.drillmaster/objective.md` from `templates/objective.md`, quoting the owner. Show it and
    write it only on approval ← §6.3.

## 2. Research the toolchain

Before any question about a tool ← §6.2:

2.1 Inventory what the project uses: tracker, git host, CI and environments, Claude (plan tier,
    features, the repo's CLAUDE.md files, skills, hooks, enabled plugins), and existing docs.

2.2 Read each tool's documentation and the project's actual configuration (states, labels,
    templates, automations, agents; workflows, apps, branch protection; CI jobs; plan gates). Use
    the tools' own doc search where one exists, and read-only subagents for broad sweeps.

2.3 Look for each vendor's **designed workflow** (e.g. how the AI vendor intends build, review and
    fix to run; how the tracker intends PRs to move issues). Research it thoroughly: docs, plan-tier
    gates, what is unverified.

2.4 Write `.drillmaster/toolchain.md` from `templates/toolchain.md`, every claim with its source or
    marked unverified.

## 3. The owner and the priority

3.1 Ask how much experience the owner has with this kind of process (new · some · experienced).
    Adapt: a new owner gets more explanation and recommended defaults; an experienced one gets
    terser questions and more choices.

3.2 Ask the priority: how much process to start with, showing the processes of
    `process-list/` (plugin root) in order, with each one's likely relevance to this project, from 2.2's
    findings:
    - **Light**: capture → build → debrief → user review, and the after-action review.
    - **Standard**: + refine and AI review.
    - **Full**: + release/deploy, operate/monitor, incidents feeding back into capture.
    Then single stages may be added or dropped.

## 4. Take stock of what exists

4.1 Read the project's skills, commands and CLAUDE.md files, and docs that state rules (architecture
    notes, contribution guides).

4.2 Sort each into **process**, **policy** or **artifact** ← §3. A thing a step produces (a brief, a
    spec) is an artifact, never a process or a policy.

4.3 For written principles that would become policy rules, run a read-only check against the code:
    is each still live, already enforced (test, type, lint), and what kind is it (structure,
    integrity, API, style)? Report before proposing anything.

## 5. Design it with the owner

One decision per question ← §6.1. Where a default is still being worked out, ask it with pros and
cons ← §6.4. When 2.3 found a vendor's designed workflow, always propose it as the default, adapted
to the plan tier and the other tools, and say what was adapted and why.

Every proposal in this step starts from the plugin's `process-list/` and `policy-list/` (each `0-template.md` is the shape; the numbered files are the suggestions,
in order), showing only the processes the priority kept and the policies they cite.

5.1 **Processes**: for each process in the chosen priority, in the list's order, adopt an existing
    skill (show it), scaffold it from the list, or skip. For a scaffolded process, show its input,
    steps and output in order, and let the owner keep, change or drop each step; kept steps keep
    their ids.

5.2 **Co-developed defaults**, each its own question with pros and cons:
    - an entry skill a new person or agent reads first (flow, states, policies, pointer to
      `objective.md`);
    - naming (`-process` / `-policy` suffixes);
    - drafting policies from the owner's existing text, rule by rule, against 4.3's check;
    - how questions to the owner are asked and counted (e.g. a "Needs input" state as the measure
      of a miss).

5.3 **Policies**: every output the kept processes produce is governed by a policy (code included).
    For each policy the kept processes cite, adopt an existing one, scaffold it from the policy
    list, or skip; then, rule by rule, keep the list's suggested rules or draft the project's own from
    its text (as 5.2 decided), each with how it is checked and where that is documented.

5.4 **Artifacts**: each artifact the kept stages produce, its template, and where it is stored.

5.5 **States**: show every tracker state with its proposed mover — the tool's automation where 2.2
    verified it is configured, else a process step, as the process list suggests — then ask one question
    per state the owner wants to change.

5.6 **Log storage**: show, per kept process, what its log steps record (from the process list), then ask
    where field logs and debriefs live: **comments** (one running comment on the issue, copied to the
    PR when it opens) or **drills** (`.drillmaster/drills/<work item id>/`). Change single stages on
    the owner's word.

5.7 **Step model**: how steps are added later — evidence + experiment, measure-driven ladder, or
    owner decides — and N, the number of items after which an unused step may be proposed for
    removal ← §1.8.

5.8 **Time logging**: field log entries at each step's start and end, cross-checked by the
    after-action review against tracker state times and session transcripts. Confirm.

## 6. Show the whole setup

6.1 Show `.drillmaster/process.md` as it would be written (from `templates/process-index.md`) and the
    list of files. Write nothing until approved ← §1.2, §1.3. A modified approval is restated whole
    and confirmed ← §1.4.

## 7. Write

7.1 Write `.drillmaster/process.md`, `toolchain.md`, `objective.md` (already approved), `templates/`
    (the artifact templates chosen in 5.4), `experiments.md` (empty), and a creation entry in
    `.drillmaster/<skill>/history.md` for every skill ← §4.1, §4.5.

7.2 Scaffold each new process as a skill from its file in the plugin's `process-list/` (or
    `0-template.md` for one the list lacks): input and output with the policies they must meet, how
    each is checked and documented, steps with ids beginning and ending with a log step ← §0.8,
    and the objective's measure it serves. Scaffold each new policy as a skill from
    the plugin's `policy-list/` the same way, its rules as 5.3 decided and accepted by the owner rule by
    rule ← §0, §2.3.

7.3 Change an adopted skill only by approved, one-at-a-time edits ← §1.3.

7.4 List every setting the process relies on that only the owner can change (e.g. a tracker
    automation that moves issues on PR events), with where to change it, under **Owner settings**
    in `toolchain.md`, and show the owner the list. The process raises it when one doesn't behave as
    expected ← §4.7.

## 8. Stress test before going live

8.1 Start 3 read-only reviewers with the same brief: read `objective.md`, `process.md` and every
    process and policy; walk real items from the tracker and invented scenarios end to end; report
    gaps, contradictions, unfollowable or uncheckable rules, stuck states, and anything working
    against the objective, each with where (skill and step or rule id), scenario, severity and fix.

8.2 Merge their findings, note which reviewers raised each, rank them, and decide them with the owner
    one at a time. Apply the decisions.

8.3 Run one reviewer again with the same brief to confirm what was fixed and catch anything new.

## 9. Go live

9.1 Deliver the change as a PR. No separate trial is needed: the first work items run through the
    new process, and their field logs show what to improve.

9.3 Tell the owner what was adopted, scaffolded and skipped, and the next step: work as usual; every
    step keeps the field log, every PR gets a debrief, and `/devops-drillmaster:after-action-review`
    turns them into improvements.
