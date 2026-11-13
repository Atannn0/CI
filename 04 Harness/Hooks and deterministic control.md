---
tags:
  - harness
  - security
summary: "Instructions are requests; hooks and permissions are enforcement."
created: 2026-11-13
---

# Hooks and deterministic control

- Hooks are user-defined commands that run at fixed points in the agent's lifecycle, giving deterministic control instead of relying on the model to choose ([[S06 cc_hooks|6]]).
- Events include `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `SubagentStart`, `SubagentStop`, `Stop`, `PreCompact` and `SessionEnd` ([[S06 cc_hooks|6]]).
- A `PreToolUse` hook can block a tool call: the documented example protects `.env`, `package-lock.json` and `.git/` and exits with code 2 ([[S06 cc_hooks|6]]).
- An instruction such as "never edit `.env`" in CLAUDE.md or a skill "is a request, not a guarantee"; a blocking hook is enforcement ([[S10 cc_features|10]]).
- CLAUDE.md is treated "as context, not enforced configuration" ([[S11 cc_memory|11]]).
- Kiro offers the same idea: hooks that run shell commands or agent prompts on events, stored in `.kiro/hooks/` ([[S43 kiro_docs|43]]).

**Rule (Interpretation).** Anything that must always or never happen belongs in code, not in prose.

See [[Least privilege and permissions]], [[CLAUDE.md]].
