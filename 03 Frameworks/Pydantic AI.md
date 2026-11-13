---
tags:
  - framework
summary: "Typed Python agents with four levels of multi-agent complexity."
created: 2026-11-13
---

# Pydantic AI

Four levels of complexity ([[S62 pydanticai_docs|62]]):
1. Single-agent workflows.
2. Agent delegation: an agent uses another agent through a tool, then takes back control.
3. Programmatic hand-off: application code or a human decides which agent runs next.
4. Graph-based control flow for the most complex cases.

Repository: 21,182 stars, MIT ([[S29 github2026meta|29]]).

**Interpretation.** The four levels are a useful ladder for any framework: climb one rung only when the lower one fails.
