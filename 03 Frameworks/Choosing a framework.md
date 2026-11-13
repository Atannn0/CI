---
tags:
  - framework
  - decision
summary: "A short decision procedure, including the option of using no framework."
created: 2026-11-13
---

# Choosing a framework

**Facts to weigh**
- Anthropic advises starting with LLM APIs directly, because many patterns take a few lines of code, and understanding the code under any framework you adopt ([[S19 anthropic2024agents|19]]).
- Frameworks add abstraction that can hide prompts and responses and make debugging harder ([[S19 anthropic2024agents|19]]).
- Projects move: Flowise, Roo Code and Chainlit repositories were archived as of 13 November 2026, and AutoGen has a named successor ([[S29 github2026meta|29]], [[S51 msaf_docs|51]]).

**Recommendation: a four-question procedure**
1. Can the job be done with the direct API and 100 lines? Then do that first ([[Lab B - low-code MAS in Python]]).
2. Do you need to resume after a crash or wait for a human? Pick a runtime with [[Durable execution]].
3. Which language does your deployment target favour? TypeScript on Vercel points to [[Vercel AI SDK]] or [[Mastra]]; Python points to [[LangGraph]], [[CrewAI]], [[Pydantic AI]], [[OpenAI Agents SDK]], [[Google ADK]].
4. Is the repository active and not archived? Check [[Tools reference]] on the day you decide.

See [[Framework landscape]].
