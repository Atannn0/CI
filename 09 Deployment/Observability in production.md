---
tags:
  - deployment
  - observability
summary: "Tracing and monitoring a non-deterministic system."
created: 2026-11-13
---

# Observability in production

- Non-deterministic agent behaviour makes traditional debugging insufficient; full production tracing is needed to diagnose failures ([[S38 hadfield2025multiagent|38]]).
- Anthropic monitors decision patterns without reading individual conversation contents, for privacy ([[S38 hadfield2025multiagent|38]]).
- A transcript (trace, trajectory) is the full record of a trial: outputs, tool calls, reasoning, intermediate results ([[S36 grace2026evals|36]]).
- Claude Code usage can be monitored through OpenTelemetry metrics ([[S15 cc_security|15]]).
- The OpenAI Agents SDK has built-in tracing ([[S59 openai_agents_sdk|59]]); AI Gateway logs tokens, latency and cost per call ([[S71 vercel_research|71]]).
- Google's Cloud Run documentation names Langfuse and Arize as tools you can deploy for visibility into agent executions ([[S34 cloudrun_docs|34]]).

**Minimum for a course project (Recommendation).** One JSON line per agent step with timestamp, agent, event and payload, as in [[Lab B - low-code MAS in Python]]. That file is also your evidence in the presentation.

Tools: see the observability category in [[Tools reference]]. Related: [[Evaluation]].
