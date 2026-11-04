# devops-drillmaster

A drill sergeant hired to run your agile setup with Claude. It talks like one — status first,
short, direct — and uses the agile words your team already knows. It turns your **objective** into
**work processes** (skills made of steps) and **work policies** (skills made of rules every input
and output must meet), mapped onto your real tools; **traces** every work item, step by step;
and runs **retrospectives** whose changes are deliberate and each independently
measurable.

Start with [`concept.md`](concept.md): what the drill master is, and how the owner's objective, work
process, work policy, tracing and retrospective fit together.

```
/plugin install devops-drillmaster@claude-coach
```

## Skills

### `/devops-drillmaster:setup`

1. **Objective first.** Your goal, its measures and your constraints, written to
   `.drillmaster/objective.md` for your approval. It is yours; the drill master never changes it
   without your order. Every measure is counted from the work items' traces.
2. **Research before asking.** Your tracker, git host, CI and Claude plan are inventoried and their
   docs read, into `.drillmaster/toolchain.md`. A vendor's designed workflow is proposed as the
   default, after thorough research.
3. **You and the priority.** Your experience level, and how much process to start with, each work
   process rated for relevance from the research: Light, Standard or Full.
4. **Design with you,** one decision per question: work processes, work policies for every output,
   artifacts, who moves each tracker state, what each work process records, and where it is kept.
5. **Stress test.** Three independent read-only reviewers walk real and invented scenarios through
   the process before it goes live; you decide each finding.

Setup creates once. Every later change goes through a retrospective.

### `/devops-drillmaster:trace`

Traces every step of a work item, one line per entry: start and end, what went in and came out
(linked), state moves, decisions, questions and answers, and every impediment (any friction: what
slowed the work, what was missing, what you had to correct). Your measures are counted from it.
Every work process closes with a **process summary**; when a PR is marked ready, it writes the
**item summary**. Kept on the issue and then the PR, or in the repository if you chose.

### `/devops-drillmaster:retrospective`

What was supposed to happen, what happened, why, what to keep and what to improve. It works from the
traces, with session transcripts for extended analysis if available; judges running experiments
(impediment gone, measure held against its baseline); and decides changes with you, each naming the
impediment it removes and the measure it must not worsen.

### `/devops-drillmaster:process-change`

Makes one change the retrospective decided and you approved: edits the skill, snapshots it, appends
its history and opens an experiment with the measure's baseline. The only way a work process or work
policy changes.

## Rules

[`POLICIES.md`](POLICIES.md) is the drill master's own rulebook: how a work policy is written
(numbered rules on inputs and outputs, only MUST / MUST NOT / MAY, an Intent and a Check per rule),
how a skill is referenced and changed, evidence, what is traced, files, preserving what works, and how it works with
you (one decision per question, research before asking, the objective is yours, drill-sergeant
voice with agile terms).

## Hooks

They run only in a project with `.drillmaster/process.md`.

| Event | What it does |
|---|---|
| `SessionStart` | At startup, resume, clear and after a compaction, briefs Claude from `process.md`: each work process, its skill and its states, so Claude loads the right work process skill before working on a work item. |
| `UserPromptSubmit` | A message that reads like a correction reminds Claude to trace it with `/devops-drillmaster:trace`. Claude decides whether it is one. |

## Files in a project

```
.drillmaster/
  objective.md          # yours: goal, measures (each counted from the traces), direction
  process.md            # the index: work processes, work policies, artifacts, states, log storage
  toolchain.md          # your tools, as configured, with the docs read and your settings
  templates/            # one template per artifact
  <skill>/history.md    # how each skill changed
  <skill>/versions/     # each skill at each change
  experiments.md        # changes being checked: impediment, measure, baseline, verdict
  retrospectives/       # one report per retrospective
  items/<item id>/      # trace and item summary, only if you choose "items" storage
```

Traces and summaries live on issues and PRs by default ("comments"), or under `items/` if you
choose.

## Process list and policy list

What setup offers, in suggested order:
- [`process-list/`](process-list/): `0-template.md` is the shape of a work process (its input and the
  work policy rules it must meet, what it records, its steps from input check to output check, its
  output); `1-capture.md` … `7-operate.md` are the suggested work processes, each one's output the
  next one's input.
- [`policy-list/`](policy-list/): `0-template.md` is the shape of a work policy; `1-issue-policy.md`
  … `8-incident-policy.md` cover every output, code included.

## Tests

```
node --test "tests/*.test.mjs"
```
