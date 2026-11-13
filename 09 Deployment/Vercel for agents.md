---
tags:
  - deployment
  - vercel
summary: "The Vercel building blocks for an agent app and their documented limits."
created: 2026-11-13
---

# Vercel for agents

Status as of 13 November 2026.

| Building block | Fact | Source |
|---|---|---|
| Functions (Fluid compute) | Hobby: 300 s default and maximum. Pro and Enterprise: 300 s default, 800 s maximum, up to 1,800 s in beta | ([[S74 vercel_limits\|74]]) |
| Workflow SDK | `'use workflow'` marks the coordinating function, `'use step'` marks a function whose result is persisted for replay | ([[S72 vercel_durable\|72]]) |
| Sandbox | Isolated Firecracker microVMs for untrusted or AI-generated code | ([[S73 vercel_sandbox\|73]]) |
| AI Gateway | Model routing with fallbacks; budgets attached to keys; every call logged with tokens, latency and cost | ([[S71 vercel_research\|71]]) |
| AI SDK | `ToolLoopAgent` with a default 20-step limit | ([[S70 aisdk_agents\|70]]) |
| Environment variables | All encrypted; sensitive ones decrypt only during builds | ([[S40 vercel_env\|40]]) |

**Documented path** ([[S69 vercel_agents|69]]): set up a Next.js project, authenticate to AI Gateway with OIDC tokens, generate and stream text, add tools, add model fallbacks, run generated code in Sandbox.

**For workloads beyond the function limit,** Vercel's documentation points to Workflows, which pause, resume and keep state without duration limits ([[S74 vercel_limits|74]]).

**Interpretation.** A typical course MAS (a few subagents, a few minutes per run) fits a Hobby function if you stream results and keep runs under five minutes. A monitoring agent that sleeps between checks does not; use the Workflow SDK. An Astro or Next.js front end with a Postgres database for traces is a workable student stack.

See [[Durable execution]], [[Vercel AI SDK]], [[Deployment checklist]].
