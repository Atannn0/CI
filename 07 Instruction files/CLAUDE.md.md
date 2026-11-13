---
tags:
  - instructions
summary: "Claude Code's persistent project instructions: scopes, size, imports, limits."
created: 2026-11-13
---

# CLAUDE.md

**Scopes, broadest to most specific** ([[S11 cc_memory|11]])
- Managed policy (organisation), user `~/.claude/CLAUDE.md`, project `./CLAUDE.md` or `./.claude/CLAUDE.md`, local `./CLAUDE.local.md`.
- Files are concatenated, not overridden; subdirectory files load on demand.

**Rules of thumb**
- Target under 200 lines per file; longer files reduce adherence ([[S11 cc_memory|11]]).
- Be specific and verifiable: "Run `npm test` before committing", not "Test your changes" ([[S11 cc_memory|11]]).
- For each line ask whether removing it would cause mistakes; if not, cut it ([[S07 cc_best|7]]).
- Include commands the agent cannot guess, deviations from defaults, test instructions, architecture decisions, gotchas. Exclude what the code already shows, long tutorials and fast-changing facts ([[S07 cc_best|7]]).

**Mechanics** ([[S11 cc_memory|11]])
- `@path` imports, up to four hops deep.
- `.claude/rules/` for modular and path-scoped rules.
- `/init` generates a starter file; `/memory` lists what is loaded.
- Auto memory is separate: notes Claude writes itself; the first 200 lines or 25 KB of `MEMORY.md` load each session.

**Limits.** Delivered as a user message after the system prompt; not a hard enforcement layer ([[S11 cc_memory|11]]). See [[Hooks and deterministic control]].

Template: [[Template - CLAUDE.md]].
