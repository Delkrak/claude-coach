---
name: coach-note-friction
description: Record friction for coach's next process review, without changing any skill. Note mode, when the user corrects, redirects, repeats, stops or undoes something Claude did (coach's prompt hook cues it). Wrap-up mode, when a work item is done (coach's done hook asks). Only in a project with .coach/process.md.
---

# Note friction

This skill writes notes. It never changes a skill: changes are made in a review, once the work
item is done and the evidence is in ← `POLICIES.md` §1.1. `POLICIES.md` is at the plugin root,
two folders up from this skill's base directory; read it if you haven't this session.

Read `.coach/process.md` first: it says which skills are the project's processes and policies.

**Arguments:** $ARGUMENTS: `note` or `wrap-up`. With none, pick from the situation: `wrap-up` when
a work item has just been done, else `note`.

## Note mode

1. **Decide whether it is friction.** Friction is the user correcting, redirecting, repeating,
   stopping or undoing what you did, or work being redone (definition in `POLICIES.md`). A new
   request is not friction. If it isn't friction, do nothing and say nothing.
2. **Classify it** as one of ← §3:
   - **process gap** (`<process>`, step `<n>`): a step missing, wrong, out of order, or a bad handoff;
     also a rule that exists but the step didn't cite ← §3.2;
   - **policy gap** (`<policy>`, rule `<n>` or missing): a rule missing, wrong, or ignored;
   - **not covered**: no process or policy governs this work.
3. **Append one note** to `.coach/<skill>/friction.md` for the skill it concerns, or to
   `.coach/coach-improve-process/friction.md` when not covered ← §4.4, §2.1:

   ```
   - <DD-MM-YYYY HH:mm> · session <id> · <work item>
     - What happened: <what you did>
     - What the user wanted: "<their words>"
     - Gap: process (<skill>, step <n>) | policy (<skill>, rule <n> or missing) | not covered
   ```

   The session id is the name of the newest `.jsonl` in this project's transcript folder; coach's
   `transcripts.mjs --latest` prints it. The work item is the issue id, branch or PR.
4. **Tell the user in one line:** "Noted for the retro: <the gap, a few words>." Then do what they asked.

## Wrap-up mode

1. **Decide whether the work item is done**, against the `Done when` of the process it ran under. If
   it isn't, say so in one line and carry on with the work.
2. **Finish its notes:** reread the session for friction you didn't note at the time, and note it as
   in note mode. Record what went well too: one line per thing, in the same `friction.md`, as
   `- <date> · session <id> · <work item> · worked: <what>` ← §5.1.
3. **Add an observation** to every running experiment on a skill this work item used
   (`.coach/<skill>/experiments.md`, status `running`), under its `Observations:` ← §2.1:
   `- <DD-MM-YYYY HH:mm> · session <id> · seen | not seen — <quote or fact>`, judged against its
   "How to check".
4. **Nudge, don't review.** Suggest `/coach:coach-improve-process` in one line when any skill has 5 or
   more notes in its `friction.md`, or a running experiment has 3 or more observations. Otherwise say
   only: "Wrap-up noted."
