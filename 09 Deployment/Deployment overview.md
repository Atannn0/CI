---
tags:
  - deployment
  - comparison
summary: "Where an agent can run and how to choose."
created: 2026-11-13
---

# Deployment overview

**Why agents are hard to host**
- They run for a long time and hold state, so minor failures cascade; production systems need checkpoints, retries and the ability to resume ([[S38 hadfield2025multiagent|38]]).
- Running agents must survive new releases; Anthropic shifts traffic gradually between versions (rainbow deployments) ([[S38 hadfield2025multiagent|38]]).
- They execute generated code, which needs isolation ([[S73 vercel_sandbox|73]]).

**Options, as of 13 November 2026**

| Option | What you get | Source |
|---|---|---|
| Vercel | Functions on Fluid compute, Workflow SDK, Sandbox, AI Gateway | [[Vercel for agents]] |
| Cloudflare Agents | Stateful agents on Durable Objects with SQL-backed state | ([[S21 cloudflare_agents\|21]]) |
| Containers and VMs | Railway, Render, Fly.io, Google Cloud Run | [[Other deployment platforms]] |
| Managed agent runtimes | Vertex AI Agent Engine, Amazon Bedrock AgentCore, Microsoft Foundry Agent Service, Claude Managed Agents | [[Other deployment platforms]] |
| Your laptop | Fine for a demo; no uptime | Recommendation |

**Recommendation: choose by the longest step.** If one agent run fits inside the platform's function limit, a serverless function is enough. If it does not, you need durable workflows or a long-running container. See [[Durable execution]], [[Deployment checklist]].
