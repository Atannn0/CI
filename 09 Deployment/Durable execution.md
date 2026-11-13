---
tags:
  - deployment
  - reliability
summary: "Making an agent survive crashes, restarts and long waits."
created: 2026-11-13
---

# Durable execution

**Core idea.** Record the result of each completed step so that a restarted run replays the record instead of repeating the work.

- Vercel Workflow SDK: during recovery the workflow re-runs its coordinating logic and reuses recorded results from completed steps ([[S72 vercel_durable|72]]).
- LangGraph lists durable execution, streaming and human-in-the-loop as its core capabilities ([[S44 langgraph_docs|44]]).
- Mastra workflows can suspend for a human and resume ([[S49 mastra_docs|49]]).
- Microsoft Agent Framework adds state management for long-running and human-in-the-loop scenarios ([[S51 msaf_docs|51]]).
- Anthropic built resume-from-failure with regular checkpoints for its research system ([[S38 hadfield2025multiagent|38]]).
- Dedicated engines with active repositories: Temporal, Inngest, Trigger.dev, Restate ([[S29 github2026meta|29]]).

**The low-tech version.** State in files: a progress log, a feature list and git history let a fresh session continue ([[S80 young2025harness|80]]).

See [[Long-running harness patterns]], [[Vercel for agents]].
