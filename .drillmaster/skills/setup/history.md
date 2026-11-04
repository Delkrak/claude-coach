## v2 — 04-11-2026 21:28
- Changed
  - 3.3's process.md form names the three log storages — the owner: "make it up to the project how it does this"
  - Comments stay the default — no other default was decided
- Preserved
  - Every step id — POLICIES §0.8
  - No question about log storage — not decided
  - The owner chooses the storage in process.md — the owner: "make it up to the project how it does this"

## 04-11-2026 20:14
- Changed
  - Rewritten as light as possible: asks the goal and which work processes, reads the toolchain, copies from the library unchanged, writes, builds the process overview, one PR — "Setup asks the basic things, and should ask what steps should be included (copy only from library), and then retrospective is going to adopt them over time."
  - No research questions, no rule-by-rule review, no co-developed defaults, no stress test; adapting is the retrospective's job
  - Formats of objective.md, process.md and toolchain.md written inline; step ids start again at 1.1
- Not working
  - The Keeper setup asked ~70 decisions one by one — "this was PAINFUL!"

## 04-11-2026 01:30
- Changed
  - Creates only; update mode removed — later changes go through retrospective and process-change
  - Step model removed (5.7 kept unused); 5.8 is now each work process's capture specification
  - Every measure names the work process that records it; setup refuses a measure nothing records
  - Work policy rules have an input or output as subject (§0.1)
  - Report in the drill-sergeant voice, with an example (9.3)
- Preserved
  - 2.3 vendor workflow, 3.1 owner's experience, 5.2 co-developed defaults — "the previous two serve to tell drillmaster how to serve Owner"

## v1 — 03-11-2026 22:42
- Working well
  - Drafting policies from the owner's own text, accepted rule by rule
  - Checking each existing principle against the code with a read-only agent before proposing it
  - Three independent read-only reviewers found 12 problems the setup had missed
- Not working
  - No question for the outcome — "One thing we forgot to define is the outcome this process is suposed to facilitate!"
  - The tracker was not researched before mapping onto it — "reserch linear first and how it works"
  - Two decisions bundled in one option — "thats two independent questions"
  - A brief was set up as a process and a policy — "brief is not a process or policy, or am i wrong?"
  - The vendor's designed workflow (cloud build, review, auto-fix) was found only after go-live
- Changed
  - Renamed from coach-setup-process; moved into the devops-drillmaster plugin — the owner's rename to a DevOps-specific suite
  - Objective first, written to objective.md, owned by the owner — stages A3b, B1
  - Toolchain researched into toolchain.md before any question; vendor workflow proposed as the default after thorough research — B2, B3
  - Experience level and weight (Light / Standard / Full, full DevOps loop) asked up front — C1, C4
  - Processes, policies and artifacts told apart; artifacts get templates — C2
  - Who moves each tracker state asked per state — C3
  - Log storage offered from a default table; step model chosen by the owner — A3a, C5, C6
  - Co-developed defaults asked with pros and cons, not baked in — E
  - Stress test with three reviewers before going live — D2
- Preserved
  - Nothing is written before the owner approves the whole setup

## 01-11-2026 04:09
- Created
  - Purpose: create a set of basic, empty policies and processes depending on the project, adopting the skills it already has
  - Arguments: optional areas to set up; none means all
  - Asks the user how coach should approach each area: adopt, scaffold or skip
  - Processes are skills made of steps that cite policies; policies are skills of their own
  - Policies are written with the sharp wording of a legal contract and the directness of a military chain of command (POLICIES.md §0)
  - Offers to raise cleanupPeriodDays so experiments can be checked against old sessions
