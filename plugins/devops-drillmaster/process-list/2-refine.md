---
name: refine-process
description: Turn a captured issue into a work-ready one - specced against the code, decisions and consequences settled with the owner, approved, with a start-work brief. Use when the owner asks to refine, split or rewrite an issue.
---

# 2. Refine — Standard

A work process. It serves the objective's measure **<measure>**.

## Input

- An issue in the backlog   ← must meet: `issue-policy` §2 (captured)
- Checked: at 2.2, by the agent
- Documented: the capture

## Records

- Impediments: at every step, through `capture`.
- Metrics: questions asked of the owner, at 2.4–2.5; time taken, at 2.9.

## Steps

2.1 **capture** — start.
2.2 Check the input against each rule its work policies set. On a miss: stop, and report the work
    policy and rule it fails ("issue work policy 2.2").
2.3 Read the docs and the code the issue touches.
2.4 Ask the owner every decision the code can't answer, one per question, recorded on the issue.
2.5 Ask the owner about consequences that aren't obvious: what users will notice, data that can be
    lost, blast radius, overlaps, what gets harder later.
2.6 Write the spec; split work too big for one PR into sub-issues.
2.7 Check the spec against each rule of `issue-policy` §3 (work-ready), and the planned change
    against the code work policies it will have to meet.
2.8 On the owner's approval, write the start-work brief into the issue and move it to ready.
2.9 **capture** — process summary: the spec, impediments, questions asked, time taken; end.

## Output

- A work-ready issue with its start-work brief   ← must meet: `issue-policy` §3 (work-ready)
- Checked: at 2.7, by the agent; approved by the owner at 2.8
- Documented: the capture; the approval on the issue

## Hands off to

Build (3), with the work-ready issue.
