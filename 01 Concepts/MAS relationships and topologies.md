---
tags:
  - concept
  - mas
  - topology
summary: "How agents are wired together: hierarchy, handoffs, teams, and what the evidence says about each."
created: 2026-11-13
---

# MAS relationships and topologies

**Two basic relationships** ([[S60 openai_guide|60]])
- **Manager (agents as tools):** a central agent calls specialists as tools, keeps control and synthesises. Suits cases where one agent should talk to the user.
- **Decentralised (handoffs):** peers transfer control to one another; a handoff is a one-way transfer that passes the conversation state.

**Topologies studied empirically** ([[S41 kim2025scaling|41]]): single agent, independent, centralised, decentralised, hybrid.

**In practice**
- *Orchestrator-worker with parallel subagents*: the lead coordinates while subagents work in parallel ([[S38 hadfield2025multiagent|38]]).
- *Subagents vs agent teams* in Claude Code: subagents report back to the caller; teammates share a task list and message each other directly ([[S13 cc_teams|13]]).
- *Nesting*: a Claude Code subagent can by default spawn subagents up to three layers below the main conversation ([[S09 cc_subagents|9]]).
- *Files as the communication channel*: one agent writes a file, another reads it and replies ([[S64 rajasekaran2026harness|64]]).
- *Across organisations*: [[A2A]] for agent-to-agent, [[MCP]] for agent-to-tool.

**What the evidence says**
- Independent agents amplified errors 17.2x; centralised coordination contained it to 4.4x, with the orchestrator acting as a validation bottleneck ([[S42 kim2026blog|42]]).
- Cognition's 2026 position: arbitrary networks of negotiating agents are "mostly a distraction"; the practical shape is map-reduce-and-manage, with writes kept single-threaded ([[S79 yan2026working|79]]).
- Synchronous execution is a bottleneck: the lead waits for each batch of subagents ([[S38 hadfield2025multiagent|38]]).

See [[MAS roles]], [[Scaling evidence]].
