# devops-drillmaster

A drill sergeant hired to run your agile setup with Claude. It talks like one — status first,
short, direct — and uses the agile words your team already knows. It turns your **objective** into
**processes** (skills made of steps) and **policies** (skills made of rules for every output),
mapped onto your real tools; keeps an **impediment log** on every work item; and runs
**retrospectives** that change the process one experiment at a time.

Start with [`concept.md`](concept.md): what the drill master is, and how objective, process, step,
input, output, check, policy, impediment log and retrospective fit together.

```
/plugin install devops-drillmaster@claude-coach
```

## Skills

### `/devops-drillmaster:setup`

1. **Objective first.** Your goal, how you'll know it works, and your constraints, written to
   `.drillmaster/objective.md` for your approval. It is yours; the drill master never changes it
   without your order.
2. **Research before asking.** Your tracker, git host, CI and Claude plan are inventoried and their
   docs read, into `.drillmaster/toolchain.md`. A vendor's designed workflow is proposed as the
   default, after thorough research.
3. **You and the priority.** Your experience level, and how much process to start with, each process
   rated for relevance from the research: Light, Standard or Full.
4. **Design with you,** one decision per question: processes, policies for every output, artifacts,
   who moves each tracker state, where the logs live, and how steps are added or removed later.
5. **Stress test.** Three independent read-only reviewers walk real and invented scenarios through
   the process before it goes live; you decide each finding.

### `/devops-drillmaster:impediment-log`

The log every process starts with and closes with its **process summary** (outcome, impediments,
time). It records your corrections, development friction and missing information, on the issue and
then the PR, or in the repository if you chose. When a PR is marked ready, it writes the **item
summary** from the process summaries.

### `/devops-drillmaster:retrospective`

What was supposed to happen, what happened, why, what to keep and what to improve. It reads
impediment logs, summaries, tracker times and session transcripts, judges running experiments, and
proposes changes one at a time, each an experiment tied to a measure in your objective.

## Rules

[`POLICIES.md`](POLICIES.md) is the drill master's own rulebook: how a policy is written (numbered
rules, only MUST / MUST NOT / MAY, an Intent and a Check per rule), how a skill changes, evidence,
what is logged, files, preserving what works, and how it works with you (one decision per question,
research before asking, the objective is yours, drill-sergeant voice with agile terms).

## Hooks

They run only in a project with `.drillmaster/process.md`.

| Event | What it does |
|---|---|
| `UserPromptSubmit` | A message that reads like a correction reminds Claude to log it with `impediment-log`. Claude decides whether it is one. |
| `PostToolUse` (`Bash`, MCP tools) | A call that often ends a process (`gh pr create`, `gh pr ready`, `gh pr merge`, a tracker's save tool, or a `Done hints:` entry in `process.md`) leaves a marker. |
| `Stop` | With a marker pending, Claude is asked once whether the process is done, to write its process summary, and the item summary if a PR was marked ready. |

## Files in a project

```
.drillmaster/
  objective.md          # yours: goal, measures, direction
  process.md            # the index: processes, policies, artifacts, states, log storage, step model
  toolchain.md          # your tools, as configured, with the docs read and your settings
  templates/            # one template per artifact
  <skill>/history.md    # how each skill changed
  <skill>/versions/     # each skill at each change
  experiments.md        # changes being checked against a measure
  retrospectives/       # one report per retrospective
  items/<item id>/      # impediment log and item summary, only if you choose "items" storage
```

Impediment logs and summaries live on issues and PRs by default ("comments"), or under `items/` if
you choose.

## Process list and policy list

What setup offers, in suggested order:
- [`process-list/`](process-list/): `0-template.md` is the shape of an AI agent process (its input
  and the policies it must meet, its steps, its output and the policies it must meet, how each is
  checked and documented); `1-capture.md` … `9-retrospective.md` are the suggested processes.
- [`policy-list/`](policy-list/): `0-template.md` is the shape of a policy; `1-issue-policy.md` …
  `8-incident-policy.md` cover every output, code included.

## Tests

```
node --test "tests/*.test.mjs"
```
