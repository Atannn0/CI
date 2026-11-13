---
tags:
  - ide
  - method
summary: "The explore, plan, implement, verify loop and how to run parallel sessions."
created: 2026-11-13
---

# Working method in an agentic IDE

From Claude Code's documented practice ([[S07 cc_best|7]]); the method transfers to other tools (Interpretation).

1. **Explore, then plan, then code.** Use plan mode to separate research from execution; skip the plan if you could describe the diff in one sentence.
2. **Give the agent a check it can run.** Tests, a build, a linter or a screenshot comparison; ask for evidence, not assertions.
3. **Let the agent interview you** for larger features and write a `SPEC.md`; then start a fresh session to implement it.
4. **Manage context.** Clear between unrelated tasks; delegate investigation to subagents.
5. **Add an adversarial review step.** A fresh subagent reviews the diff against the plan and reports gaps.
6. **Scale out.** Parallel sessions in git worktrees; writer and reviewer in separate sessions; non-interactive runs for batch work.

Spec-first workflows are built into Kiro as Specs ([[S43 kiro_docs|43]]).

See [[Agentic IDEs and coding agents]], [[Tips and tricks 2026]].
