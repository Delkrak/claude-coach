# <Project>'s process

The drill master's index. The objective is `.drillmaster/objective.md`; the story is in the entry
skill (if the owner chose one).

Priority: <Light / Standard / Full>, owner experience: <…>
Step model: <evidence + experiment / measure-driven ladder / owner decides>, N = <items>
Log storage: <comments (issue, then PR) | drills (`.drillmaster/drills/<id>/`)>

# Processes, in order

## <n>. <process> — <adopted | scaffolded>
- Skill: .claude/skills/<name>/SKILL.md
- Serves: <measure in objective.md>
- Input: <what> ← <policy> §<n>
- Output: <what> ← <policy> §<n>
- States: <from → to>, moved by <process | tool automation>
- Hands off to: <next process>
- Done hints: <tool calls that often end it>

# Policies

## <policy> — <adopted | scaffolded>
- Skill: .claude/skills/<name>/SKILL.md
- Governs: <which outputs (and the inputs they become)>
- Cited by: <process> input | output
