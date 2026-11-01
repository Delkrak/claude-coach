---
name: coach-setup-process
description: Set up or update a project's way of working as coach sees it, a set of process skills (steps) and policy skills (rules) indexed in .coach/process.md, adopting skills the project already has and scaffolding empty ones for the gaps. Use when the user wants coach to manage their process, asks for policies for issues, coding or code review, or when coach-improve-process finds friction no process or policy covers.
---

# Set up the process

Coach sees a project's way of working as **processes** (skills made of steps: how a work item
moves) and **policies** (skills made of rules: what must hold). A process step cites the policy
that applies there; a policy also holds outside any process. This skill records which of the
project's skills are which, scaffolds the missing ones, and prepares the logs the other coach skills
write to. The user decides; coach records.

Coach's own rules are in `POLICIES.md` at the plugin root (two folders up from this skill's base
directory). Read it before step 1. Each step below names the rule it applies.

**Arguments:** $ARGUMENTS, optional: the areas to set up (e.g. "code review only"). With none, all.

## Steps

### 1. Take stock

Read, without changing anything:
- `.coach/process.md`, if it exists. Then this is an **update**: keep every entry, change only what
  the user decides now.
- Every skill in `.claude/skills/*/SKILL.md` and command in `.claude/commands/*.md`: name,
  description, and whether its body is steps (a process) or rules (a policy).
- `CLAUDE.md` and any file it names as rules, for policies that already exist there as prose.

### 2. Ask how to approach it

Ask one question at a time, and wait for each answer. Give a recommendation first where you have one.

1. *"How thorough should this be?"* A quick setup scaffolds skeletons with `TODO`s only; a thorough
   one also drafts rules and steps from the user's answers to follow-up questions per item.
2. **Which processes and policies.** Propose this starting set, adjusted to what step 1 found, and
   let the user add, drop or rename:
   - processes: *create an issue* (features, BPIs, bugs), *build an issue*, *review a change*;
   - policies: *issue-policy*, *coding-policy*, *code-review-policy*.
3. **For each item: adopt, scaffold or skip.** Show the existing skill you'd adopt for it, with why
   (its description, one line of its body), and whether it reads as a process or a policy. A skill
   that mixes both is adopted as a process; offer to move its rules into a policy later, in a review.
   Rules already in `CLAUDE.md` stay there unless the user says to move them ← §2.3.
4. **Citations.** For each process, which policies its steps cite.
5. **Done hints.** For each process, the tool calls that often end its work item (`gh pr create`, a
   tracker's save tool, `./deploy.sh`). Coach's done hook asks Claude whether the item is done after
   such a call.

### 3. Show the whole setup

Show the full `.coach/process.md` you would write, and the list of files to create. Write nothing
until the user approves ← §1.2, §1.3. If the user changes something, restate the full setup in one
line per item and confirm again ← §1.4.

`.coach/process.md` has this form:

```
# Processes

## <process> — adopted | scaffolded
- Skill: .claude/skills/<name>/SKILL.md
- Covers: <what comes in → what goes out>
- Cites: <policy>, <policy>
- Hands off to: <next process>
- Done hints: <tool call>, <tool call>

# Policies

## <policy> — adopted | scaffolded
- Skill: .claude/skills/<name>/SKILL.md
- Covers: <when it applies>
- Cited by: <process>, <process>
```

### 4. Write

1. `.coach/process.md`.
2. For each scaffolded process, `.claude/skills/<name>/SKILL.md` from `templates/process.md`; for
   each scaffolded policy, from `templates/policy.md`. Fill in only what the user said; every other
   rule or step stays `TODO` ← §2.3. Every policy rule follows `POLICIES.md` §0.
3. For each adopted process whose steps should cite a policy, propose each `← <policy> §<n>`
   citation as its own change, one at a time ← §1.3. An adopted skill is changed only this way.
4. For every item, adopted or scaffolded: `.coach/<name>/history.md` with a creation entry, and empty
   `.coach/<name>/experiments.md` and `.coach/<name>/friction.md` ← §4.1.

   ```
   ## <DD-MM-YYYY HH:mm>
   - Created
     - <process | policy>, <adopted | scaffolded>
     - Purpose: <what the user said it is for, close to their words>
     - <any constraint or decision the user stated>
   ```

### 5. Keep the evidence

Claude Code deletes session transcripts after `cleanupPeriodDays` (30 by default), and coach checks
its experiments against them. Read `~/.claude/settings.json`; if `cleanupPeriodDays` is unset or under
365, offer to set it to 365. Change it only on a yes.

### 6. Confirm

Tell the user, one line per group: adopted, scaffolded, skipped. Then the next step: work as usual;
coach notes friction as it happens, asks for a wrap-up when a work item may be done, and
`/coach:coach-improve-process` reviews it.
