---
tags:
  - concept
  - mas
summary: "Peer-to-peer coordination of several sessions, as implemented experimentally in Claude Code."
created: 2026-11-13
---

# Agent teams

- Agent teams coordinate several Claude Code instances: one session is the team lead, teammates work in their own context windows and communicate directly ([[S13 cc_teams|13]]).
- Status as of 13 November 2026: experimental and disabled by default, enabled with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` ([[S13 cc_teams|13]]).
- Components: team lead, teammates, shared task list, mailbox ([[S13 cc_teams|13]]).
- Strongest use cases: research and review, new modules, debugging with competing hypotheses, cross-layer work ([[S13 cc_teams|13]]).
- Guidance: start with 3-5 teammates, 5-6 tasks per teammate, and give each teammate its own files to avoid overwrites ([[S13 cc_teams|13]]).
- Cost: token usage scales with the number of active teammates ([[S13 cc_teams|13]]).
- Limits: one team per session, no nested teams, the lead is fixed ([[S13 cc_teams|13]]).

Compare with [[Subagents]] and [[MAS relationships and topologies]].
