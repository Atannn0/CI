---
tags:
  - framework
  - deployment
summary: "TypeScript toolkit with a tool-loop agent and explicit stop conditions."
created: 2026-11-13
---

# Vercel AI SDK

- `ToolLoopAgent` runs a loop in which each step is one generation that produces text or a tool call ([[S70 aisdk_agents|70]]).
- Default limit: 20 steps (`stopWhen: isStepCount(20)`), a safety measure against runaway loops and cost ([[S70 aisdk_agents|70]]).
- The loop also stops when a tool call needs approval or a custom stop condition is met ([[S70 aisdk_agents|70]]).
- `WorkflowAgent` connects model calls and tools to durable persistence, retries and timers ([[S72 vercel_durable|72]]).
- Repository `vercel/ai`: 27,906 stars ([[S29 github2026meta|29]]).

See [[Vercel for agents]], [[Durable execution]].
