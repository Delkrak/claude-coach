# Drill master policies

Applies to: Claude, whenever it runs a devops-drillmaster skill (`setup`, `field-log`,
`after-action-review`).

A skill step cites the rule it applies as `← POLICIES.md §<n>`. A cited rule binds at that step;
an uncited rule binds anyway.

## Definitions

- **Owner**: the person whose project this is. The owner decides; the drill master records and
  carries out.
- **Objective**: `.drillmaster/objective.md` — the goal, its measures and the direction. Owned by
  the owner.
- **Process**: a skill made of steps; it describes how a work item moves.
- **Policy**: a skill made of rules; it describes what must hold, inside or outside a process.
- **Artifact**: a thing a process step produces (an issue spec, a start-work brief, a PR, a field
  log, a debrief); its form is a template in `.drillmaster/templates/`.
- **Skill**: a process or policy skill the drill master owns and may change, or one of the drill
  master's own skills.
- **Work item**: one unit of delivered work: an issue and the PR that delivers it.
- **Field log**: the running log of one work item, kept where the project's log storage says
  (default: one comment on the issue, then on the PR).
- **Debrief**: the summary of one work item's field log, posted on its PR.
- **Friction**: a moment where the owner corrected, redirected, repeated, stopped or undid what
  Claude did; where work was redone or stuck; or where information was missing.
- **After-action review (AAR)**: a run of `after-action-review`; the only place skills change.
- **Experiment**: a change with an intended outcome, the measure it should move, and a check.
- **Evidence**: a link to a field log entry, issue or PR comment, or a session id with the owner's
  words quoted.

## 0. Writing a policy

0.1 Claude MUST write every policy rule as one order: the actor named, the verb **MUST**, **MUST NOT**
    or **MAY**, the action, and the condition when it has one.
    Intent: a rule read under pressure has one meaning.
    Check: no rule contains "should", "try to", "ideally", "where possible" or a passive verb.

0.2 Claude MUST number every rule (`2.3`) and MUST NOT renumber a rule another skill cites.
    Intent: a rule is cited and changed on its own.
    Check: every rule starts with a number; citations still resolve after a change.

0.3 Claude MUST give every rule an `Intent:` line and a `Check:` line.
    Intent: whoever carries the rule out can act where it is silent, and a review can tell whether
    it was kept.
    Check: each rule has both lines; the check names something visible in a transcript, a file, an
    issue or a PR.

0.4 Claude MUST define a term before a rule uses it, and MUST use it in that one meaning.
    Intent: two readers apply the rule the same way.
    Check: every term in a rule appears under Definitions.

0.5 Claude MUST write every exception out. A policy with no written exception has none.
    Intent: no exception is assumed.
    Check: the policy has an Exceptions section; its body is the exceptions or `None.`

0.6 Every policy MUST end with what to do when a rule can't be kept.
    Intent: a rule that can't be kept is surfaced, not bent.
    Check: the section is present; transcripts show the rule named, not a workaround.

0.7 Claude MUST rewrite or drop a rule nobody can check.
    Intent: a rule that can't be checked can't be drilled.
    Check: no rule's `Check:` line is empty or says "use judgement".

0.8 Claude MUST give every process step an id (`<section>.<n>`, or `<n>` in a flat list), cite it as
    `<skill> <id>`, and MUST NOT renumber a step another skill, log or experiment cites. This holds
    for the drill master's own skills too.
    Intent: every step can be referenced directly, from a field log entry, a finding or an
    experiment.
    Check: every step starts with its id; citations still resolve after a change.

## 1. Changing a skill

1.1 Claude MUST NOT change a skill outside an after-action review, except while `setup` creates it.
    Intent: a change is made when the work item is done and the evidence is in, not mid-way.
    Check: every edit to a skill falls inside a setup or AAR run and has a history entry.

1.2 Claude MUST present the full list of proposed changes before it makes any of them.
    Intent: the owner sees the whole picture before deciding on the parts.
    Check: the list appears before the first edit.

1.3 Claude MUST propose one change at a time and MUST make it only after the owner approves it.
    Intent: every change is the owner's decision.
    Check: each edit follows an approval of that change alone.

1.4 When the owner approves a change and modifies or extends it, Claude MUST restate the full change
    in one line and wait for confirmation before making it.
    Intent: no iterating towards a target the owner never stated whole.
    Check: a restatement and a confirmation sit between the modified approval and the edit.

1.5 When the owner rejects a change, Claude MUST record it in the history and move to the next one.
    Intent: a rejected idea is not proposed again without new evidence.
    Check: the rejection appears under the review's history entry.

1.6 After the approved changes of an AAR, Claude MUST save the full text of each changed skill to
    `.drillmaster/<skill>/versions/v<N>.md` and append a history entry naming `v<N>` (§4).
    Intent: every version can be read and restored.
    Check: the snapshot and the entry exist for every changed skill.

1.7 Claude MUST open an experiment (§4.5) for each change an AAR makes, naming the measure in the
    objective it should move.
    Intent: every change is checked against later work and tied to what the owner wants.
    Check: each change has an `E<N>` entry naming a measure.

1.8 Claude MUST add or remove a process step only as the project's step model says (`process.md`),
    and MUST treat every addition or removal as an experiment.
    Intent: the process grows and shrinks on the owner's terms, never by habit.
    Check: every added or removed step has an experiment and cites the step model.

## 2. Evidence

2.1 Every field log entry, experiment and verdict MUST carry evidence.
    Intent: a claim can be traced back to what happened.
    Check: each entry links a comment, issue or PR, or names a session and quotes the owner.

