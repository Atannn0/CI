---
tags:
  - security
summary: "Give each agent the smallest set of tools and rights that its role needs."
created: 2026-11-13
---

# Least privilege and permissions

- Limit which tools a subagent can use; this is a stated purpose of subagents ([[S09 cc_subagents|9]]).
- Claude Code in Manual mode starts read-only and asks before edits and commands; it can write only inside the folder where it was started ([[S15 cc_security|15]]).
- Permission deny rules are enforced by the client regardless of what the model decides ([[S11 cc_memory|11]]).
- In auto mode a separate classifier model reviews actions and blocks those that look risky ([[S07 cc_best|7]]).
- Rate tools by risk (low, medium, high) and require human intervention for high-risk, irreversible actions and after repeated failures ([[S60 openai_guide|60]]).
- For MCP servers use progressive, least-privilege scopes instead of broad up-front grants ([[S57 mcp_security|57]]).
- The AI SDK loop stops when a tool call needs approval ([[S70 aisdk_agents|70]]).

**Recommendation.** Write a small table for your project: role, tools, read or write, data it may see, who approves. Lab B shows the idea in code with a per-role tool allowlist ([[Lab B - low-code MAS in Python]]).

See [[Hooks and deterministic control]], [[Sandboxing]].
