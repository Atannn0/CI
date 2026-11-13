---
tags:
  - build
  - prompt
  - template
summary: "The delegation brief and the effort-scaling rule from Anthropic's research system."
created: 2026-11-13
---

# Prompting subagents

**What every delegation brief contains** ([[S38 hadfield2025multiagent|38]])
- Objective
- Output format
- Guidance on tools and sources
- Clear task boundaries

**Scale effort to the query** ([[S38 hadfield2025multiagent|38]])

| Query | Agents | Tool calls |
|---|---|---|
| Simple fact-finding | 1 | 3-10 |
| Direct comparison | 2-4 subagents | 10-15 each |
| Complex research | More than 10 subagents | Divided responsibilities |

**Other principles from the same source** ([[S38 hadfield2025multiagent|38]])
- Think like your agents: watch them work step by step.
- Start wide, then narrow the search.
- Parallelise: 3-5 subagents at once, each using several tools in parallel.
- Rewriting tool descriptions cut task completion time by 40% in their tests.

**Template (Recommendation)**

```text
ROLE: <collector | analyst | critic>
OBJECTIVE: <one sentence tied to the KIQ>
INPUT: <what you are given>
TOOLS: <allowed tools only>
SOURCES: <preferred source types; exclude content farms>
OUTPUT: <schema, length limit, citation format>
BOUNDARIES: <what not to do; when to stop; when to escalate>
```

See [[Subagents]], [[MAS roles]].
