---
tags:
  - harness
  - evals
summary: "Vocabulary and first steps for evaluating agents and multi-agent systems."
created: 2026-11-13
---

# Evaluation

**Vocabulary** ([[S36 grace2026evals|36]])
- *Task*: one test with inputs and success criteria. *Trial*: one attempt. *Grader*: scoring logic. *Transcript*: the full record of a trial. *Outcome*: the final state of the environment.
- *Capability evals* start with a low pass rate; *regression evals* should stay near 100%.
- *pass@k*: at least one success in k attempts. *pass^k*: all k succeed; use it when consistency matters.

**Graders** ([[S36 grace2026evals|36]])

| Type | Strength | Weakness |
|---|---|---|
| Code-based | Fast, cheap, reproducible | Brittle, no nuance |
| Model-based | Flexible, handles open-ended output | Non-deterministic, needs human calibration |
| Human | Gold standard | Slow, expensive |

**How to start**
- 20 to 50 simple tasks drawn from real failures is a strong start ([[S36 grace2026evals|36]]).
- Anthropic's research system began with about 20 queries and an LLM judge scoring factual accuracy, citation accuracy, completeness, source quality and tool efficiency ([[S38 hadfield2025multiagent|38]]).
- Grade the outcome, not the exact path, and read the transcripts ([[S36 grace2026evals|36]]).
- Human testers caught what automation missed, such as agents preferring SEO-optimised content farms over authoritative sources ([[S38 hadfield2025multiagent|38]]).

**Bridge to CI (Interpretation).** Source quality and citation accuracy are intelligence tradecraft criteria. Your KIQs can be your eval tasks.

See [[MAS roles]], [[Observability in production]].
