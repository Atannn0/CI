---
tags:
  - concept
  - mas
  - evidence
summary: "What a controlled study says about when adding agents helps or hurts."
created: 2026-11-13
---

# Scaling evidence

**Study** ([[S41 kim2025scaling|41]]): five architectures (single agent, independent, centralised, decentralised, hybrid), three LLM families, standardised tools and prompts.

| Finding | Number | Source |
|---|---|---|
| Best case, decomposable financial reasoning | +80.8% vs single agent | ([[S41 kim2025scaling\|41]]) |
| Worst case, sequential planning | -70.0% | ([[S41 kim2025scaling\|41]]) |
| Error amplification, independent agents | 17.2x | ([[S42 kim2026blog\|42]]) |
| Error amplification, centralised | 4.4x | ([[S42 kim2026blog\|42]]) |
| Optimal architecture predicted for held-out configurations | 87% | ([[S41 kim2025scaling\|41]]) |

- Coordination yields diminishing returns once the single-agent baseline is already strong, and tool-heavy tasks incur multi-agent overhead ([[S41 kim2025scaling|41]]).

**Conflicting figures.** The January 2026 blog post reports 180 configurations and four benchmarks ([[S42 kim2026blog|42]]); arXiv v3 of April 2026 reports 260 configurations and six benchmarks ([[S41 kim2025scaling|41]]). This vault relies on the later preprint for scope and on the blog for the error-amplification factors, which the abstract does not state.

**Interpretation.** Ask two questions about your task: is it decomposable, and how many tools does each step need? Sequential, tool-dense tasks favour one agent.

See [[MAS purpose - when to use and when not]].
