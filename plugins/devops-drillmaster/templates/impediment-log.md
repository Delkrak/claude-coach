## Impediment log — <work item id>

One running log per work item. On the issue during capture and refinement; copied to the PR when
the draft opens, and appended there (or in `.drillmaster/items/<id>/impediment-log.md`). Newest
last. Each entry names the process step by its id; each process closes with its summary.

- <DD-MM-YYYY HH:mm> · <process> <step id> · time · started
- <DD-MM-YYYY HH:mm> · <process> <step id> · owner correction · <what Claude did> → "<owner's words>"
  · gap: process (<process> <step id>) | policy (<policy> §<n>, or missing) | not covered
  · evidence: <link or session id>
- <DD-MM-YYYY HH:mm> · <process> <step id> · development friction · <what was redone, retried or
  stuck> · gap: … · evidence: …
- <DD-MM-YYYY HH:mm> · <process> <step id> · missing information · <what was needed, where it should
  have been> · gap: … · evidence: …
- <DD-MM-YYYY HH:mm> · <process> <step id> · process summary · <outcome> · impediments: <n by kind>
  · time: <h:mm>
