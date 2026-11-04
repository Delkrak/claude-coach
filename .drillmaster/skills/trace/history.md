## v2 — 04-11-2026 21:28
- Changed
  - New log storage **attachment**: a `<key>-trace.json` attached to the issue — Keeper retrospective 04-11-2026 (Delkrak/Keeper#52), C1; the owner: "as a attachement to linear issue, the key.."
  - With attachment, every entry is written by `scripts/trace.mjs` — the owner: "We definitely need a tool to create the trace as json, it should have a simple xor based tamper protection."
  - The tool stamps each entry from the clock — Keeper traces held estimated times shown as read; the owner: "so you are effectively cooking the books."
  - The tool chains an FNV-1a checksum — the owner: "FNV-1a (Recommended)", after the review found the plain XOR fold missed paired edits
  - The tool counts end and summary over the work process's whole run — Keeper summaries were counted by hand, once wrongly
  - Step 1.11 uploads the file through the tracker's connector and unlinks the old one — the owner: "Agent via connector (Recommended)"
  - The trace begins at the issue, its first entry saying what came before — the owner: "Start the trace at the issue, but it should naturally be in the log that its missing before."
  - Git Bash needs `MSYS_NO_PATHCONV=1` — it rewrites `/build-process` into a Windows path (local review, Delkrak/claude-coach#7)
  - The template gives the JSON form beside the line form — comments and items still write lines
- Preserved
  - The kinds of entry — the tool checks the same kinds
  - The gap classes — unchanged by the tool
  - Comments and items storage — the owner: "make it up to the project how it does this"
  - The item summary — still a PR comment

## 04-11-2026 20:00
- Changed
  - Renamed impediment-and-metric-capture to trace; it traces every step, not only friction and metrics — "We need to gather enough information to trace the entire process, not only friction and metrics, but also other relevant information"
  - Entries: start and end, in and out (linked, never copied), state, decision, question and answer, impediment, observation, summary
  - Measures are counted from the trace instead of named up front per work process
  - Experiment observations are trace entries; the retrospective moves them into experiments.md (no write to experiments.md on a work item's branch)
- Preserved
  - Log storage modes, item summary, gap classes

## 04-11-2026 01:30
- Changed
  - Renamed impediment-log to impediment-and-metric-capture — concept.md's term; "capture is a bad skill name", it collided with the capture work process
  - Impediments are any friction; no closed list of kinds — "impediment also includes any kind of friction"
  - Metrics recorded as each work process's specification names — "The metrics are defined on a process level and corrected on retrospective"
  - Item summary folded in from the removed summary process; no tracker-time cross-check — "No need to mention tracker timings"
  - Report lines in the drill-sergeant voice, with an example
- Preserved
  - Log storage: comments on issue then PR, or items/

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
