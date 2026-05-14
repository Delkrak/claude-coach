Review this session for user corrections and apply them to the target command, preserving what worked.

**Arguments:** $ARGUMENTS (name of the command to improve, e.g. `acim`)

## Steps

### 1. Identify the command
If $ARGUMENTS names a command, use that.
Otherwise, infer the last command run in this session and ask: *"I'll tune `<name>` — is that the one?"*
If nothing can be inferred, ask the user directly.

Read `.claude/commands/<name>.md` once confirmed.

### 2. Check history
Read `.coach/<name>/history.md` if it exists. Note any recurring corrections (patterns that keep coming up) and what has been deliberately preserved — so those decisions are not revisited without reason.

### 3. Extract the delta from this session
Scan the conversation for moments where the user redirected, corrected, or asked for something different from what Claude produced. For each correction:
- **What Claude did** — the output or behaviour that prompted the correction
- **What the user wanted** — exactly what they asked for instead
- **Solution direction** — one line on how to address it in the command

Also note anything that worked well and should be made explicit or protected — so improvements don't accidentally remove what's already right.

Present the full list (corrections + what to preserve) before touching anything.

### 4. Confirm and apply one at a time
For each correction, in order:
- State the proposed change and wait for approval
- On clean approval: apply it immediately, then move to the next
- On rejection or modification: restate the full target spec in one line and confirm before applying — do not begin iterating
- On rejection: note it and move on

### 5. Write history and confirm
Append an entry to `.coach/<name>/history.md` (create file and folders if needed) using this format:

```
## <DD-MM-YYYY HH:mm>
- Working well
  - <one specific thing the user confirmed or accepted without correction>
  - <another>
- Not working
  - <one specific thing that caused friction or required correction>
  - <another>
- Changed
  - <one specific change> — <reason>
  - <another>
- Preserved
  - <one specific thing deliberately left untouched> — <reason if non-obvious>
```

One bullet per idea. Confirm to the user what changed and what was left untouched.
