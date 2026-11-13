---
tags:
  - protocol
  - standard
summary: "Agent2Agent protocol: how independent agents discover and talk to each other."
created: 2026-11-13
---

# A2A (Agent2Agent)

- An open protocol for communication and interoperability between opaque agentic applications; contributed by Google, hosted under the Linux Foundation, Apache 2.0 licence ([[S01 a2a_repo|1]]).
- JSON-RPC 2.0 over HTTP(S); discovery through "Agent Cards"; synchronous, streaming (SSE) and asynchronous push interactions ([[S01 a2a_repo|1]]).
- Listed among Agentic AI Foundation projects in October 2026 ([[S47 lf2026aaif|47]]).
- Google Cloud Run documents A2A deployment ([[S34 cloudrun_docs|34]]).

**Interpretation.** MCP is vertical (agent to tool), A2A is horizontal (agent to agent). A student project inside one codebase rarely needs A2A; it matters when agents belong to different owners.

See [[MCP]], [[MAS relationships and topologies]].
