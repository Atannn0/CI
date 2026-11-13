---
tags:
  - concept
  - mas
summary: "Definition, the one architectural reason MAS exist in LLM practice, and the evidence base."
created: 2026-11-13
---

# What is a multi-agent system

**Core idea.** A multi-agent system (MAS) splits one job across several agents, each with its own context window, instructions and tools, plus a way to coordinate them.

- In Claude Code a subagent "runs in its own context window with a custom system prompt, specific tool access, and independent permissions" ([[S09 cc_subagents|9]]).
- Anthropic's Research feature is a reference MAS: a lead agent plans, spawns subagents that search in parallel, and synthesises; a separate citation agent attaches sources ([[S38 hadfield2025multiagent|38]]).
- Anthropic reports three situations where multiple agents consistently beat one: context pollution, parallelisable tasks, and specialisation that improves tool selection or focus ([[S18 anthropic2026when|18]]).

**Analogy (Interpretation).** A MAS is a CI unit: a head of analysis tasks collectors, each collector reads far more than they report, and a reviewer checks the product before dissemination.

**Evidence, not enthusiasm**
- Performance gains of MAS on popular benchmarks are often minimal ([[S20 cemri2025mast|20]]).
- Results swing from +80.8% to -70.0% against a single agent depending on the task ([[S41 kim2025scaling|41]]).

Continue with [[MAS roles]], [[MAS relationships and topologies]], [[MAS purpose - when to use and when not]], [[MAS failure modes]], [[Scaling evidence]].
