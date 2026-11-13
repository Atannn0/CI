---
tags:
  - concept
  - fundamentals
summary: "The architectural distinction that decides how much autonomy you build."
created: 2026-11-13
---

# Workflows vs agents

- **Workflows** orchestrate LLMs and tools through predefined code paths ([[S19 anthropic2024agents|19]]).
- **Agents** let the LLM dynamically direct its own process and tool usage ([[S19 anthropic2024agents|19]]).
- Both are "agentic systems" in Anthropic's vocabulary ([[S19 anthropic2024agents|19]]).

**When to choose which**
- Start with the simplest solution and add complexity only when needed; often one well-optimised LLM call with retrieval and examples is enough ([[S19 anthropic2024agents|19]]).
- Workflows suit well-defined tasks that need predictability; agents suit open-ended problems that need flexibility ([[S19 anthropic2024agents|19]]).
- Agents trade latency and cost for task performance, and errors can compound, so they need sandboxed testing and guardrails ([[S19 anthropic2024agents|19]]).
- OpenAI's three signals that an agent is justified: complex decision-making, rules that are hard to maintain, heavy reliance on unstructured data ([[S60 openai_guide|60]]).

**Recommendation.** For a course project, write down in one line whether each component is a single call, a workflow or an agent before you write any code. See [[Workflow patterns]] and [[MAS purpose - when to use and when not]].
