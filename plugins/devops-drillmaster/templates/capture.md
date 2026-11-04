## Capture — <work item id>

One running capture per work item. On the issue during capture and refinement; copied to the PR
when the draft opens, and appended there (or in `.drillmaster/items/<id>/capture.md`). Newest last.
Each entry names the work process step by its id; each work process closes with its summary.

- <DD-MM-YYYY HH:mm> · <work process> <step id> · started
- <DD-MM-YYYY HH:mm> · <work process> <step id> · impediment · <what happened>
  · gap: process (<work process> <step id>) | policy (<work policy> <rule id>, or missing) | not covered
  · evidence: <link, or session id and the owner's words quoted>
- <DD-MM-YYYY HH:mm> · <work process> <step id> · metric · <name>: <value> · evidence: <link>
- <DD-MM-YYYY HH:mm> · <work process> <step id> · process summary · <outcome>
  · impediments: <n> · <metric>: <value> · …
