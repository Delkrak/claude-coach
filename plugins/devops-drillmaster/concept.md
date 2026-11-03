# The drill master — concept

## Introduction

> **LISTEN UP, AGENTS!**
>
> Owner hired me to turn this pile of rusty gears into a well oiled machine.
>
> We are going to deliver on Owners objective by following a process with policies. You follow them
> to the letter.
>
> The process and policies are not perfect. Not at all. So you report every impediment. Every.
> Single. One.
>
> We use the impediments to improve the process and policies you hear me.
>
> **IS THAT CLEAR?**

## 1. The objective

Everything starts from the owner's objective: the goal in their own words, the measures that show
whether it is being reached, and the direction and constraints that come with it. Nothing else in
the setup has a value of its own. A process exists because it moves a measure; a rule exists because
breaking it costs the objective something; a change is kept only if a measure says it helped.

That is why the objective is the owner's alone. The drill master drafts it from the owner's words and
then never touches it without an order: if the drill master could edit the goal, it could make any
process look successful.

## 2. Processes

The work is done by AI agents following **processes**. A process is a skill that moves a work item
one stage on: an idea becomes an issue, an issue becomes work-ready, a work-ready issue becomes a PR,
and so on. Processes run in order, each handing its result to the next.

A process is made of numbered **steps**, and each step keeps its id for good (`build-process 3.5`).
That is what lets everything else point at exactly where something happened: an impediment, a review
finding, an experiment. A process that can't be pointed at can't be improved.

## 3. Inputs, outputs and policies

A process is defined less by what it does than by what it takes in and what it hands on. Its
**input** is what it needs to start; its **output** is what it produces. Everything produced is
output: an issue, a spec, a PR, and the code itself.

**Policies** set the bar. Each kind of output has a policy whose rules it must meet, and the same
policy is the bar for the next process's input, because one process's output is the next one's input.
That is how quality is carried along the chain instead of being inspected at the end. Rules are
written as orders — who must do what, when — each with its reason and how it is checked, so an agent
can follow them under pressure and a review can tell whether they were kept.

## 4. Checks

A process never trusts its input blindly and never hands on its output on faith. Its first real step
checks the input against its policies; its last real step checks the output. Each check says how it
is done, by whom, and where the result is recorded, so the proof outlives the session that did it.

A failed check is not a failure of the agent; it is information. It becomes an impediment, logged at
that step's id, and goes to the owner when only the owner can resolve it.

```mermaid
flowchart LR
    obj(["Objective<br/>goal · measures"])
    inPol[["Input policy<br/>rules + checks"]]
    outPol[["Output policy<br/>rules + checks"]]
    input["Input"]
    process["Process<br/>step 1 … step n"]
    output["Output"]
    next["Next process"]
    log[("Impediment log")]

    input -->|checked at the first step| process
    process -->|checked at the last step| output
    output --> next
    inPol -. must meet .-> input
    outPol -. must meet .-> output
    process -. serves .-> obj
    process -->|start · impediments · process summary| log
```

## 5. Impediments and the log

Improvement needs evidence, and chat history is not evidence: it is long, private, and deleted after
a while. So the work reports on itself as it goes. Every process opens an entry in the work item's
**impediment log**, records each **impediment** as it happens — the owner had to correct something,
work was redone or stuck, information was missing — and closes with a **process summary**: what it
achieved, what slowed it, how long it took.

The log travels with the work item (on its issue, then its PR, or in the repository), so anyone can
see what happened without the session. Before the owner reviews a PR, the process summaries are
pulled together into the **item summary**: one short account of how the item went.

## 6. The retrospective and experiments

Processes and policies change in one place only: the **retrospective**. It asks what was supposed to
happen, what happened, why, what to keep, and what to improve — from the logs, the summaries, the
tracker's timings and the sessions.

Every change it makes is an **experiment**: one change at a time, approved by the owner, tied to the
measure it should move and to how that will be checked. Later work items supply the observations, and
a later retrospective gives the verdict: keep it, or roll it back. Steps are added or removed the same
way, by the rule the owner chose for that at setup. The process grows only where evidence says it
needs to, and shrinks where a step costs more than it catches.

```mermaid
flowchart LR
    items["Work items"]
    log[("Impediment logs")]
    summary["Item summaries"]
    retro{{"Retrospective"}}
    exp["Experiments"]
    skills["Processes<br/>& policies"]
    obj(["Objective<br/>measures"])

    items --> log --> summary --> retro
    retro -->|one change at a time| exp
    exp -->|changes| skills
    skills -->|run the next| items
    retro -. judged against .-> obj
```

## The loop in practice

1. **Setup** (`/devops-drillmaster:setup`): the objective first; the toolchain researched, and any
   vendor's designed workflow proposed; the owner's experience and priority (Light / Standard /
   Full); processes and policies chosen from the [process list](process-list/) and
   [policy list](policy-list/), one decision per question; the settings only the owner can change
   listed; a stress test by three reviewers before going live.
2. **Work**: every work item runs through the processes, each logging as it goes
   (`/devops-drillmaster:impediment-log`); the PR gets its item summary before the owner's review.
3. **Retrospective** (`/devops-drillmaster:retrospective`): on the project's rhythm, turning the
   evidence into the next experiments.

## The two lists

- [`process-list/`](process-list/) — the suggested processes, in order. `0-template.md` is the shape
  of every process: input (and its policies), steps, output (and its policies), checks, hand-off.
- [`policy-list/`](policy-list/) — the suggested policies, one per kind of output. `0-template.md`
  is the shape of every policy: definitions, rules with intent and check, exceptions, what to do when
  a rule can't be kept.

## Ground rules

The drill master's own rules are in [`POLICIES.md`](POLICIES.md). The ones that shape everything:

- The owner decides; one decision per question; nothing written before approval.
- Research a tool before asking about it.
- No rule, step or quote is invented: what the owner hasn't decided stays `TODO`.
- Processes and policies change only in a retrospective, one approved change at a time.
- Every claim carries evidence; every change is an experiment.
