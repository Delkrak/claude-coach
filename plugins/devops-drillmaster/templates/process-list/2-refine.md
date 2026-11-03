---
name: refine-process
description: Turn a captured issue into a work-ready one - specced against the code, decisions and consequences settled with the owner, approved, with a start-work brief. Use when the owner asks to refine, split or rewrite an issue.
---

# 2. Refine — Standard

An AI agent process. It serves the objective's measure **<measure>**.

## Input

- A captured issue   ← must meet: `issue-policy` §2 (captured)
- Checked: at 2.2, by the agent
- Documented: the field log

## Actions

2.1 **log** — start.
2.2 Check the input against its policy; a gap goes to the owner.
2.3 Read the docs and the code the issue touches; every claim about today's behaviour names its files.
2.4 Ask the owner every decision the code can't answer, one per question, recorded on the issue.
2.5 Ask the owner about consequences that aren't obvious: what users will notice, data that can be
    lost, blast radius, overlaps, what gets harder later.
2.6 Write the spec; split work too big for one PR into sub-issues.
2.7 Check the spec against `issue-policy` §3 (work-ready), and the planned change against the code
    policies it will have to meet.
2.8 On the owner's approval, write the start-work brief into the issue and move it to ready.
2.9 **log** — decisions, questions, consequences; end.

## Output

- A work-ready issue with its start-work brief   ← must meet: `issue-policy` §3 (work-ready)
- Checked: at 2.7, by the agent; approved by the owner at 2.8
- Documented: the field log; the approval on the issue

## Hands off to

Build (3), with the work-ready issue.
