---
tags:
  - instructions
  - comparison
summary: "Which tool reads which file, where it lives and how it loads."
created: 2026-11-13
---

# Instruction files overview

Status as of 13 November 2026.

| File | Read by | Scope and loading | Source |
|---|---|---|---|
| `AGENTS.md` | Codex, Copilot, Cursor, Windsurf, Junie and others | Root and nested folders; plain Markdown | ([[S03 agentsmd\|3]], [[S52 vscode_instructions\|52]], [[S23 cursor_rules\|23]], [[S76 windsurf_agentsmd\|76]], [[S39 junie_docs\|39]]) |
| `CLAUDE.md` | Claude Code; also read by Cursor | Managed, user, project, local; concatenated | ([[S11 cc_memory\|11]], [[S23 cursor_rules\|23]]) |
| `GEMINI.md` | Gemini CLI | Global `~/.gemini/GEMINI.md` plus workspace files, concatenated | ([[S32 gemini_md\|32]]) |
| `.cursor/rules/*.mdc` | Cursor | Frontmatter: `description`, `globs`, `alwaysApply` | ([[S23 cursor_rules\|23]]) |
| `.github/copilot-instructions.md` | Copilot | Repository-wide | ([[S52 vscode_instructions\|52]]) |
| `.claude/rules/*.md` | Claude Code | Optional `paths` frontmatter for path scoping | ([[S11 cc_memory\|11]]) |
| Kiro steering files | Kiro | Project standards | ([[S43 kiro_docs\|43]]) |
| `SKILL.md` | Tools supporting Agent Skills | Loaded on demand | ([[S02 agentskills\|2]]) |
| `.claude/agents/*.md` | Claude Code | Subagent definitions | ([[S09 cc_subagents\|9]]) |

**Shared limits**
- These files are context, not enforcement ([[S11 cc_memory|11]]).
- They cost tokens on every request, so they must stay short ([[S10 cc_features|10]]).

Details: [[AGENTS.md]], [[CLAUDE.md]], [[Other instruction files]], [[SKILL.md]]. Templates: [[Template - AGENTS.md]], [[Template - CLAUDE.md]], [[Template - subagent file]].
