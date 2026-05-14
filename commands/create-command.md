Create a new coach command, initialize its history, and write it to the commands directory.

**Arguments:** $ARGUMENTS (name of the command to create, e.g. `weekly-review`)

## Steps

### 1. Determine the command name
If $ARGUMENTS provides a name, use it (lowercase, hyphenated, e.g. `my-command`).
Otherwise, ask what the command should be called.

### 2. Gather the specification
Ask the user to describe:
- **Purpose** — one sentence: what does this command do?
- **Arguments** — what does `$ARGUMENTS` represent, if anything? (e.g. a name, a target, a mode)
- **Steps** — what should Claude do, in order? Ask for as much detail as the user can give; you will structure it.
- **Context** — any specific files, locations, or patterns the command should reference?

Wait for the user's full answer before proceeding.

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
