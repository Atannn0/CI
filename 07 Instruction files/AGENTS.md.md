---
tags:
  - instructions
  - standard
summary: "The open, tool-neutral instruction file for coding agents."
created: 2026-11-13
---

# AGENTS.md

- "A simple, open format for guiding coding agents": a README for agents, with no required fields ([[S03 agentsmd|3]]).
- Emerged from collaboration including OpenAI Codex, Amp, Jules, Cursor and Factory; now stewarded by the Agentic AI Foundation ([[S03 agentsmd|3]]).
- The site reports use by over 60k open-source projects ([[S03 agentsmd|3]]).
- Typical content: setup commands, tests, code style, pull request rules ([[S03 agentsmd|3]]).

**Discovery differs by tool**
- Codex builds an instruction chain from the global file to the repository root to nested folders, and checks `AGENTS.override.md` before `AGENTS.md` ([[S58 codex_agentsmd|58]]).
- Windsurf treats a root file as always-on and a subfolder file as applying only to that folder ([[S76 windsurf_agentsmd|76]]).
- Cursor supports AGENTS.md in the root and subdirectories ([[S23 cursor_rules|23]]).
- Claude Code "reads `CLAUDE.md`, not `AGENTS.md`"; import it with `@AGENTS.md` or a symlink ([[S11 cc_memory|11]]).

**How long.** OpenAI's Codex team keeps theirs at roughly 100 lines, as a table of contents pointing to `docs/` ([[S48 lopopolo2026harness|48]]).

Template: [[Template - AGENTS.md]]. Governance: [[Agentic AI Foundation]].
