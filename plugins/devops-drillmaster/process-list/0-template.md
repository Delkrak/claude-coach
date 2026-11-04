---
name: <work process name>
description: <What it turns into what, e.g. "Turn a work-ready issue into a draft PR">. Use when <trigger: what the owner says, or what state the work is in>.
---

# <n>. <Work process> — <Light | Standard | Full>

A work process. It serves the objective's measure **<measure>** (`.drillmaster/objective.md`).
Each step is cited as `<work process> <n>.<k>`; a cited id never changes (drill master POLICIES
§0.8).

## Input

- <what it needs: the previous work process's output, quoted>   ← must meet: <work policy> <rule ids>
- Checked: at <n>.2, by <who>
- Documented: the capture

## Records

- Impediments: at every step, through `capture`.
- Metrics: <metric> at <step id>, … — what the objective's measures need.

## Steps

<n>.1 **capture** — start.
<n>.2 Check the input against each rule its work policies set. On a miss: stop, and report the work
      policy and rule it fails ("issue work policy 2.3").
<n>.3 <the work, one bounded step per id>
<n>.k Check the output against each rule its work policies set.
<n>.k+1 **capture** — process summary: outcome, impediments, the metrics above; end.

## Output

- <what it produces>   ← must meet: <work policy> <rule ids>
- Checked: at <n>.k, by <who>
- Documented: <where the check's result is recorded>

## Hands off to

<next work process>, with <output>.
