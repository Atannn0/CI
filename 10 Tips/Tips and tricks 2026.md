---
tags:
  - tips
  - practice
summary: "Twenty-six current, sourced practices for building agents and MAS."
created: 2026-11-13
---

# Tips and tricks 2026

Each tip is a documented practice; the wording is condensed.

**Design**
1. Start with the simplest thing that works; add agents only on evidence ([[S19 anthropic2024agents|19]], [[S18 anthropic2026when|18]]).
2. Keep writes single-threaded; let extra agents contribute analysis ([[S79 yan2026working|79]]).
3. Prefer a centralised orchestrator to independent agents: it contains error amplification ([[S42 kim2026blog|42]]).
4. Design sessions around the Rule of Two ([[S50 meta2025rule|50]]).
5. Re-test every harness component when you change the model; remove what is no longer needed ([[S64 rajasekaran2026harness|64]]).

**Context**
6. Treat the instruction file as a map of about 100 lines that points to `docs/` ([[S48 lopopolo2026harness|48]]).
7. Keep CLAUDE.md under 200 lines and prune it like code ([[S11 cc_memory|11]], [[S07 cc_best|7]]).
8. Move sometimes-needed knowledge into skills, which load on demand ([[S16 cc_skills|16]]).
9. Send investigations to subagents; they return a short summary ([[S07 cc_best|7]], [[S65 rajasekaran2025context|65]]).
10. Use command-line tools for external services: they are the most context-efficient option ([[S07 cc_best|7]]).
11. Rely on deferred MCP tool schemas and disconnect servers you do not use ([[S10 cc_features|10]]).
12. After two failed corrections, clear the context and restart with a better prompt ([[S07 cc_best|7]]).

**Verification**
13. Give the agent a check it can run and ask for evidence ([[S07 cc_best|7]]).
14. Use a reviewer with a fresh context, and tell it to report only correctness gaps ([[S07 cc_best|7]]).
15. Agree a "sprint contract" between builder and evaluator before work starts ([[S64 rajasekaran2026harness|64]]).
16. Keep a JSON feature list in which every item starts as failing ([[S80 young2025harness|80]]).
17. Start evals with 20-50 tasks from real failures and read the transcripts ([[S36 grace2026evals|36]]).
18. Write lint and test messages that contain the fix, so the agent can repair itself ([[S48 lopopolo2026harness|48]]).

**Control**
19. Put must-happen rules in hooks or deny rules ([[S10 cc_features|10]]).
20. Enable the sandbox to cut permission prompts without giving up the boundary ([[S07 cc_best|7]], [[S08 cc_sandbox|8]]).
21. Set a step limit and a gateway budget ([[S70 aisdk_agents|70]], [[S71 vercel_research|71]]).
22. Route subagents to cheaper models ([[S09 cc_subagents|9]]).

**Workflow**
23. Explore, plan, then code; have the agent interview you and write a spec for larger features ([[S07 cc_best|7]]).
24. Run parallel sessions in git worktrees; for agent teams start with 3-5 teammates ([[S07 cc_best|7]], [[S13 cc_teams|13]]).
25. Let agents rewrite tool descriptions: this cut task time by 40% in Anthropic's tests ([[S38 hadfield2025multiagent|38]]).
26. Check that a dependency's repository is active and not archived on the day you adopt it ([[S29 github2026meta|29]]).

See [[Common mistakes]], [[Working method in an agentic IDE]].
