## v1 — 29-06-2026 23:53
- Working well
  - Single-item delta presented clearly with current-vs-wanted framing before any edit
  - Recognised the target lives in the coach plugin and flagged the version-bump workflow up front
- Not working
  - Command stored a prose change-log but no recoverable copy of the command at each revision — couldn't see or diff past command text
- Changed
  - Added Step 5 "Snapshot the command version" — writes full final command text to `.coach/<name>/versions/v<N>.md` after approved edits
  - Renumbered write-history to Step 6; entry header now `## v<N> — <DD-MM-YYYY HH:mm>` so each log entry names its snapshot
  - Defined the no-change case: skip snapshot, omit version from header
- Preserved
  - Change-log format and section order (Working well / Not working first) — settled over prior tunings
  - `.coach/<name>/history.md` location and the full-list + confirm-each-change flow
- Note
  - v1 is the first snapshot; the two pre-existing entries below predate versioning

## 14-05-2026 20:50
- Working well
  - Inferring the target command and confirming when ambiguous
  - Presenting the full correction list before applying anything
  - Confirm-before-each-change flow
- Not working
  - When user approved but added a new format spec, Claude started applying immediately — took four iterations to land on the correct format
- Changed
  - Step 4 — added rule: if user modifies or extends a proposed change, restate the full target spec and confirm before applying; do not begin iterating
- Preserved
  - Full list presented before any changes — confirmed effective
  - Confirm-before-each-change flow — core to the meta-learning purpose

## 14-05-2026 05:35
- Working well
  - Correction-capture approach — user engaged with it immediately and ran it on itself
  - Presenting the full list before applying anything
  - Confirm-before-each-change flow
- Not working
  - Flat bold-prefix bullet format in history template — hard to scan
  - "Working well" and "Not working" ordered after "Changed" and "Preserved" — wrong priority
  - Multiple ideas grouped under one bullet — obscures individual items
  - Date format missing time and using wrong locale
- Changed
  - History template format — flat bold bullets → multi-level bullet list
  - Section order — Changed/Preserved first → Working well/Not working first
  - Date format — `## <date>` → `## <DD-MM-YYYY HH:mm>`
  - Command name — `tune-last-command` → `tune-command`
- Preserved
  - Full list presented before any changes applied — prevents premature edits
  - Confirm-before-each-change flow — core to the meta-learning purpose
  - History file location at `.coach/<name>/history.md` — keeps it out of command namespace
