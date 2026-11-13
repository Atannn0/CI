---
tags:
  - concept
  - pattern
summary: "Five composable patterns that cover most multi-step LLM systems."
created: 2026-11-13
---

# Workflow patterns

Anthropic names five workflow patterns ([[S19 anthropic2024agents|19]]):

| Pattern | What it does | MAS reading (Interpretation) |
|---|---|---|
| Prompt chaining | Sequential steps, each call processes the previous output; programmatic gates between steps | Pipeline of specialists |
| Routing | Classifies an input and sends it to a specialised follow-up | Dispatcher role |
| Parallelisation | Simultaneous calls, aggregated. *Sectioning* splits independent subtasks; *voting* repeats one task for diverse outputs | Parallel workers |
| Orchestrator-workers | A central LLM breaks down the task dynamically, delegates and synthesises | Lead agent with [[Subagents]] |
| Evaluator-optimizer | One LLM generates, another evaluates and gives feedback in a loop | Generator and critic roles |

Google's ADK ships the deterministic equivalents as "workflow agents": `SequentialAgent`, `ParallelAgent`, `LoopAgent` ([[S33 adk_docs|33]]).

See [[MAS roles]] and [[MAS relationships and topologies]].
