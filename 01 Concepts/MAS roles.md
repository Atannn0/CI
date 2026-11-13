---
tags:
  - concept
  - mas
  - roles
summary: "The recurring roles in LLM multi-agent systems and where each is documented."
created: 2026-11-13
---

# MAS roles

| Role | Job | Documented example |
|---|---|---|
| Orchestrator / lead | Plans, delegates, synthesises | LeadResearcher in Anthropic Research ([[S38 hadfield2025multiagent\|38]]); team lead in Claude Code agent teams ([[S13 cc_teams\|13]]) |
| Worker / subagent | Executes one focused subtask in a clean context, returns a condensed result | Research subagents ([[S38 hadfield2025multiagent\|38]]); Explore and general-purpose subagents ([[S09 cc_subagents\|9]]) |
| Planner | Expands a short prompt into a full specification | Planner in the three-agent harness ([[S64 rajasekaran2026harness\|64]]) |
| Generator | Builds the work product in increments | Generator ([[S64 rajasekaran2026harness\|64]]) |
| Evaluator / critic | Tests and grades the product against explicit criteria | Evaluator using Playwright MCP ([[S64 rajasekaran2026harness\|64]]) |
| Router / manager | Sends work to the right specialist | Manager pattern, agents as tools ([[S60 openai_guide\|60]]) |
| Citation / verification agent | Attaches or checks sources | CitationAgent ([[S38 hadfield2025multiagent\|38]]) |
| Human | Steers, approves risky actions | "Humans steer. Agents execute." ([[S48 lopopolo2026harness\|48]]) |

**Why a separate evaluator.** Agents tend to praise their own output even when a human would rate it mediocre; separating the worker from the judge addresses this ([[S64 rajasekaran2026harness|64]]). A reviewer in a fresh context is not biased towards the code it just wrote ([[S07 cc_best|7]]).

**Role design rule.** Decomposition should follow context, not job titles: group work by the context it requires ([[S18 anthropic2026when|18]]).

**Recommendation.** In a CI project, three roles are enough to start: collector, analyst, critic. Add a role only when a failure you observed demands it. See [[Prompting subagents]].
