---
tags:
  - ide
  - tooling
  - comparison
summary: "The main environments for building a MAS in 2026 and how they differ."
created: 2026-11-13
---

# Agentic IDEs and coding agents

Status as of 13 November 2026. Open-source figures from ([[S29 github2026meta|29]]).

| Tool | Type | Notable for MAS builders | Source |
|---|---|---|---|
| Claude Code | Terminal, IDE, desktop, web | Subagents, skills, hooks, MCP, plan mode, sandbox | ([[S10 cc_features\|10]]) |
| Codex | Terminal coding agent | AGENTS.md discovery chain from global to nested folders | ([[S58 codex_agentsmd\|58]]) |
| Gemini CLI | Terminal agent | Hierarchical `GEMINI.md` context files | ([[S32 gemini_md\|32]]) |
| Cursor | AI editor | Project rules in `.cursor/rules/*.mdc`; reads AGENTS.md | ([[S23 cursor_rules\|23]]) |
| VS Code with Copilot | Editor | Several agent harnesses in one editor; shared instruction files | ([[S52 vscode_instructions\|52]]) |
| Windsurf | AI editor | Cascade agent; location-scoped AGENTS.md | ([[S76 windsurf_agentsmd\|76]]) |
| Kiro | Spec-driven IDE and CLI | Specs (requirements, design, tasks), steering, hooks | ([[S43 kiro_docs\|43]]) |
| Google Antigravity | Agent-first platform | Manager surface to spawn and observe several agents | ([[S30 antigravity_blog\|30]]) |
| Zed | Editor | External agents through the Agent Client Protocol (ACP) | ([[S81 zed_agents\|81]]) |
| JetBrains Junie | IDE agent and CLI | Reads AGENTS.md and `.junie` guidelines | ([[S39 junie_docs\|39]]) |
| opencode, Cline, goose, OpenHands | Open-source agents | Active repositories | ([[S29 github2026meta\|29]]) |

**Trend (Interpretation).** IDEs are becoming control rooms for several agents: Antigravity's manager surface, Claude Code agent teams and Zed's external agents all expose multi-agent supervision ([[S30 antigravity_blog|30]], [[S13 cc_teams|13]], [[S81 zed_agents|81]]).

**Recommendation.** Choose by the harness features your project needs (subagents, hooks, sandbox), not by the editor. Keep instructions in [[AGENTS.md]] so the project survives a tool change. See [[Working method in an agentic IDE]].
