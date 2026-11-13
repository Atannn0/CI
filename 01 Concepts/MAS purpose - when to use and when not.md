---
tags:
  - concept
  - mas
  - decision
summary: "A decision note: the conditions under which a MAS pays for itself."
created: 2026-11-13
---

# MAS purpose: when to use and when not

**Use a MAS when**
- The task is breadth-first with independent directions, exceeds one context window, or involves many complex tools ([[S38 hadfield2025multiagent|38]]).
- Context pollution degrades a single agent, work can run in parallel, or specialisation improves tool choice ([[S18 anthropic2026when|18]]).
- The task value justifies the token bill; MAS are only economical for high-value tasks ([[S38 hadfield2025multiagent|38]]).

**Avoid a MAS when**
- All agents need the same context or have many mutual dependencies; most coding tasks have fewer parallelisable subtasks than research ([[S38 hadfield2025multiagent|38]]).
- The task requires strict sequential reasoning: every multi-agent variant tested degraded performance by 39-70% on a planning benchmark ([[S42 kim2026blog|42]]).
- A single agent has not yet been pushed to its limit. OpenAI advises maximising one agent first and splitting only for complex prompt logic or tool overload ([[S60 openai_guide|60]]).

**The sceptic's case.** In 2025 Cognition argued that parallel agents make conflicting implicit decisions and yield fragile systems ([[S78 yan2025dont|78]]). In 2026 the same author reported a narrower class that works: several agents contribute intelligence while writes stay single-threaded ([[S79 yan2026working|79]]).

**Three checks before you build** ([[S18 anthropic2026when|18]])
1. A genuine constraint exists that multi-agent solves.
2. Decomposition follows context, not problem type.
3. Clear verification points exist.

**Recommendation.** In your project defence, state which of the three constraints your MAS solves and show a single-agent baseline next to it. See [[Cost of MAS]], [[Scaling evidence]].
