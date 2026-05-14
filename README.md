# claude-coach

A coach for your Claude Code workflow.

claude-coach is a Claude Code plugin that helps your commands and skills improve over time — capturing corrections from each session and applying them back to the source.

## Installation

Add the marketplace and install the plugin:

```
/plugin install github@delkrak/claude-coach
```

Then install the `coach` plugin from the marketplace.

## Commands

### `/coach:coach-command`

Reviews the current session for corrections and applies them to a target command.

**Usage:** `/coach:coach-command <command-name>`

If no command name is given, it infers the last command run and asks for confirmation.

**What it does:**
1. Reads the target command file
2. Checks its correction history in `.coach/<name>/history.md`
3. Extracts corrections from the session — what Claude got wrong and what the user wanted instead
4. Presents the full list before touching anything
5. Applies changes one at a time with confirmation
6. Appends a structured entry to the history file

History accumulates across sessions, so future runs inherit not just the rules but the reasoning behind them.
