---
name: coach-improve-process
description: Review how the project's processes and policies worked, from friction notes and session transcripts, judge running experiments, and change the process and policy skills one approved change at a time, each logged as an experiment. Use when the user asks for a retro or process review, wants to know why something keeps going wrong, or when coach-note-friction suggests a review.
---

# Improve the process

The Scrum Master's review. It reads what happened across sessions, checks whether earlier changes
worked, and proposes the next changes. The user decides every change.

Coach's rules are in `POLICIES.md` at the plugin root, two folders up from this skill's base
directory. Read it before step 1; each step names the rule it applies.

**Arguments:** $ARGUMENTS: a scope, then an optional focus in free text.
- Scope: `current` (this session), `recent` (default: since the last review), `all`.
- Focus, e.g. "only code review", "why do issues bounce back": look only at friction that bears on it.

## Steps

### 1. Load the process

Read `.coach/process.md`. If it doesn't exist, offer `coach-setup-process` and stop. Read each listed
skill, and its `.coach/<skill>/history.md`, `experiments.md` and `friction.md` ← §5.2.

### 2. Read the sessions

Use `transcripts.mjs` in this skill's base directory (Node, no dependencies):

```
node "<base dir>/transcripts.mjs" --project "<project dir>" [--since <ISO date>] [--session <id>] [--latest] [--grep <text>]
```

- `current` → `--latest`.
- `recent` → `--since` the date of the last entry in `.coach/coach-improve-process/history.md`; with
  no entry, 7 days ago.
- `all` → no filter.

It prints each session's id, dates, branch, title and tool counts, then every user prompt and
interrupt with the end of the assistant text before it. It covers the project's worktree sessions too.
When more than 5 sessions are in scope, give them to subagents in batches of 5, with this step's
signals and the process index, and keep only their findings (session id, quote, signal).

### 3. Judge running experiments first

For each experiment with status `running`: read its observations, and look in the sessions since it
started for its "How to check". Propose a verdict (`worked`, `didn't work`, or keep `running`) with
the evidence ← §2.1, §2.2. The user confirms. For `didn't work`, offer to restore the previous text
from `.coach/<skill>/versions/v<N-1>.md` as a change of its own.

### 4. Find the friction

From the notes and the sessions, collect:
- the user correcting, redirecting, repeating ("I already said"), stopping, interrupting or undoing;
- tool calls retried 3+ times, an approach abandoned after many calls, work redone;
- the same question asked twice; a policy rule not kept (its `Check:` line is what to look for);
- a policy rule that breaks `POLICIES.md` §0 (a "should", no actor, no check).

Classify each ← §3. Group repeats of one cause. Also collect what worked ← §5.1.

### 5. Present the list

Before changing anything ← §1.2, show:
1. experiment verdicts (from step 3);
2. friction, ranked by how often it happened and how much work it cost, each with its class, the
   skill, the proposed change and the evidence;
3. what worked, to preserve.

### 6. Change one thing at a time

For each proposed change, in order ← §1.3–§1.5:
- **Policy gap** → edit the policy rule, written per §0.
- **Process gap** → edit the step; for a rule that existed but wasn't applied, add the citation
  `← <policy> §<n>` to the step instead ← §3.2.
- **Not covered** → propose a new process or policy, and hand it to `coach-setup-process`.

Wait for approval of each. Then, for every skill changed ← §1.6, §1.7, §4:
1. save its full text to `.coach/<skill>/versions/v<N>.md`;
2. append a history entry `## v<N> — <DD-MM-YYYY HH:mm>`;
3. open an experiment in `.coach/<skill>/experiments.md`:
   ```
   ## E<N> — <title> — running
   - Started: <DD-MM-YYYY HH:mm> · <skill> v<N> · process gap | policy gap
   - Friction: <notes or session ids>
   - Change: <what was edited>
   - Intended outcome: <what should be different>
   - How to check: <what to look for in later sessions>
   - Observations:
   - Verdict:
   ```
4. remove the friction notes this change used from `friction.md` ← §4.5.

Friction about coach itself (its skills or `POLICIES.md`) is handled the same way, in the coach
repo's `.coach/` ← §3.3.

### 7. Record the review

Append to `.coach/coach-improve-process/history.md`:

```
## <DD-MM-YYYY HH:mm>
- Scope: <current | recent | all> · Focus: <focus or none>
- Sessions read: <ids>
- Verdicts: <E<N> worked | didn't work | still running>
- Changes: <skill v<N> — E<N>>
- Rejected: <proposal — reason>
- Preserved: <what worked>
```

Then tell the user what changed, which experiments are running, and what to watch for.
