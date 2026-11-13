---
tags:
  - security
  - fundamentals
summary: "The two OWASP lists every agent builder should know, and what changes when agents act."
created: 2026-11-13
---

# Threat model for agents

**OWASP Top 10 for Agentic Applications (published 9 December 2025)** ([[S67 owasp2025agentic|67]])

| ID | Risk |
|---|---|
| ASI01 | Agent Goal Hijack |
| ASI02 | Tool Misuse |
| ASI03 | Identity & Privilege Abuse |
| ASI04 | Agentic Supply Chain Vulnerabilities |
| ASI05 | Unexpected Code Execution |
| ASI06 | Memory & Context Poisoning |
| ASI07 | Insecure Inter-Agent Communication |
| ASI08 | Cascading Failures |
| ASI09 | Human-Agent Trust Exploitation |
| ASI10 | Rogue Agents |

**OWASP Top 10 for LLM applications, 2025** ([[S61 owasp2025llm|61]]): LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Supply Chain, LLM04 Data and Model Poisoning, LLM05 Improper Output Handling, LLM06 Excessive Agency, LLM07 System Prompt Leakage, LLM08 Vector and Embedding Weaknesses, LLM09 Misinformation, LLM10 Unbounded Consumption.

**MAS-specific exposure (Interpretation).** ASI07 and ASI08 exist only because agents talk to agents. They mirror the reliability findings in [[MAS failure modes]] and [[Scaling evidence]]: a message from another agent is input to be checked, not an instruction to be trusted.

Claude Code applies that rule to agent teams: a teammate cannot approve a permission prompt or supply consent on the user's behalf ([[S13 cc_teams|13]]).

Controls: [[Prompt injection]], [[Rule of Two and lethal trifecta]], [[Least privilege and permissions]], [[Sandboxing]], [[Secrets management]], [[MCP security]], [[EU legal baseline]]. Checklist: [[Security checklist for student projects]].
