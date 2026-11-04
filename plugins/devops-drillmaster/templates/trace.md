## Trace — <work item id>

One running trace per work item: on the issue until the PR opens, then copied to the PR and appended
there (or in `.drillmaster/items/<id>/trace.md`). One line per entry, newest last. Each entry names
the work process step by its id and links what the tracker, git host or session already holds.

- <DD-MM-YYYY HH:mm> · <work process> <step id> · start · <skill> v<N> · session <id>
- <DD-MM-YYYY HH:mm> · <work process> <step id> · in | out · <what> · <link>
- <DD-MM-YYYY HH:mm> · <work process> <step id> · state · <from> → <to>
- <DD-MM-YYYY HH:mm> · <work process> <step id> · decision · <what> · by <owner: "words" | agent: why>
- <DD-MM-YYYY HH:mm> · <work process> <step id> · question · <what> · issue in <state> · <link>
- <DD-MM-YYYY HH:mm> · <work process> <step id> · answer · "<the owner's words>" · <link>
- <DD-MM-YYYY HH:mm> · <work process> <step id> · impediment · <what happened>
  · gap: process (<work process> <step id>) | policy (<work policy> <rule id>, or missing) | not covered
  · evidence: <link, or session id and the owner's words quoted>
- <DD-MM-YYYY HH:mm> · <work process> <step id> · observation · E<n> · impediment seen | not seen
  · measure <value>
- <DD-MM-YYYY HH:mm> · <work process> <step id> · end · <h:mm>
- <DD-MM-YYYY HH:mm> · <work process> <step id> · summary · <outcome> · time <h:mm>
  · impediments <n> · questions <n> · corrections <n>
