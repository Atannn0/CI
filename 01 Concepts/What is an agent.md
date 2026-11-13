---
tags:
  - concept
  - fundamentals
summary: "Three working definitions of an agent and what they share."
created: 2026-11-13
---

# What is an agent

**Core idea.** An agent is a model that decides its own next step and uses tools to act, repeatedly, until the task is done.

| Source | Definition |
|---|---|
| Classical MAS theory | A system with autonomy, social ability, reactivity and pro-activeness (the "weak notion of agency") ([[S77 wooldridge1995\|77]]) |
| Anthropic | "LLMs autonomously using tools in a loop" ([[S65 rajasekaran2025context\|65]]) |
| OpenAI | Systems that independently accomplish tasks on the user's behalf; an LLM manages workflow execution and chooses tools within guardrails ([[S60 openai_guide\|60]]) |
| LangChain | Agent = Model + Harness ([[S68 trivedy2026harness\|68]]) |

- An application that uses an LLM without letting it control workflow execution, such as a simple chatbot or a sentiment classifier, is not an agent in OpenAI's definition ([[S60 openai_guide|60]]).
- The basic building block is the *augmented LLM*: a model extended with retrieval, tools and memory ([[S19 anthropic2024agents|19]]).

**Analogy (Interpretation).** A single LLM call is an analyst answering one question from memory. An agent is the same analyst with a library card, a phone and permission to decide what to look up next.

**Bridge to CI (Interpretation).** The 1995 properties map onto the intelligence cycle: pro-activeness is collection planning, reactivity is monitoring, social ability is dissemination and tasking.

Next: [[Workflows vs agents]], [[What is a multi-agent system]], [[What is a harness]].
