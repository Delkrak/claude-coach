# Suggested steps

The drill master's catalog of the full DevOps loop. `setup` offers it (3.2, 5.1, 5.4–5.6): each
stage with what it is for, when it is likely relevant, what it produces, where its field log goes,
and who usually moves its tracker states. The owner keeps, changes or drops each; what is chosen is
written to `.drillmaster/process.md`.

Field log storage, for every stage, is one of:
- **comments**: one running comment on the issue, copied to the PR when it opens (the default);
- **drills**: files in the repository, `.drillmaster/drills/<work item id>/field-log.md` and
  `debrief.md`.

| Stage | Priority | For | Likely relevant when | Produces (template) | Field log | Debrief | States, usually moved by | Done hints |
|---|---|---|---|---|---|---|---|---|
| Capture | Light | an idea becomes an item in the tracker | always | issue (—) | owner's words, what was missing | — | → backlog: process | tracker save tool |
| Refine | Standard | an item becomes specced and approved | work needs decisions before building | issue spec, start-work brief (`start-work-brief.md`) | decisions, questions to the owner, consequences, time | — | backlog → specced → ready: process (ready only on the owner's approval) | tracker save tool |
| Build | Light | a ready item becomes a PR | always | draft PR | development friction, noticed items (→ new items), time | — | ready → in progress: process; → in review: git automation if configured | `gh pr create` |
| AI review | Standard | the PR is reviewed by AI against the policies before the owner sees it | the AI vendor or CI offers review | review rounds on the PR | each round: findings, fixes or answers, time | — | stays in review state: — | `gh pr ready` |
| Debrief | Light | the item's field log becomes its summary on the PR | always | debrief (`debrief.md`) | — | what happened, friction, missing info, time per stage | — | `gh pr ready` |
| User review | Light | the owner reviews and merges, or sends it back | always | review comments | owner's feedback, rework rounds | updated after merge | in review → done: git automation if configured, else process | `gh pr merge` |
| Release/deploy | Full | what merged reaches users | there is a deploy step beyond merge (preview or production environments, releases) | release notes | what shipped, deploy problems | — | done → released: release automation if configured | deploy command |
| Operate/monitor | Full | the running system is watched | there are users or uptime to protect | incident issues | incidents, where they came from | — | new incident → capture: process | — |
| After-action review | Light | the process improves from evidence | always | after-action report (`after-action-report.md`), experiments | — | — | — | — |

Rows the owner's priority leaves out are not shown during setup; they come back if a stage is added
later.
