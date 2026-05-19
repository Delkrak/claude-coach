## 20-05-2026
- Working well
  - Drafting directly from a rich $ARGUMENTS without friction
  - Correctly placing local commands in `.claude/commands/` vs coach plugin
- Not working
  - Step 2 asked fixed questions regardless of how much investment the user wants in the command
- Changed
  - Step 2: ask desired quality level first, then ask proportional questions (10+ for high quality, 2–3 for low) — user controls the investment upfront
- Preserved
  - Always ask, even when $ARGUMENTS contains a spec — treat arguments as starting point not complete answer

## 14-05-2026 22:00
- Created
  - Purpose: create a new coach command, initialize its history, and write it to the commands directory
  - Arguments: name of the command to create (e.g. `weekly-review`)
  - Elicits purpose, arguments, steps, and context before drafting
  - Writes history entry with original spec so future coach-command runs have ground truth of intent
