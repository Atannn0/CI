---
tags:
  - instructions
  - standard
  - skills
summary: "Agent Skills: capabilities packaged as folders and loaded on demand."
created: 2026-11-13
---

# SKILL.md (Agent Skills)

- A skill is a folder containing a `SKILL.md` file with metadata (`name` and `description` at minimum) and instructions; it can bundle scripts, references and templates ([[S02 agentskills|2]]).
- Agent Skills became an Agentic AI Foundation project on 22 October 2026 ([[S47 lf2026aaif|47]]).
- **Progressive disclosure:** descriptions stay in context; the body loads only when the skill is invoked ([[S16 cc_skills|16]]).
- Keep `SKILL.md` under 500 lines and move detail into supporting files ([[S16 cc_skills|16]]).
- `disable-model-invocation: true` reserves a skill with side effects for manual use ([[S16 cc_skills|16]]).
- `context: fork` runs a skill in a subagent ([[S16 cc_skills|16]]).
- Put always-needed rules in CLAUDE.md and sometimes-needed knowledge in skills ([[S10 cc_features|10]]).

**Bridge to CI (Interpretation).** A skill is a codified analytic technique: a PESTEL procedure, a patent landscape routine or a source-grading scheme that any agent can load when the task calls for it.

See [[Instruction files overview]], [[Subagents]].
