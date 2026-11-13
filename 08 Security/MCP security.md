---
tags:
  - security
  - protocol
summary: "The attack classes named in the MCP security best practices and what they mean for a project."
created: 2026-11-13
---

# MCP security

**Attack classes in the official best practices (version 2026-07-28)** ([[S57 mcp_security|57]])

| Risk | Short description | Main mitigation |
|---|---|---|
| Confused deputy | Proxy server with a static client ID lets an attacker skip user consent | Per-client consent before the third-party flow |
| Token passthrough | Server accepts and forwards tokens not issued for it | Forbidden; validate audience |
| SSRF | Malicious server makes the client fetch internal URLs | HTTPS only, block private IP ranges, egress proxy |
| State handle hijacking | Guessed or stolen handle gives access to another user's state | Bind handles to the authenticated user |
| Local server compromise | Malicious start-up command or payload runs with the client's privileges | Show the exact command, require consent, sandbox |
| Over-broad scopes | Stolen token unlocks everything | Minimal initial scopes, step-up authorisation |

**Supply chain**
- Anthropic reviews connectors against listing criteria but does not security-audit or manage any MCP server; the advice is to write your own or use providers you trust ([[S15 cc_security|15]]).
- OWASP lists Agentic Supply Chain Vulnerabilities as ASI04 ([[S67 owasp2025agentic|67]]).
- Scanners with active repositories: `snyk/agent-scan` and `cisco-ai-defense/mcp-scanner` ([[S29 github2026meta|29]]).

**Recommendation.** For a course project, connect at most a few MCP servers, prefer official ones, read the start-up command before approving it and record each server in your security table.

See [[MCP]], [[Threat model for agents]].
