---
tags:
  - harness
  - fundamentals
summary: "The harness is everything around the model; definitions from three vendors."
created: 2026-11-13
---

# What is a harness

**Core idea.** The model supplies the intelligence; the harness is the system that makes it useful.

| Source | Definition |
|---|---|
| LangChain | "Every piece of code, configuration, and execution logic that isn't the model itself"; Agent = Model + Harness ([[S68 trivedy2026harness\|68]]) |
| Anthropic | Agent harness (scaffold): the system that lets a model act as an agent by processing inputs, orchestrating tool calls and returning results ([[S36 grace2026evals\|36]]) |
| OpenAI | Engineering work shifts to designing environments, specifying intent and building feedback loops so agents can do reliable work ([[S48 lopopolo2026harness\|48]]) |

- Evaluating "an agent" means evaluating the harness and the model together ([[S36 grace2026evals|36]]).
- "Every component in a harness encodes an assumption about what the model can't do on its own", so components should be re-tested and removed when a new model makes them unnecessary ([[S64 rajasekaran2026harness|64]]).
- OpenAI's team built roughly a million lines of code in about five months with zero hand-written lines; early progress was slow because the environment was underspecified, not because the model was incapable ([[S48 lopopolo2026harness|48]]).

**Analogy (Interpretation).** The model is a talented analyst on day one. The harness is the desk, the access rights, the style guide, the review process and the filing system.

Components: [[Harness components]]. Practice: [[Context engineering]], [[Long-running harness patterns]], [[Hooks and deterministic control]], [[Evaluation]].
