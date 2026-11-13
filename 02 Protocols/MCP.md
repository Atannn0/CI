---
tags:
  - protocol
  - standard
summary: "Model Context Protocol: how an agent connects to tools and data."
created: 2026-11-13
---

# MCP (Model Context Protocol)

- **Participants:** a host is the LLM application, a client is its MCP-speaking half, a server is what you build ([[S56 mcp_pysdk|56]]).
- **Primitives:** tools are model-controlled, resources are application-controlled, prompts are user-controlled ([[S56 mcp_pysdk|56]]).
- **Layers:** a JSON-RPC data layer and a transport layer ([[S55 mcp_arch|55]]).
- **Governance:** donated by Anthropic to the Agentic AI Foundation under the Linux Foundation on 9 December 2025 ([[S46 lf2025aaif|46]]).
- **Version note, as of 13 November 2026:** the 2026-07-28 revision describes MCP as stateless, with discovery through `server/discover`, and deprecates sampling ([[S55 mcp_arch|55]], [[S57 mcp_security|57]]).
- **Context cost:** in Claude Code, tool names load at session start and full schemas are deferred until a tool is needed ([[S10 cc_features|10]]).
- **MCP vs skill:** MCP gives tools and data access; a skill gives the knowledge of how to use them ([[S10 cc_features|10]]).

Security: [[MCP security]]. Related: [[A2A]], [[Agentic AI Foundation]].
