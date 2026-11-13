---
tags:
  - instructions
  - template
summary: "A starter CLAUDE.md that imports AGENTS.md. Recommendation."
created: 2026-11-13
---

# Template: CLAUDE.md

**Recommendation.** The import line is the documented way to share instructions with tools that read AGENTS.md ([[S11 cc_memory|11]]).

```markdown
@AGENTS.md

## Claude Code
- Use plan mode for changes that touch more than one agent role.
- Delegate source collection to subagents; keep the main conversation for synthesis.
- When compacting, preserve the list of modified files and the test command.
```

Keep it under 200 lines ([[S11 cc_memory|11]]). See [[CLAUDE.md]].
