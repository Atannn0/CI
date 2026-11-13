---
tags:
  - harness
  - pattern
summary: "Patterns that keep an agent coherent across many context windows."
created: 2026-11-13
---

# Long-running harness patterns

**Initializer + worker** ([[S80 young2025harness|80]])
- First session: an initializer agent creates a feature list (JSON, every item initially failing), a progress log, an `init.sh` script and an initial git commit.
- Every later session: read the progress file and git log, pick one unfinished feature, test end to end, leave the workspace clean.
- JSON was chosen for the feature list because the model is less likely to corrupt it than Markdown.

**Planner, generator, evaluator** ([[S64 rajasekaran2026harness|64]])
- The planner expands a 1-4 sentence prompt into a specification.
- The generator builds; the evaluator clicks through the running app with Playwright MCP and fails the sprint if any criterion is below threshold.
- Before each sprint the two agree a "sprint contract": what will be built and how success is verified.
- Compaction keeps the same agent going; a context reset starts a fresh agent from a structured handoff.

**Repository as system of record** ([[S48 lopopolo2026harness|48]])
- "What Codex can't see doesn't exist": knowledge in chat tools or heads is invisible to agents.
- Architecture and taste are enforced by custom linters and structural tests whose error messages include the fix.
- Background agents scan for drift and open small clean-up pull requests.

**Loop until verified.** Reinjecting the prompt into a fresh context when the agent tries to exit is known as the Ralph loop ([[S68 trivedy2026harness|68]]).

See [[What is a harness]], [[Evaluation]].
