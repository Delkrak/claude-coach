## Steps
### 1. Determine the command name
If $ARGUMENTS provides a name, use it (lowercase, hyphenated, e.g. `my-command`).
Otherwise, ask what the command should be called.
### 2. Gather the specification
First ask: *"How thorough should this command be?"* — the answer calibrates everything that follows. A high-quality command warrants deep questioning (10+ questions covering purpose, arguments, steps, context, success criteria, anti-patterns, edge cases, typical situations, failure modes). A low-quality or one-off command warrants just enough to produce a working draft (2–3 questions). Ask questions one at a time or in small grouped batches until the spec meets that standard — do not proceed to drafting until it does.
### 3. Draft the command
Structure the draft as:

```
<One-line description of what the command does.>

**Arguments:** $ARGUMENTS (<what arguments represent, or omit the Arguments line entirely if none>)

## Steps

### 1. ...
### 2. ...
...

### N. Confirm
<Brief closing step — confirm output, summarize what was done, or prompt next action.>
```

Good commands:
- State clearly what task is being performed
- Break work into numbered steps with `### N.` headers
- Reference specific files or locations where relevant
- Use `$ARGUMENTS` to accept user input when needed
- Are self-contained — all context a fresh reader needs is in the file
### 4. Show the draft and confirm
Present the full draft. Wait for approval or changes before writing anything.
Apply any changes the user requests, then confirm again.
### 5. Write the command file
Write the final content to `commands/<name>.md`.
### 6. Initialize history
Write `.coach/<name>/history.md` (create folders if needed) with a creation entry:

```
## <DD-MM-YYYY HH:mm>
- Created
  - <the purpose the user described, verbatim or close to it>
  - Arguments: <what $ARGUMENTS represents, or "none">
  - <any key constraints, context, or patterns the user mentioned>
```

This entry is the ground truth of original intent. Future `coach-command` runs will read it to avoid drifting from what the command was built to do.
### 7. Confirm
Tell the user the command is ready and can be invoked as `/coach:<name>`.