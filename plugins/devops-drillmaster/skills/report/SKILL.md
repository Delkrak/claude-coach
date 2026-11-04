---
name: report
description: Build the project's process report - one HTML page with the objective, the flow, each work process's input → steps → output and each work policy's rules - from .drillmaster/process.md and the skills it names. Use when the owner asks for an overview of the process, and at the end of every setup and retrospective. Only in a project with .drillmaster/process.md.
---

# Report

One page of the whole process, built from what the skills say, never written by hand
← `POLICIES.md` §0.9. The script is `scripts/report.mjs` at the plugin root, two folders up from
this skill's base directory (Node, no dependencies).

**Arguments:** $ARGUMENTS, optional: where to write the page. With none, `process-overview.html` at
the project's root.

Every step has an id, cited as `/devops-drillmaster:report <id>` ← §0.8.

1.1 Run `node "<plugin root>/scripts/report.mjs" --project "<project dir>" [--out <file>]`.

1.2 If the project has a formatter that checks HTML (its CI runs it), format the page with it.

1.3 Tell the owner where the page is, in one line, e.g. "Status: report rebuilt —
    process-overview.html. Open it in a browser."
