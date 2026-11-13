---
tags:
  - build
  - assessment
summary: "Five questions with answers for self-assessment."
created: 2026-11-13
---

# Self-check questions

1. **What separates a workflow from an agent?** Predefined code paths versus the model directing its own process ([[S19 anthropic2024agents|19]]).
2. **Name three conditions that justify a MAS.** Context pollution, parallelisable work, specialisation ([[S18 anthropic2026when|18]]).
3. **Why does a subagent return a summary instead of its full transcript?** To keep the lead's context clean; exploration can cost tens of thousands of tokens while the summary is 1,000-2,000 ([[S65 rajasekaran2025context|65]]).
4. **Your CLAUDE.md says "never edit .env" and the agent edits it. Why, and what is the fix?** CLAUDE.md is context, not enforcement; use a `PreToolUse` hook or a deny rule ([[S11 cc_memory|11]], [[S06 cc_hooks|6]]).
5. **Which three properties must not be combined in one unsupervised agent session?** Untrustworthy input, access to sensitive data, ability to change state or communicate externally ([[S50 meta2025rule|50]]).
