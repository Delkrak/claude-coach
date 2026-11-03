# Coach policies

Applies to: Claude, whenever it runs a coach skill or command (`create-command`, `coach-command`,
`coach-setup-process`, `coach-note-friction`, `coach-improve-process`).

A coach process cites the rule it applies as `← POLICIES.md §<n>`. A cited rule binds at that step;
an uncited rule binds anyway.

## Definitions

- **Skill**: a skill or command file a coach process can change: a project's process or policy, or
  one of coach's own.
- **Process**: a skill made of steps; it describes how a work item moves.
- **Policy**: a skill made of rules; it describes what must hold, inside or outside a process.
- **Work item**: one unit of delivered work: an issue, a pull request, a review.
- **Friction**: a moment where the user corrected, redirected, repeated, stopped or undid what
  Claude did, or where work was redone.
- **Review**: a run of `coach-command` or `coach-improve-process`.
- **Change**: an edit to a skill's text.
- **Experiment**: a change with an intended outcome and a check, logged in `experiments.md`.
- **Evidence**: a session id together with the user's words, quoted.

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
    Check: each rule has both lines; the check names something visible in a transcript or a file.

0.4 Claude MUST define a term before a rule uses it, and MUST use it in that one meaning.
    Intent: two readers apply the rule the same way.
    Check: every term in a rule appears under Definitions.

0.5 Claude MUST write every exception out. A policy with no written exception has none.
    Intent: no exception is assumed.
    Check: the policy has an Exceptions section; its body is the exceptions or `None.`

0.6 Every policy MUST end with what to do when a rule can't be kept: stop, name the rule, wait for an
    order from the user.
    Intent: a rule that can't be kept is surfaced, not bent.
    Check: the section is present; transcripts show a stop naming the rule, not a workaround.

0.7 Claude MUST rewrite or drop a rule nobody can check.
    Intent: a rule that can't be checked can't be coached.
    Check: no rule's `Check:` line is empty or says "use judgement".

## 1. Changing a skill

1.1 Claude MUST NOT change a skill outside a review.
    Intent: a change is made when the work item is done and the evidence is in, not mid-way.
    Check: every edit to a skill falls inside a review run and has a history entry.

1.2 Claude MUST present the full list of proposed changes before it makes any of them.
    Intent: the user sees the whole picture before deciding on the parts.
    Check: the list appears in the transcript before the first edit.

1.3 Claude MUST propose one change at a time and MUST make it only after the user approves it.
    Intent: every change is the user's decision.
    Check: each edit follows an approval of that change alone.

1.4 When the user approves a change and modifies or extends it, Claude MUST restate the full change
    in one line and wait for confirmation before making it.
    Intent: no iterating towards a target the user never stated whole.
    Check: a restatement and a confirmation sit between the modified approval and the edit.

1.5 When the user rejects a change, Claude MUST record it in the history and move to the next one.
    Intent: a rejected idea is not proposed again without new evidence.
    Check: the rejection appears under the review's history entry.

1.6 After the approved changes of a review, Claude MUST save the full text of each changed skill to
    `.coach/<skill>/versions/v<N>.md` and append a history entry naming `v<N>` (§4).
    Intent: every version can be read and restored.
    Check: the snapshot and the entry exist for every changed skill.

1.7 Claude MUST open an experiment (§4.4) for each change `coach-improve-process` makes.
    Intent: every change is checked against later work.
    Check: each change has an `E<N>` entry naming it.

## 2. Evidence

2.1 Every friction note, experiment and verdict MUST carry evidence: the session id and the user's
    words, quoted.
    Intent: a claim can be traced back to what happened.
    Check: each entry names a session id and quotes the user.

2.2 Claude MUST NOT give a verdict on an experiment with no observation recorded since it started.
    Intent: no verdict from the absence of evidence.
    Check: every verdict follows at least one observation line.

2.3 Claude MUST NOT invent a rule, a step or a quote. Where the user hasn't decided, Claude MUST write
    `TODO` and name the decision.
    Intent: the user owns the process; coach records it.
    Check: every rule in a scaffolded skill is `TODO` or traces to the user's words.

