# claude-coach

A coach for your Claude Code workflow.

claude-coach is a Claude Code plugin that helps your commands and skills improve over time — capturing corrections from each session and applying them back to the source.
## Installation

Add the marketplace:

```
/plugin marketplace add Delkrak/claude-coach
```

Then install the `coach` plugin:

```
/plugin install coach@claude-coach
```
## Commands
### `/coach:coach-command`

Reviews the current session for corrections and applies them to a target command.

**Usage:** `/coach:coach-command <command-name>`

If no command name is given, it infers the last command run and asks for confirmation.

**What it does:**
1. Reads the target command file
2. Checks its correction history in `.coach/<name>/history.md`
3. Extracts corrections from the session — what Claude got wrong and what the user wanted instead
4. Presents the full list before touching anything
5. Applies changes one at a time with confirmation
6. Appends a structured entry to the history file

History accumulates across sessions, so future runs inherit not just the rules but the reasoning behind them.

## Process coaching

Coach can also look after a project's whole way of working, the way a Scrum Master would. It sees
that way of working as two kinds of skill:

- **Processes** are steps: how a work item moves (*create an issue*, *build an issue*, *review a
  change*). Each step cites the policy that applies there: `2. Write a failing test ← coding-policy §2.1`.
- **Policies** are rules: what must hold, inside a process or outside it (*issue-policy*,
  *coding-policy*, *code-review-policy*). They are written like a contract and read like an order:
  numbered rules, only **MUST** / **MUST NOT** / **MAY**, and an `Intent:` and a `Check:` line per rule,
  so a review can tell from a transcript whether the rule was kept.

Coach is built the same way: its skills and commands are its processes, and
[`POLICIES.md`](POLICIES.md) holds its policies (how a policy is written, how a skill is changed,
evidence, classifying friction, logs, preserving what works).

### `/coach:coach-setup-process`

Takes stock of the project's skills, asks how coach should approach each area (adopt an existing
skill, scaffold an empty one, or skip), and writes the index `.coach/process.md`, skeletons for the
gaps, and empty logs. It offers to raise `cleanupPeriodDays`, since coach checks its experiments
against session transcripts and Claude Code deletes them after 30 days by default.

### `/coach:coach-note-friction`

Writes notes, never changes a skill.
- **note**: when you correct, redirect, repeat, stop or undo, it records the friction in
  `.coach/<skill>/friction.md`, classified as a process gap, a policy gap, or not covered.
- **wrap-up**: when a work item is done, it finishes the item's notes, records what worked, and adds
  an observation to each running experiment. It suggests a review once notes pile up.

### `/coach:coach-improve-process [current|recent|all] [focus]`

The review. It reads the friction notes and the sessions in scope (including worktree sessions),
judges running experiments against what happened since, and proposes changes. You approve each one.
Every change is snapshotted, logged, and opened as an experiment with an intended outcome and how to
check it.

### Hooks

Process coaching runs only in a project that has `.coach/process.md`; elsewhere the hooks do nothing.

| Event | What it does |
|---|---|
| `UserPromptSubmit` | A message that reads like a correction ("no", "I already said", "undo", "instead"…) reminds Claude to use `coach-note-friction`. Claude decides whether it is one. |
| `PostToolUse` (`Bash`, MCP tools) | A call that often ends a work item (`gh pr create`, `gh pr merge`, a tracker's save tool, or a project's own `Done hints:` in `process.md`) leaves a marker for the session. |
| `Stop` | With a marker pending, Claude is asked once whether the work item is done, and if so to wrap up. Never twice for one call. |

The `PostToolUse` hook starts Node on every Bash and MCP call (about 40 ms), because a project's own
done hints can be any command.

### Files in a project

```
.coach/
  process.md                 # processes and policies: skill, what it covers, citations, done hints
  <skill>/history.md         # change log
  <skill>/versions/v<N>.md   # the skill at each change
  <skill>/experiments.md     # changes being checked: intended outcome, how to check, observations, verdict
  <skill>/friction.md        # notes waiting for a review
  coach-improve-process/history.md   # each review: scope, sessions read, verdicts, changes
```

### Tests

```
node --test "tests/*.test.mjs"
```