---
tags:
  - project
  - course
summary: "How to turn this vault into a defensible course project. Recommendation throughout."
created: 2026-11-13
---

# Course project guide

**Recommendation.** This note is teaching guidance, not sourced fact. The linked notes carry the sources.

**What a strong project shows**
1. A Key Intelligence Question and a named user of the answer.
2. A justified architecture: single agent, workflow or MAS ([[MAS purpose - when to use and when not]]).
3. A role table: role, context, tools, output ([[MAS roles]]).
4. A harness: instruction files, state, verification, step and cost limits ([[Harness components]]).
5. An eval set of at least 20 tasks with a single-agent baseline ([[Evaluation]]).
6. A security table and the completed checklist ([[Security checklist for student projects]]).
7. A deployment or a reasoned decision not to deploy ([[Deployment checklist]]).
8. A trace of one real run, shown live.

**Project ideas for CI (illustrative)**
- Weak-signal monitor: collectors per source type, an analyst that clusters signals, a critic that checks novelty.
- Patent landscape assistant: one subagent per classification area, a synthesiser, a citation verifier.
- Competitor profile builder from public filings and press releases, with source grading.
- Regulatory watch: a monitor per jurisdiction, an impact analyst, a human approval step before any alert.

**Suggested defence structure (10 minutes)**
1. KIQ and user (1 min)
2. Architecture and why it is not simpler (2 min)
3. Live run with trace (3 min)
4. Eval results against baseline, and cost per run (2 min)
5. Security and limits (2 min)

Start with [[Build a MAS from scratch]].
