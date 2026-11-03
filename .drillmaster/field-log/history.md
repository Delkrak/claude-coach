## 01-11-2026 04:09
- Created
  - Purpose: note friction live while working, for the next review; never change a skill
  - Arguments: `note` or `wrap-up`
  - Note mode is cued by the UserPromptSubmit hook on correction-like messages
  - Wrap-up mode runs when a work item may be done; the done hook asks and the agent decides whether it actually is
  - It does not make sense to change anything before a work item is done
