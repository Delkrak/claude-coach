## 03-11-2026 23:40
- Changed
  - Renamed field-log to impediment-log — the owner's framing: "a drill sargent gets hired for an agile setup, so the communication style is military, but the terms are agile"
  - Every process closes with a process summary; the PR debrief became the item summary built from them — "we need one for each process as well"
  - Repo storage folder drills/ became items/

## v1 — 03-11-2026 22:42
- Not working
  - Friction notes were files in the repository, and covered only the owner's corrections
- Changed
  - Renamed from coach-note-friction to field-log — the owner asked for a military term
  - Logs live on the issue, then the PR, where the project's log storage says — "the friction and task notes should go into the PR as artifacts, so it don't clutter up the repo and don't require the chat history"
  - Four kinds: owner correction, development friction, missing information, time — "it should log multiple kinds of friction -- user friction being one of them"
  - Every process step begins and ends with a logging step — "each step in the process should include a logging step"
  - Wrap-up mode became the PR debrief — "we need to fit in a debrief stage for the PR"
- Preserved
  - It never changes a skill

## 01-11-2026 04:09
- Created
  - Purpose: note friction live while working, for the next review; never change a skill
  - Arguments: `note` or `wrap-up`
  - Note mode is cued by the UserPromptSubmit hook on correction-like messages
  - Wrap-up mode runs when a work item may be done; the done hook asks and the agent decides whether it actually is
  - It does not make sense to change anything before a work item is done
