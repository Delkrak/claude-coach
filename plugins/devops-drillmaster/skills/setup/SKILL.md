---
name: setup
description: Set up a project's DevOps way of working with the drill master, as light as possible - ask the owner's goal and which work processes to start with, read the toolchain, copy the chosen work processes and the work policies they cite from the drill master's library unchanged, write .drillmaster/, build the process overview, and deliver it as one PR. Retrospectives adapt it to the project over time. Use when the owner wants a process for building software with Claude, or when a retrospective hands over a work process the project doesn't have yet.
---

# Set up the process

Setup is as light as possible: it asks only what it can't read, copies from the library, and leaves
every adaptation to the retrospectives, which change the process from real work items' traces
← `POLICIES.md` §1.1. The owner decides; the drill master reads, copies and writes.

`POLICIES.md`, `process-list/` and `policy-list/` are at the plugin root, two folders up from this
skill's base directory.

Every step has an id, cited as `/devops-drillmaster:setup <id>` ← §0.8.

**Arguments:** $ARGUMENTS, optional: the work processes to add (a retrospective hands one over).
With none, a full setup.

If `.drillmaster/process.md` exists, add only the work processes the arguments name; anything else
goes to `/devops-drillmaster:retrospective`.

## 1. Ask

Ask with `AskUserQuestion`, one decision per question ← §6.1. Nothing else is asked.

1.1 **The goal**, in the owner's words, and how they'd know it works (one or two measures).

1.2 **The work processes**: one multi-select of `process-list/`, in its order, each with its
    one-line description. The work policies follow from what the chosen ones cite.

## 2. Read

2.1 Read, without asking, what the project runs on: the tracker (its states and labels, through its
    connector), the git host and CI (the repository's workflows), Claude (the repo's `CLAUDE.md`
    files, skills, hooks, plugins). What can't be read is written as unknown ← §6.2.

## 3. Write

3.1 Copy each chosen work process from `process-list/` and each work policy it cites from
    `policy-list/` into `.claude/skills/<name>/SKILL.md`, unchanged but for placeholders the facts
    from 2.1 and 1.1 answer (the tracker's state names, the measures). Every other placeholder stays
    `<…>` for the retrospectives ← §2.3. Existing project skills that overlap are left alone and
    listed for the first retrospective.

3.2 Write `.drillmaster/objective.md`:

    ```
    # Objective
    Owned by the owner (POLICIES.md §6.3).
    ## Goal
    "<the owner's words>"
    ## Measures
    - **<Measure>.** <what has to be true>
      Counted from: the traces of </work process>, as <what is counted>.
      Check: <how>.
    ## Direction and constraints
    - <the owner's words, or none>
    ```

3.3 Write `.drillmaster/process.md`, one section per work process and work policy, in this form
    (the session hook and the process overview read it):

    ```
    # <Project>'s process
    Log storage: <comments | attachment | items> — every work item is traced with
    /devops-drillmaster:trace <in one running comment on the issue, then on the PR | in
    `<key>-trace.json`, written by scripts/trace.mjs and attached to the issue | in
    .drillmaster/items/>. Comments unless the owner chooses another (POLICIES §4.2).
    # Work processes, in order
    ## <n>. <Stage> — `/<skill>`
    - Skill: .claude/skills/<skill>/SKILL.md
    - States: <from → to>, moved by `/<skill>`
    - Hands off to: `/<next skill>`
    # Work policies
    ## <Name> — `/<skill>`
    - Skill: .claude/skills/<skill>/SKILL.md
    ```

3.4 Write `.drillmaster/toolchain.md`: one line per tool — what it is, how it is configured, and
    what is unknown; and under **Owner settings**, each setting only the owner can change that the
    process relies on ← §4.7.

3.5 Write `.drillmaster/experiments.md` (empty) and a creation entry in
    `.drillmaster/skills/<skill>/history.md` for every skill ← §4.1, §4.5.

3.6 Build the process overview with `/devops-drillmaster:process-overview`.

## 4. Deliver

4.1 Deliver it as one PR, committed once ← §6.5. No trial and no stress test: the first work items
    run through it, their traces show what to improve, and the retrospectives adapt it.

4.2 Report to the owner ← §6.5, e.g. "Status: 5 work processes, 4 work policies live, copied from
    the library. Every step gets traced. Retrospectives fit them to you. Move!"
