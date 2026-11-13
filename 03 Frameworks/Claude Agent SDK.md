---
tags:
  - framework
  - harness
summary: "Claude Code's tools, loop and context management as a library."
created: 2026-11-13
---

# Claude Agent SDK

- Gives "the same tools, agent loop, and context management that power Claude Code", programmable in Python and TypeScript ([[S05 cc_agentsdk|5]]).
- Capabilities: built-in tools, hooks, subagents, MCP, permissions, sessions, skills, plugins ([[S05 cc_agentsdk|5]]).
- Alternatives from the same vendor: the Client SDK (you write the tool loop) and Managed Agents (Anthropic hosts the harness) ([[S05 cc_agentsdk|5]]).
- Unless previously approved by Anthropic, third-party products must use API-key authentication, not claude.ai login ([[S05 cc_agentsdk|5]]).

**Interpretation.** This is a harness you import, not a graph you draw. See [[What is a harness]], [[Subagents]].
