# coach

A coach for your Claude Code commands: it captures corrections from a session and applies them back
to the command.

```
/plugin install coach@claude-coach
```

## `/coach:coach-command <command-name>`

Reviews the current session for corrections and applies them to a target command. With no name, it
infers the last command run and asks for confirmation.

1. Reads the target command file.
2. Checks its correction history in `.coach/<name>/history.md`.
3. Extracts corrections from the session: what Claude got wrong and what you wanted instead.
4. Presents the full list before touching anything.
5. Applies changes one at a time with confirmation.
6. Appends a structured entry to the history file.

History accumulates across sessions, so future runs inherit not just the rules but the reasoning
behind them.

## `/coach:create-command <name>`

Creates a new command: asks how thorough it should be, gathers the spec, shows the draft, writes it,
and starts its history with the original intent.

For setting up a whole way of working (processes, policies, logs, reviews), see
[devops-drillmaster](../devops-drillmaster/README.md).
