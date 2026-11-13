---
tags:
  - deployment
summary: "Container hosts and managed agent runtimes beyond Vercel."
created: 2026-11-13
---

# Other deployment platforms

Status as of 13 November 2026.

| Platform | Documented capability | Source |
|---|---|---|
| Railway | Deploy from GitHub or the CLI; provision infrastructure | ([[S63 railway_docs\|63]]) |
| Render | Background workers that run continuously and process queued long-running tasks | ([[S66 render_docs\|66]]) |
| Fly.io | Turns Docker images into VMs in a global network | ([[S27 fly_docs\|27]]) |
| Modal | Sandboxes that run arbitrary commands, configured like functions | ([[S54 modal_docs\|54]]) |
| Google Cloud Run | Hosts agents built with any framework; streaming HTTP and WebSockets; documents A2A, ADK and n8n deployments | ([[S34 cloudrun_docs\|34]]) |
| Vertex AI Agent Engine | Managed runtime for deploying and scaling agents; `adk deploy` | ([[S35 gcp_agentengine\|35]]) |
| Amazon Bedrock AgentCore | Runtime, Gateway, Memory, Identity and Observability components | ([[S04 aws_agentcore\|4]]) |
| Microsoft Foundry Agent Service | Managed endpoint, automatic scaling, Entra identity, session state, observability | ([[S53 azure_foundry\|53]]) |
| Claude Managed Agents | Anthropic-hosted agent harness with cloud or self-hosted sandbox | ([[S05 cc_agentsdk\|5]]) |
| Cloudflare Agents | Agent state persisted across evictions in Durable Object SQL storage | ([[S21 cloudflare_agents\|21]]) |

Prices and free tiers were not verified in this session; check each pricing page before you commit.

See [[Deployment overview]].
