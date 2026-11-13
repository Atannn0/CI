---
tags:
  - harness
summary: "A checklist of what a harness contains, mapped to this vault."
created: 2026-11-13
---

# Harness components

Named by LangChain ([[S68 trivedy2026harness|68]]):

| Component | Purpose | Vault note |
|---|---|---|
| System prompts | Role and rules | [[Instruction files overview]] |
| Tools, skills, MCPs and their descriptions | Capabilities | [[MCP]], [[SKILL.md]] |
| Filesystem | Durable workspace, context offloading, coordination between agents | [[Long-running harness patterns]] |
| Bash and code execution | General-purpose tool; agents write their own tools | [[Sandboxing]] |
| Sandboxes | Safe, isolated execution with verification tools | [[Sandboxing]] |
| Memory and search | Stored knowledge such as AGENTS.md, plus web search | [[AGENTS.md]] |
| Orchestration logic | Subagent spawning, handoffs, model routing | [[Subagents]] |
| Hooks and middleware | Deterministic steps such as compaction and lint checks | [[Hooks and deterministic control]] |

The same list appears in Claude Code as extension points: CLAUDE.md, skills, MCP, subagents, hooks, plugins ([[S10 cc_features|10]]).

**Agent-computer interface (ACI).** Tool definitions deserve as much prompt-engineering attention as prompts; error-proof the arguments (poka-yoke), for example by requiring absolute file paths ([[S19 anthropic2024agents|19]]).
