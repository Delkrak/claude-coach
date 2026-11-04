# The trace's form

One trace per work item, entries oldest first, where the project's log storage says.

## attachment — `<key>-trace.json`, written only by `scripts/trace.mjs`

The file holds `key`, `version`, `head` (the seal over the chain and its length) and `entries`.
Every entry has what the tool stamps and checks:

- `at` — `DD-MM-YYYY HH:mm`, local time, from the clock; `iso` — the same moment in UTC.
- `process` — the work process as its command (`/build-process`); `step` — its step id (`3.5`).
- `kind` — one of the kinds below.
- `checksum` — FNV-1a over this entry, continuing from the one before it.

Each kind's own fields (`--<field> <value>`, or `--<field>=<value>` for a value starting with
`--`); anything else, and any blank value, is refused. Every entry carries evidence (§2.1): its
`link`, a start's `session`, or an impediment's `evidence`.

| kind | required | optional | what it records |
|---|---|---|---|
| start | `version`, `session`; `before` on a trace's first entry | `text`, `link` | a step starts: the skill version and the session |
| end | `link`; the tool counts `stepTime` from the step's start | `text` | a step ends |
| in, out | `text`, `link` | — | what a step took in or handed on |
| state | `from`, `to`, `link` | `text` | a tracker state move |
| decision | `text`, `by` (owner \| agent), `link`, then `words` (owner) or `why` (agent) | — | a choice and who made it |
| question | `text`, `state` (the issue's state), `link` | — | a question to the owner |
| answer | `words` (the owner's words), `link` | `text` | the owner's answer |
| impediment | `text`, `gap` (process \| policy \| not covered), `evidence`; `where` (skill and id) unless not covered | `--correction`, `link` | any friction |
| observation | `experiment` (E\<n\>), `seen` (yes \| no), `measure`, `link` | `text` | a running experiment's evidence |
| summary | `text` (the outcome), `link`; the tool counts `time`, `impediments`, `questions`, `corrections` over the run, and `uncounted` when the run began before the trace | — | a work process's process summary |

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
