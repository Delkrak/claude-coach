## v2 — 04-11-2026 21:28
- Changed
  - §4.2: log storage **attachment** added — Keeper retrospective 04-11-2026, C1
  - §4.2: the project chooses its log storage — the owner: "make it up to the project how it does this"
  - §4.2: with attachment, every entry is written by the trace tool — the owner: "We definitely need a tool to create the trace as json"
  - §4.1: a JSON trace is copied as `traces/<key>-trace.json` — follows §4.2's attachment storage
- Preserved
  - §4.3: time read from the clock, never guessed — the tool now enforces it for attachment

## 04-11-2026 20:14
- Changed
  - §4.5: the history and experiment forms are written in the rule; the plugin keeps only the trace and summary templates — "The usage of templates should be drastically reduced"
  - §4.1: skill histories under .drillmaster/skills/<skill>/ — "please put into .drillmaster/skills/<x>"; templates/ only for an artifact the project designs; traces/ until a retrospective has used them

## 04-11-2026 20:00
- Changed
  - Tracing replaces impediment and metric capture: definitions, §2.5, §3, §4 — the owner's concept change
  - §0.9 added: a skill is referenced as the command that runs it — "make this a drillmaster policy as well"

## 04-11-2026 01:30
- Changed
  - §0.1: a rule's subject is an input or output, never instructions — "a policy can say what must preceed, but not the specific order/instruction"
  - §1.1: changes only through process-change, from a retrospective; setup creates once
  - §1.3: deliberate and independently measurable, replacing one change at a time
  - §1.7, §2.4: experiments carry a baseline; keep only when the impediment is gone and the measure holds
  - §1.8 removed (step model); id not reused
  - §2.5 added: the retrospective works from the capture; transcripts for extended analysis
  - §3.1: impediment is any friction; metrics as each work process's specification names
  - §4.6: a toolchain mismatch is recorded as an impediment, not fixed in place
  - Terms: work process, work policy, capture, citation "issue work policy 2.3"
- Preserved
  - §5 and §6 unchanged but for the voice example in §6.5

## 03-11-2026 23:40
- Changed
  - §6.5 added: speak and write as a drill sergeant hired for an agile team, with agile terms — the owner's framing
  - Terms are agile throughout: impediment, impediment log, process summary, item summary, retrospective, items/
  - §0.8 every process step has an id; §4.6 toolchain re-checked on change; §4.7 owner settings raised when off — from the walkthrough

## v1 — 03-11-2026 22:42
- Changed
  - Moved into devops-drillmaster; coach's commands keep their own rules — A2
  - §6 added: one decision per question; research a tool before asking about it; the objective is the owner's; co-developed defaults asked with pros and cons
  - §3 classifies what is logged by kind (owner correction, development friction, missing information, time) and by gap
  - §4 rewritten for .drillmaster/ and for field logs and debriefs living on issues and PRs
  - §1.7–§1.8: experiments name a measure; steps are added or removed only by the project's step model
- Preserved
  - §0 (how a policy is written) and §5 (preserving what works) unchanged

## 01-11-2026 04:09
- Created
  - Purpose: coach's own policies, made explicit; coach's skills and commands are its processes
  - One file, cited from process steps as `← POLICIES.md §<n>`
  - §0 is the writing standard every policy follows, this file included
  - create-command and coach-command still carry their own copies of these rules; moving them is a follow-up
