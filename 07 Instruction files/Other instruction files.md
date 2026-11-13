---
tags:
  - instructions
summary: "GEMINI.md, Cursor rules, Copilot instructions, Kiro steering, Junie guidelines."
created: 2026-11-13
---

# Other instruction files

- **GEMINI.md.** Gemini CLI loads context files hierarchically, concatenates them and sends them with every prompt; `/memory show` displays the result ([[S32 gemini_md|32]]).
- **Cursor rules.** Project rules are `.mdc` files in `.cursor/rules/`; a plain `.md` file there is ignored. Cursor also reads `AGENTS.md` and `CLAUDE.md` ([[S23 cursor_rules|23]]).
- **Copilot in VS Code.** `.github/copilot-instructions.md` or `AGENTS.md` for the project; `.instructions.md` files for targeted rules. VS Code documents the instruction files of several harnesses side by side ([[S52 vscode_instructions|52]]).
- **Kiro.** Steering enforces project standards; Specs plan a feature as requirements, design and tasks ([[S43 kiro_docs|43]]).
- **Junie.** Looks for `.junie/AGENTS.md`, then root `AGENTS.md`, then the legacy `.junie/guidelines.md` ([[S39 junie_docs|39]]).

**Recommendation.** Keep one source of truth (`AGENTS.md`) and make tool-specific files import or link to it. See [[Instruction files overview]].