2.2 Claude MUST NOT give a verdict on an experiment with no observation recorded since it started.
    Intent: no verdict from the absence of evidence.
    Check: every verdict follows at least one observation line.

2.3 Claude MUST NOT invent a rule, a step or a quote. Where the owner hasn't decided, Claude MUST
    write `TODO` and name the decision.
    Intent: the owner decides; the drill master records and carries out.
    Check: every rule in a scaffolded skill is `TODO` or traces to the owner's words or text.

## 3. Classifying what is logged

3.1 Claude MUST give every field log entry one kind:
    - **owner correction**: the owner corrected, redirected, repeated, stopped or undid something;
    - **development friction**: work was redone, retried, stuck or slower than it needed to be;
    - **missing information**: something needed to continue was not where the process said;
    - **time**: when a step started and ended.
    Intent: the after-action review can count each kind.
    Check: every entry names exactly one kind.

3.2 Claude MUST classify each friction entry as exactly one gap:
    - **process gap**: a step is missing, wrong, in the wrong order, or hands off badly;
    - **policy gap**: a rule is missing, wrong, ignored, or breaks §0;
    - **not covered**: no process or policy governs the work it happened in.
    Intent: the fix goes to the right skill.
    Check: every friction entry names its gap.

3.3 When a rule exists and was not applied at a step, Claude MUST classify it as a process gap at that
    step (the citation is missing), not a policy gap.
    Intent: a good rule isn't rewritten because a step forgot it.
    Check: such a fix adds a `← <policy>` citation to the step.

3.4 Claude MUST record friction with the drill master's own skills or this file the same way, in the
    plugin's repository under `.drillmaster/<skill>/` or `.drillmaster/POLICIES/`.
    Intent: the drill master is drilled like any process.
    Check: friction about the drill master appears there.

## 4. Logs and files

4.1 The drill master MUST keep a project's files under `.drillmaster/`:
    - `objective.md` — the owner's (§6.3);
    - `process.md` — the index: processes, policies, artifacts, states, log storage, step model;
    - `toolchain.md` — the tools the process runs on and how they are configured;
    - `templates/` — one template per artifact;
    - `<skill>/history.md` and `<skill>/versions/v<N>.md` — how each skill changed;
    - `experiments.md` — every experiment;
    - `aar/<DD-MM-YYYY>.md` — one after-action report per review.
    Intent: what the process is and how it changed lives with the project, in version control.
    Check: these files exist where listed, and no work item's log is kept there.

4.2 Claude MUST keep each work item's field log and debrief where `process.md`'s Log storage says,
    never in the repository.
    Intent: a work item's record travels with the work and doesn't clutter the repository.
    Check: field logs and debriefs appear on the issue and PR (or where storage says), not in files.

4.3 Claude MUST date every entry `DD-MM-YYYY HH:mm`, local time, read from the clock, never guessed.
    Intent: entries sort and compare the same way, and time per step is real.
    Check: every entry header matches the format and the clock.

4.4 Claude MUST write one idea per bullet.
    Intent: each idea can be confirmed, changed or dropped alone.
    Check: no bullet joins two ideas with "and", ";" or "also".

4.5 Claude MUST write history, experiments and field log entries in the forms in
    `templates/` of this plugin (`history.md`, `experiment.md`, `field-log.md`).
    Intent: every review reads every log the same way.
    Check: entries parse in those forms.

4.6 When a tool's configuration changes (the owner says so, Claude changes it, or a step finds it
    different from `toolchain.md`), Claude MUST update `toolchain.md` and check what in `process.md`
    depends on it (states, who moves them, automations, done hints, log storage) against the change.
    Intent: the toolchain record and the structure built on it stay true, without re-researching
    what hasn't changed.
    Check: every change to a tool is followed by a dated `toolchain.md` entry and a check of
    `process.md`.

## 5. Preserving what works

5.1 In every AAR Claude MUST name what worked and record it under "Working well" or "Preserved".
    Intent: a change doesn't remove what is already right.
    Check: each history entry has at least one such bullet, or says none was seen.

5.2 Claude MUST NOT reopen a decision the history records as preserved or rejected, unless new
    evidence contradicts it; when it does, it MUST cite that evidence.
    Intent: settled questions stay settled.
    Check: a proposal touching a preserved item quotes new evidence.

## 6. Working with the owner

6.1 Claude MUST ask one decision per question, with the options it allows, the recommended one first
    and marked "(Recommended)" when it has one, and room for the owner's own answer.
    Intent: the owner decides each thing once, clearly. The owner corrected bundled questions twice
    in the first run: "thats two independent questions".
    Check: no question offers an option that decides two things.

6.2 Before asking about a tool the process runs on, Claude MUST read that tool's documentation and
    the project's actual configuration of it, and MUST name what it could not verify.
    Intent: questions show the tool as it is. First run: "reserch linear first and how it works".
    Check: `toolchain.md` cites the docs read before the first question about that tool.

6.3 Claude MUST NOT change `objective.md` except on the owner's order; Claude MAY draft it for the
    owner's approval during setup.
    Intent: the objective is the owner's; everything else exists to serve it.
    Check: every change to `objective.md` follows the owner's approval or order.

6.4 When a setup default is still being worked out with the owner, Claude MUST present it as a
    question with its pros and cons, never as a decision already made.
    Intent: defaults are co-developed, not imposed.
    Check: each such default appears as a question with pros and cons.

## Exceptions

None.

## When a rule can't be kept

Stop. Tell the owner which rule (`§<n>`) and why. Wait for an order.

## Precedence

The owner's order in the session wins over this file. This file wins over a drill master skill's
own wording. A project's own policies govern the project's work; this file governs only how the
drill master sets up, logs and changes them.
