---
tags:
  - build
  - procedure
summary: "A ten-step procedure from question to deployed system, each step tied to a source."
created: 2026-11-13
---

# Build a MAS from scratch

1. **State the job and the success test.** Write unambiguous tasks with reference answers; two experts should reach the same verdict ([[S36 grace2026evals|36]]).
2. **Build the single-agent baseline.** Maximise one agent before splitting ([[S60 openai_guide|60]]).
3. **Decide whether a MAS is justified.** Context pollution, parallelism or specialisation ([[S18 anthropic2026when|18]]). If none applies, stop here.
4. **Pick the topology.** Orchestrator with parallel workers for breadth; keep writes single-threaded ([[S38 hadfield2025multiagent|38]], [[S79 yan2026working|79]]).
5. **Write role briefs.** Each subagent needs an objective, an output format, tool and source guidance, and task boundaries ([[S38 hadfield2025multiagent|38]]).
6. **Give each role the minimum tools.** Limit tools per subagent ([[S09 cc_subagents|9]]); keep the tool set small and unambiguous ([[S65 rajasekaran2025context|65]]).
7. **Add a separate verifier.** Do not let the worker grade itself ([[S64 rajasekaran2026harness|64]]).
8. **Put state in files and log every step.** Structured artefacts hand context between sessions ([[S80 young2025harness|80]]); full tracing is needed to debug non-deterministic systems ([[S38 hadfield2025multiagent|38]]).
9. **Bound the loop and the bill.** Step limit and spend budget ([[S70 aisdk_agents|70]], [[S71 vercel_research|71]]).
10. **Secure and deploy.** [[Security checklist for student projects]], [[Deployment checklist]].

Practise: [[Lab A - no-code paper MAS]] then [[Lab B - low-code MAS in Python]]. Templates: [[Prompting subagents]].
