# claude-coach

Coaching for Claude Code, as two plugins in one marketplace:

| Plugin | For | Read |
|---|---|---|
| `coach` | Improving a single command from the corrections in a session | [plugins/coach](plugins/coach/README.md) |
| `devops-drillmaster` | A drill sergeant for your agile setup: objective, processes, policies, impediment logs, retrospectives | [plugins/devops-drillmaster](plugins/devops-drillmaster/README.md) |

## Installation

```
/plugin marketplace add Delkrak/claude-coach
/plugin install coach@claude-coach
/plugin install devops-drillmaster@claude-coach
```

Install either or both.

Removing the marketplace (`/plugin marketplace remove claude-coach`) also removes its plugins from a
project's `.claude/settings.json`; restore that file from git afterwards if the project enables them.
