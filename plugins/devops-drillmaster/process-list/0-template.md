---
name: <process name>
description: <What it turns into what, e.g. "Turn a work-ready issue into a draft PR">. Use when <trigger: what the owner says, or what state the work is in>.
---

# <n>. <Process> — <Light | Standard | Full>

An AI agent process. It serves the objective's measure **<measure>** (`.drillmaster/objective.md`).
Each step is cited as `<process> <n>.<k>`; a cited id never changes (drill master POLICIES §0.8).

## Input

- <what it needs>   ← must meet: <policy> §<n>
- Checked: at <n>.2, by <who>
- Documented: <where the check's result is recorded>

## Steps

<n>.1 **log** — start.
<n>.2 Check the input against its policies; a gap goes to the owner.
<n>.3 <the work, one bounded step per id>
<n>.k Check the output against its policies.
<n>.k+1 **log** — <what this process records>; end.

## Output

- <what it produces>   ← must meet: <policy> §<n>
- Checked: at <n>.k, by <who>
- Documented: <where the check's result is recorded>

## Hands off to

<next process>, with <output>.
