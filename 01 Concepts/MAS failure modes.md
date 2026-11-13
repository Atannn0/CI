---
tags:
  - concept
  - mas
  - evidence
summary: "The MAST taxonomy: 14 failure modes in three categories, from 1,600+ annotated traces."
created: 2026-11-13
---

# MAS failure modes

**MAST (Multi-Agent System Failure Taxonomy)** ([[S20 cemri2025mast|20]])
- Built from 1,600+ annotated traces across 7 MAS frameworks.
- 14 failure modes in 3 categories: **system design issues**, **inter-agent misalignment**, **task verification**.
- Inter-annotator agreement kappa = 0.88.

**Failure patterns reported by practitioners**
- Vague delegation caused duplicated work and gaps ([[S38 hadfield2025multiagent|38]]).
- Agents are stateful, so small errors cascade ([[S38 hadfield2025multiagent|38]]).
- Long tasks: trying to one-shot the whole job, and declaring victory too early ([[S80 young2025harness|80]]).
- Context anxiety (wrapping up early near a perceived context limit) and self-evaluation bias ([[S64 rajasekaran2026harness|64]]).

**Interpretation.** The three MAST categories line up with three design duties: specify roles and termination, engineer what each agent knows about the others, and verify independently.

Countermeasures: [[Prompting subagents]], [[Evaluation]], [[Long-running harness patterns]]. Security failures are separate: [[Threat model for agents]].
