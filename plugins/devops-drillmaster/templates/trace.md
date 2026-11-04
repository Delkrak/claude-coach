# The trace's form

One trace per work item, entries oldest first, where the project's log storage says.

## attachment — `<key>-trace.json`, written only by `scripts/trace.mjs`

The file holds `key`, `version`, `count`, `head` (the last entry's checksum) and `entries`. Every
entry has what the tool stamps and checks:

- `at` — `DD-MM-YYYY HH:mm`, local time, from the clock; `iso` — the same moment in UTC.
- `process` — the work process as its command (`/build-process`); `step` — its step id (`3.5`).
- `kind` — one of the kinds below.
- `checksum` — FNV-1a over this entry, continuing from the one before it.

Each kind's own fields (`--<field> <value>` on the command line); anything else is refused:

| kind | required | optional | what it records |
|---|---|---|---|
| start | `version`, `session`; `before` on a trace's first entry | `text`, `link` | a step starts: the skill version and the session |
| end | — (the tool counts `time` over the run) | `text`, `link` | a step ends |
| in, out | `text`, `link` | — | what a step took in or handed on |
| state | `from`, `to` | `text`, `link` | a tracker state move |
| decision | `text`, `by` (owner \| agent), then `words` (owner) or `why` (agent) | `link` | a choice and who made it |
| question | `text`, `state` (the issue's state), `link` | — | a question to the owner |
| answer | `words` (the owner's words), `link` | `text` | the owner's answer |
| impediment | `text`, `gap` (process \| policy \| not covered), `evidence`; `where` (skill and id) unless not covered | `--correction`, `link` | any friction |
| observation | `experiment` (E\<n\>), `seen` (yes \| no), `measure` | `text`, `link` | a running experiment's evidence |
| summary | `text` (the outcome); the tool counts `time`, `impediments`, `questions`, `corrections` | `link` | a work process's process summary |

## comments and items — one line per entry

A running comment titled `Trace — <work item id>` (comments), or `trace.md` (items):

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
