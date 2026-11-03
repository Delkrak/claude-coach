# Suggested steps

The drill master's catalog of the full DevOps loop: every suggested stage and step, **in the order
they are suggested to run**. `setup` offers it (3.2, 5.1, 5.4–5.6); the owner keeps, changes or
drops each step; what is chosen becomes the project's process skills and `.drillmaster/process.md`.

Each step has an id (`<stage>.<n>`), kept when a process is scaffolded from it, so a field log entry,
a finding or an experiment can point at it (POLICIES.md §0.8). Steps marked **log** are the field
log steps (`devops-drillmaster:field-log`); where the log goes is the project's Log storage:
**comments** (issue, then PR) or **drills** (`.drillmaster/drills/<work item id>/`).

Priority levels: **Light** keeps stages 1, 3, 5, 6 and 9; **Standard** adds 2 and 4; **Full** adds
7 and 8.

## 1. Capture — Light

For: an idea becomes an item in the tracker. Relevant: always.
Produces: an issue. States: → backlog, moved by the process. Done hints: the tracker's save tool.

1.1 **log** — start.
1.2 Search the tracker for the same thing; link a related item instead of creating a duplicate.
1.3 Write the title and the owner's words as the description.
1.4 Set the kind (e.g. feature, bug) and the epic or project, when the owner named them.
1.5 Save it in the backlog state.
1.6 **log** — the owner's words, anything missing; end.

## 2. Refine — Standard

For: an item becomes specced and approved. Relevant: work needs decisions before it is built.
Produces: an issue spec; a start-work brief (`start-work-brief.md`). States: backlog → specced →
ready, moved by the process; into ready only on the owner's approval. Done hints: the tracker's save
tool.

2.1 **log** — start.
2.2 Read the docs and the code the item touches; every claim about today's behaviour names its
    files.
2.3 Ask the owner every decision the code can't answer, one per question, recorded on the item.
2.4 Ask the owner about consequences that aren't obvious: what users will notice, data that can be
    lost, blast radius, overlaps, what gets harder later.
2.5 Write the spec: why, today, what, acceptance criteria (each naming its check), out of scope,
    notes; set the kind; split work too big for one PR into sub-items.
2.6 Save it as specced; on the owner's approval, write the start-work brief into it and move it to
    ready.
2.7 **log** — decisions, questions, consequences; end.

## 3. Build — Light

For: a ready item becomes a PR. Relevant: always.
Produces: a branch and a draft PR. States: ready → in progress by the process; → in review by the
git automation when configured. Done hints: `gh pr create`.

3.1 **log** — start.
3.2 If the item it is blocked by has no PR yet, don't start: leave it in ready.
3.3 Move it to in progress.
3.4 Check the item is buildable as written, and re-check its "today" against the code; a gap goes
    to the owner.
3.5 Choose the base branch (the blocker's branch while its PR is open) and create the item's branch.
3.6 Build it; a bug fix starts with a failing test.
3.7 Verify it: the project's checks green.
3.8 File each thing noticed but not in scope as a new item, linked from the PR.
3.9 Open the PR as a draft; copy the field log to it when storage is **comments**.
3.10 **log** — development friction, noticed items; end.

## 4. AI review — Standard

For: the PR is reviewed by AI against the policies before the owner sees it. Relevant: the AI
vendor or CI offers review. Produces: review rounds on the PR, each traceable (what was found, what
was done). States: stays in review. Done hints: `gh pr ready`.

4.1 **log** — start.
4.2 Start a review round with a brief naming the policies and the item's acceptance criteria.
4.3 Fix each finding, or answer it on the PR with why not; take judgement calls to the owner.
4.4 Repeat until a round finds nothing, up to the project's cap; past the cap, go to the owner.
4.5 With a clean round and green checks, mark the PR ready.
4.6 **log** — rounds, findings, fixes; end.

## 5. Debrief — Light

For: the item's field log becomes its summary. Relevant: always.
Produces: a debrief (`debrief.md`). Done hints: `gh pr ready`.

5.1 Write the debrief from the field log: outcome, time per stage, friction by kind, review rounds,
    noticed items.
5.2 Add an observation to each running experiment this item bears on.

## 6. User review — Light

For: the owner reviews and merges, or sends it back. Relevant: always.
Produces: review comments. States: in review → done, by the git automation when configured, else the
process. Done hints: `gh pr merge`.

6.1 **log** — start.
6.2 The owner reviews the PR.
6.3 Feedback: return the PR to draft, build the feedback into it, and run AI review again (4).
6.4 The owner merges; the item moves to done.
6.5 Update the debrief with the owner's review: rework rounds, comments, merge time.
6.6 **log** — the owner's feedback, rework rounds; end.

## 7. Release / deploy — Full

For: what merged reaches users. Relevant: there is a deploy step beyond merge (preview or production
environments, releases). Produces: release notes. States: done → released, by release automation when
configured. Done hints: the deploy command.

7.1 **log** — start.
7.2 Deploy, or confirm the automatic deploy ran.
7.3 Verify the change in the deployed environment.
7.4 Write the release notes.
7.5 **log** — what shipped, deploy problems; end.

## 8. Operate / monitor — Full

For: the running system is watched. Relevant: there are users or uptime to protect.
Produces: incident items, which feed capture (1).

8.1 Watch the signals the project chose (errors, uptime, user reports).
8.2 Capture each incident as an item (1), linked to the change that caused it when known.
8.3 **log** — on the incident item: what happened, how it was found.

## 9. After-action review — Light

For: the process improves from evidence. Relevant: always.
Produces: an after-action report (`after-action-report.md`) and experiments.

9.1 Run `/devops-drillmaster:after-action-review` on the project's rhythm, or when a debrief says
    it is due.

Stages the owner's priority leaves out are not shown during setup; they come back if a stage is
added later.
