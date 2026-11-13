---
tags:
  - framework
  - comparison
summary: "One table comparing the main agent frameworks by abstraction and multi-agent model."
created: 2026-11-13
---

# Framework landscape

Repository figures are from the GitHub API on 13 November 2026 ([[S29 github2026meta|29]]). Stars measure attention, not quality.

| Framework | Language | Multi-agent model | Source |
|---|---|---|---|
| [[LangGraph]] | Python, JS | Low-level graph runtime: durable execution, streaming, human-in-the-loop | ([[S44 langgraph_docs\|44]]) |
| [[CrewAI]] | Python | Flows (event-driven control) delegating to Crews (role-playing agent teams) | ([[S22 crewai_docs\|22]]) |
| [[Microsoft Agent Framework]] | Python, .NET | Agents plus graph-based workflows; successor to AutoGen and Semantic Kernel | ([[S51 msaf_docs\|51]]) |
| [[OpenAI Agents SDK]] | Python, JS | Few primitives: agents, handoffs, guardrails, sessions, tracing | ([[S59 openai_agents_sdk\|59]]) |
| [[Claude Agent SDK]] | Python, TS | Claude Code's agent loop as a library; subagents, hooks, MCP | ([[S05 cc_agentsdk\|5]]) |
| [[Google ADK]] | Python | LLM agents plus deterministic workflow agents | ([[S33 adk_docs\|33]]) |
| [[Pydantic AI]] | Python | Delegation, programmatic hand-off, typed graphs | ([[S62 pydanticai_docs\|62]]) |
| [[Mastra]] | TypeScript | Agents, typed workflows, supervisor coordination | ([[S49 mastra_docs\|49]]) |
| [[Vercel AI SDK]] | TypeScript | `ToolLoopAgent` loop with stop conditions | ([[S70 aisdk_agents\|70]]) |

**Three layers, one vocabulary.** LangChain separates agent *frameworks* (abstractions), agent *runtimes* (durable execution) and agent *harnesses* (batteries-included autonomy) ([[S45 langchain_products|45]]).

Decision help: [[Choosing a framework]]. Full list: [[Tools reference]].
