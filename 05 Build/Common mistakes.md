---
tags:
  - build
  - pitfalls
summary: "Frequent errors in student and production MAS, each with its documented fix."
created: 2026-11-13
---

# Common mistakes

| Mistake | Fix | Source |
|---|---|---|
| Building a MAS for a sequential task | Use one agent | ([[S42 kim2026blog\|42]]) |
| Vague delegation | Brief with objective, format, tools, boundaries | ([[S38 hadfield2025multiagent\|38]]) |
| The worker grades its own work | Separate evaluator in a fresh context | ([[S64 rajasekaran2026harness\|64]]) |
| One giant instruction file | Short map plus linked docs | ([[S48 lopopolo2026harness\|48]]) |
| Over-long CLAUDE.md; rules get lost | Prune; convert must-haves to hooks | ([[S07 cc_best\|7]]) |
| Too many overlapping tools | Minimal viable tool set | ([[S65 rajasekaran2025context\|65]]) |
| No way for the agent to verify | Give it a test, build or screenshot to check | ([[S07 cc_best\|7]]) |
| Unscoped "investigate" requests fill the context | Scope narrowly or delegate to subagents | ([[S07 cc_best\|7]]) |
| Correcting the same error repeatedly | After two failed corrections, clear and restart with a better prompt | ([[S07 cc_best\|7]]) |
| No evals until late | Start with 20-50 tasks from real failures | ([[S36 grace2026evals\|36]]) |
| Unbounded loops | Step limit and budget | ([[S70 aisdk_agents\|70]]) |
| Trusting unknown MCP servers | Write your own or use trusted providers | ([[S15 cc_security\|15]]) |
