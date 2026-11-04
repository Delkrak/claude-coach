# devops-drillmaster

A drill sergeant hired to run your agile setup with Claude. It talks like one — status first,
short, direct — and uses the agile words your team already knows. It turns your **objective** into
**work processes** (skills made of steps) and **work policies** (skills made of rules every input
and output must meet), mapped onto your real tools; records **impediments and metrics** on every
work item; and runs **retrospectives** whose changes are deliberate and each independently
measurable.

Start with [`concept.md`](concept.md): what the drill master is, and how the owner's objective, work
process, work policy, impediment and metric capture and retrospective fit together.

```
/plugin install devops-drillmaster@claude-coach
```

## Skills

### `/devops-drillmaster:setup`

1. **Objective first.** Your goal, its measures and your constraints, written to
   `.drillmaster/objective.md` for your approval. It is yours; the drill master never changes it
   without your order. Every measure names the work process that records it.
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

### `/devops-drillmaster:impediment-and-metric-capture`

Every work process starts its capture and closes it with a **process summary**. It records every
impediment (any friction: what slowed the work, what was missing, what you had to correct) and the
metrics the work process's specification names, on the issue and then the PR, or in the repository
if you chose. When a PR is marked ready, it writes the **item summary** from the process summaries.

### `/devops-drillmaster:retrospective`

What was supposed to happen, what happened, why, what to keep and what to improve. It works from the
capture, with session transcripts for extended analysis if available; judges running experiments
(impediment gone, measure held against its baseline); and decides changes with you, each naming the
impediment it removes and the measure it must not worsen.

### `/devops-drillmaster:process-change`

Makes one change the retrospective decided and you approved: edits the skill, snapshots it, appends
its history and opens an experiment with the measure's baseline. The only way a work process or work
policy changes.

## Rules

[`POLICIES.md`](POLICIES.md) is the drill master's own rulebook: how a work policy is written
(numbered rules on inputs and outputs, only MUST / MUST NOT / MAY, an Intent and a Check per rule),
how a skill changes, evidence, what is captured, files, preserving what works, and how it works with
you (one decision per question, research before asking, the objective is yours, drill-sergeant
voice with agile terms).

## Hooks

They run only in a project with `.drillmaster/process.md`.

| Event | What it does |
|---|---|
| `UserPromptSubmit` | A message that reads like a correction reminds Claude to record it with `impediment-and-metric-capture`. Claude decides whether it is one. |
| `PostToolUse` (`Bash`, MCP tools) | A call that often ends a work process (`gh pr create`, `gh pr ready`, `gh pr merge`, a tracker's save tool, or a `Done hints:` entry in `process.md`) leaves a marker. |
| `Stop` | With a marker pending, Claude is asked once whether the work process is done, to write its process summary, and the item summary if a PR was marked ready. |

## Files in a project

```
.drillmaster/
  objective.md          # yours: goal, measures (each with the work process that records it), direction
  process.md            # the index: work processes, work policies, artifacts, states, log storage
  toolchain.md          # your tools, as configured, with the docs read and your settings
  templates/            # one template per artifact
  <skill>/history.md    # how each skill changed
  <skill>/versions/     # each skill at each change
  experiments.md        # changes being checked: impediment, measure, baseline, verdict
  retrospectives/       # one report per retrospective
  items/<item id>/      # capture and item summary, only if you choose "items" storage
```

Captures and summaries live on issues and PRs by default ("comments"), or under `items/` if you
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
