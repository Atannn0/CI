---
tags:
  - concept
  - mas
  - cost
summary: "Token and money figures reported for multi-agent runs."
created: 2026-11-13
---

# Cost of MAS

| Figure | Source | Status |
|---|---|---|
| Agents use about 4x the tokens of chat; MAS about 15x | ([[S38 hadfield2025multiagent\|38]]) | Single vendor source |
| Token usage alone explained 80% of performance variance on BrowseComp | ([[S38 hadfield2025multiagent\|38]]) | Single vendor source |
| Full three-agent harness: 6 h and $200 vs 20 min and $9 solo, for one application build | ([[S64 rajasekaran2026harness\|64]]) | Single vendor source |
| Agent teams: usage scales with the number of teammates | ([[S13 cc_teams\|13]]) | Documentation |

**Cost controls documented by vendors**
- Route subagents to cheaper models ([[S09 cc_subagents|9]]).
- Cap the loop: the AI SDK's `ToolLoopAgent` stops after 20 steps by default as a safety measure against runaway loops ([[S70 aisdk_agents|70]]).
- Set a spend budget on the gateway key; requests stop when it is reached ([[S71 vercel_research|71]]).

**Recommendation.** Report tokens or cost per run in your project. A MAS without a cost figure is not a finished design.
