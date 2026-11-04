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

As light as possible:
1. **Two questions.** Your goal (and how you'd know it works), and which work processes to start
   with, picked from the library.
2. **Read, not asked.** Your tracker, git host, CI and Claude setup, into `.drillmaster/toolchain.md`.
3. **Copied from the library.** The chosen work processes and the work policies they cite, unchanged
   but for the facts it read; everything else stays a placeholder.
4. **One PR,** with the report page. No stress test: the first work items' traces show what to fix,
   and the retrospectives fit the process to you over time.

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

### `/devops-drillmaster:report`

One HTML page of your process: the objective, the flow, each work process's input → steps → output
and each work policy's rules, built from `process.md` and the skills it names. Setup and every
retrospective rebuild it.

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
  process.md            # the index: work processes, work policies, states, log storage
  toolchain.md          # your tools, as configured, and your settings
  skills/<skill>/       # how each skill changed: history.md, versions/
  experiments.md        # changes being checked: impediment, measure, baseline, verdict
  retrospectives/       # one short report per retrospective
  traces/<item id>.md   # merged work items' traces, until a retrospective has used them
process-overview.html   # the report page
```

The plugin's only templates are the trace and the item summary.

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