## 3. Classifying friction

3.1 Claude MUST classify each friction as exactly one of:
    - **process gap**: a step is missing, wrong, in the wrong order, or hands off badly;
    - **policy gap**: a rule is missing, wrong, ignored, or breaks §0;
    - **not covered**: no process or policy governs the work it happened in.
    Intent: the fix goes to the right skill.
    Check: every note and experiment names its class.

3.2 When a rule exists and was not applied at a step, Claude MUST classify it as a process gap at that
    step (the citation is missing), not a policy gap.
    Intent: a good rule isn't rewritten because a step forgot it.
    Check: such a fix adds a `← <policy>` citation to the step.

3.3 Claude MUST record friction with coach's own skills or this file the same way, under the coach
    skill it concerns, or `POLICIES` for this file.
    Intent: coach is coached like any process.
    Check: friction about coach appears under `.coach/<coach skill>/` or `.coach/POLICIES/`.

## 4. Logs

4.1 Claude MUST keep every log in the project, under `.coach/<skill>/`:
    `history.md`, `versions/v<N>.md`, `experiments.md`, `friction.md`.
    `.coach/process.md` is the index of the project's processes and policies.
    Intent: the record lives with the work it describes, in version control.
    Check: no coach log exists outside `.coach/`.

4.2 Claude MUST date every entry `DD-MM-YYYY HH:mm`, local time.
    Intent: entries sort and compare the same way in every log.
    Check: every entry header matches the format.

4.3 Claude MUST write one idea per bullet.
    Intent: each idea can be confirmed, changed or dropped alone.
    Check: no bullet joins two ideas with "and", ";" or "also".

4.4 Claude MUST write history, experiments and friction notes in these forms.

    History (`history.md`, newest first):
    ```
    ## v<N> — <DD-MM-YYYY HH:mm>
    - Working well
      - <one thing>
    - Not working
      - <one thing>
    - Changed
      - <one change> — <reason>
    - Preserved
      - <one thing left untouched> — <reason if not obvious>
    ```
    Without a snapshot (no change made), the header is `## <DD-MM-YYYY HH:mm>`.

    Experiment (`experiments.md`, newest first):
    ```
    ## E<N> — <title> — running | worked | didn't work | abandoned
    - Started: <DD-MM-YYYY HH:mm> · <skill> v<N> · process gap | policy gap
    - Friction: <the notes or session ids it came from>
    - Change: <what was edited>
    - Intended outcome: <what should be different>
    - How to check: <what to look for in later sessions>
    - Observations:
      - <DD-MM-YYYY HH:mm> · session <id> · seen | not seen — <quote or fact>
    - Verdict: <DD-MM-YYYY HH:mm> — <reason>
    ```

    Friction note (`friction.md`, newest last):
    ```
    - <DD-MM-YYYY HH:mm> · session <id> · <work item>
      - What happened: <what Claude did>
      - What the user wanted: "<their words>"
      - Gap: process (<skill>, step <n>) | policy (<skill>, rule <n> or missing) | not covered
    ```
    Intent: every review reads every log the same way.
    Check: entries parse in these forms.

4.5 Claude MUST remove a friction note from `friction.md` once a review has used it, and name it in
    that review's history entry.
    Intent: `friction.md` holds only what is still waiting.
    Check: no note in `friction.md` predates the last review that used it.

## 5. Preserving what works

5.1 In every review Claude MUST name what worked and record it under "Working well" or "Preserved".
    Intent: a change doesn't remove what is already right.
    Check: each history entry has at least one such bullet, or says none was seen.

5.2 Claude MUST NOT reopen a decision the history records as preserved or rejected, unless new
    evidence contradicts it; when it does, it MUST cite that evidence.
    Intent: settled questions stay settled.
    Check: a proposal touching a preserved item quotes new evidence.

## Exceptions

None.

## When a rule can't be kept

Stop. Tell the user which rule (`§<n>`) and why. Wait for an order.

## Precedence

The user's explicit order in the session wins over this file. This file wins over a coach skill's
own wording. A project's own policies govern the project's work; this file governs only how coach
records and changes them.
