---
tags:
  - harness
  - context
summary: "Curating what enters the context window; the central constraint of agent design."
created: 2026-11-13
---

# Context engineering

- **Definition:** the set of strategies for curating and maintaining the optimal set of tokens during inference, including everything outside the prompt itself ([[S65 rajasekaran2025context|65]]).
- **Why:** as the token count grows, recall accuracy declines ("context rot"); the model has a finite attention budget ([[S65 rajasekaran2025context|65]]).
- **Goal:** the smallest set of high-signal tokens that maximises the likelihood of the desired outcome ([[S65 rajasekaran2025context|65]]).
- Claude Code's documentation makes the same point operationally: the context window is the most important resource to manage ([[S07 cc_best|7]]).

**Techniques** ([[S65 rajasekaran2025context|65]])
1. *Right altitude* system prompts: between brittle if-else logic and vague guidance.
2. *Minimal viable tool set*: if a human cannot say which tool applies, the agent cannot either.
3. *Just-in-time retrieval*: keep references (paths, queries, links) and load data at runtime.
4. *Compaction*: summarise a nearly full conversation and continue in a new window.
5. *Structured note-taking*: write notes to storage outside the window and reload them.
6. *Sub-agent architectures*: explore in clean windows, return condensed summaries.

**OpenAI's version.** Give the agent "a map, not a 1,000-page instruction manual": a roughly 100-line AGENTS.md as table of contents, with `docs/` as the system of record ([[S48 lopopolo2026harness|48]]).

See [[Subagents]], [[CLAUDE.md]], [[Tips and tricks 2026]].
