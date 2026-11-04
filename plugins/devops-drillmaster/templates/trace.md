## Trace — <work item id>

One trace per work item, `<key>-trace.json`, written only by `scripts/trace.mjs` (never by hand):
attached to the issue, or where the project's log storage says. Entries are oldest first. Every
entry has what the tool stamps and checks:

- `at` — `DD-MM-YYYY HH:mm`, local time, from the clock; `iso` — the same moment in UTC.
- `process` — the work process as its command (`/build-process`); `step` — its step id (`3.5`).
- `kind` — one of the kinds below; `checksum` — the XOR chain over every entry before it.
- `text` — what happened; `link` — evidence the tracker, git host or session already holds.

Each kind's own fields (`--<field> <value>` on the command line):

| kind | fields | what it records |
|---|---|---|
| start | `version`, `session` | a work process starts: its skill version and the session |
| end | — (the tool counts `time` from the start) | a work process ends |
| in, out | `text`, `link` | what a step took in or handed on |
| state | `from`, `to` | a tracker state move |
| decision | `text`, `by` (owner \| agent), `words` (owner) or `why` (agent) | a choice and who made it |
| question | `text`, `state` (the issue's state), `link` | a question to the owner |
| answer | `words` (the owner's words), `link` | the owner's answer |
| impediment | `text`, `gap` (process \| policy \| not covered), `where` (skill and id), `evidence`, `--correction` when the owner corrected Claude | any friction |
| observation | `experiment` (E\<n\>), `seen` (yes \| no), `measure` | a running experiment's evidence |
| summary | `text` (the outcome); the tool counts `time`, `impediments`, `questions`, `corrections` | a work process's process summary |
