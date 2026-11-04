## 04-11-2026 21:28
- Changed
  - The overview names no tracker or state of its own — it told every project that Linear's automation moves AI Review, Review and Done (local review of Delkrak/Keeper#52)
  - The parser ends a citation at ";" — step text after a mid-step citation was lost into its citations (Keeper's `/user-pr-review-process` 5.4)
  - The parser reads ", or →" as an alternative state — it showed "Done , or" as a state (Keeper's `/user-pr-review-process`)
- Preserved
  - The page's sections — no change asked for
  - process.md as its only index — the skills still name it

## 04-11-2026 20:14
- Created
  - Purpose: one HTML page of a project's process, built from process.md and the skills it names — "The report generation should also be included with drillmaster"
  - The generator built by hand for Keeper's setup, made generic; setup, retrospective and process-change rebuild it
  - Named process-overview, not report — "call it process-overview instead of report"
