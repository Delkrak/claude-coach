---
name: process-change
description: Make one change to a work process or work policy that a retrospective decided and the owner approved - edit the skill, snapshot it, append its history and open an experiment with the measure's baseline. The only way a work process or work policy changes. Use when a retrospective hands over an approved change, or the owner orders one.
---

# Process change

Carries out a change a retrospective decided ← `POLICIES.md` §1.1. It decides nothing: every change
it makes was approved by the owner ← §1.3.

`POLICIES.md` is at the plugin root, two folders up from this skill's base directory. Read `POLICIES.md` first; each step names the rule it applies.

**Arguments:** $ARGUMENTS: the change, its retrospective report, the impediment it removes, the
measure it must not worsen and that measure's baseline. A change ordered by the owner outside a
retrospective names its impediment and measure the same way.

Every step has an id, cited as `/devops-drillmaster:process-change <id>` ← §0.8.

## 1. Check the change

1.1 Check the change names its impediment, its measure, the measure's baseline and the owner's
    approval. On a miss: stop, and report what is missing ← §1.3.

1.2 Read the skill and its `.drillmaster/skills/<skill>/history.md`. Stop if the change reopens a decision
    the history records as preserved or rejected without new evidence ← §5.2.

## 2. Make the change

2.1 Edit the skill. A work policy rule follows §0; a new step or rule gets a new id, and a removed
    one's id is never reused ← §0.8.

2.2 Save the changed skill's full text to `.drillmaster/skills/<skill>/versions/v<N>.md` ← §1.6.

2.3 Append the history entry in the form of §4.5, naming `v<N>`, the retrospective and the change
    ← §1.6.

2.4 Open the experiment in `.drillmaster/experiments.md` in the form of §4.5: its impediment, its
    measure and the baseline ← §1.7.

2.5 If the change makes `process.md` no longer match (an input, output, citation or what a work
    process records), update `process.md` in the same change, and rebuild the report with
    `/devops-drillmaster:report`.

## 3. Report

3.1 Report to the owner in one line ← §6.5, e.g. "Status: build-process v3 live, E5 running on
    corrections per item, baseline 1.4. Move!"
