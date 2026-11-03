# devops-drillmaster

A drill master for a DevOps way of working with Claude. It turns your **objective** into
**processes** (skills made of steps), **policies** (skills made of rules) and **artifacts** (what
steps produce), mapped onto your real tools; keeps a **field log** on every issue and PR; and runs
**after-action reviews** that change the process one experiment at a time.

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
3. **You and the priority.** Your experience level, and how much process to start with, each stage
   rated for relevance from the research: Light (capture → build → review), Standard (+ refine, AI
   review) or Full (+ release, operate, incidents).
4. **Design with you,** one decision per question: stages, processes, policies, artifacts, who moves
   each tracker state, where the field logs live, and how steps are added or removed later.
5. **Stress test.** Three independent read-only reviewers walk real and invented scenarios through
   the process before it goes live; you decide each finding.

### `/devops-drillmaster:field-log`

The logging step every process begins and ends with. It records your corrections, development
friction, missing information and time, on the issue and then the PR (or wherever you chose), never
in the repository. When a PR is marked ready, it writes the **debrief**: what happened, friction,
time per stage.

### `/devops-drillmaster:after-action-review`

The military's after-action review: what was supposed to happen, what happened, why, what to
sustain or improve. It reads field logs, debriefs, tracker times and session transcripts, judges
running experiments, and proposes changes one at a time, each an experiment tied to a measure in
your objective.

## Rules

[`POLICIES.md`](POLICIES.md) is the drill master's own rulebook: how a policy is written (numbered
rules, only MUST / MUST NOT / MAY, an Intent and a Check per rule), how a skill changes, evidence,
what is logged, files, preserving what works, and how it works with you (one decision per question,
research before asking, the objective is yours).

## Hooks

They run only in a project with `.drillmaster/process.md`.

| Event | What it does |
|---|---|
| `UserPromptSubmit` | A message that reads like a correction reminds Claude to log it with `field-log`. Claude decides whether it is one. |
| `PostToolUse` (`Bash`, MCP tools) | A call that often ends a step (`gh pr create`, `gh pr ready`, `gh pr merge`, a tracker's save tool, or a `Done hints:` entry in `process.md`) leaves a marker. |
| `Stop` | With a marker pending, Claude is asked once whether the step is done, to log its end, and to write the debrief if a PR was marked ready. |

## Files in a project

```
.drillmaster/
  objective.md        # yours: goal, measures, direction
  process.md          # the index: stages, processes, policies, artifacts, states, log storage, step model
  toolchain.md        # your tools, as configured, with the docs read
  templates/          # one template per artifact
  <skill>/history.md  # how each skill changed
  <skill>/versions/   # each skill at each change
  experiments.md      # changes being checked against a measure
  aar/<date>.md       # after-action reports
```

Field logs and debriefs live on issues and PRs, not in these files.

## Tests

```
node --test "tests/*.test.mjs"
```
