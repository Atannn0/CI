---
tags:
  - deployment
  - checklist
summary: "Steps from local prototype to a public URL."
created: 2026-11-13
---

# Deployment checklist

**Recommendation.** Each item links to the sourced note.

1. Measure the longest run and compare it with the platform limit ([[Vercel for agents]]).
2. Decide where state lives: files, database or workflow engine ([[Durable execution]]).
3. Move keys to the platform's environment variables and mark them sensitive ([[Secrets management]]).
4. Set a step limit and a spend budget ([[Cost of MAS]]).
5. Run generated code only in a sandbox ([[Sandboxing]]).
6. Store a trace for every run ([[Observability in production]]).
7. Add the AI-interaction notice to the interface ([[EU legal baseline]]).
8. Run your eval set against the deployed version, not only locally ([[Evaluation]]).
9. Complete the [[Security checklist for student projects]].
10. Write down how to roll back.
