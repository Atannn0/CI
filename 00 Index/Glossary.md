---
tags:
  - index
  - glossary
summary: "Key terms with one-line definitions and links."
created: 2026-11-13
---

# Glossary

| Term | Definition | Note |
|---|---|---|
| Agent | LLM autonomously using tools in a loop ([[S65 rajasekaran2025context\|65]]) | [[What is an agent]] |
| Augmented LLM | Model extended with retrieval, tools and memory ([[S19 anthropic2024agents\|19]]) | [[What is an agent]] |
| Workflow | LLMs and tools orchestrated through predefined code paths ([[S19 anthropic2024agents\|19]]) | [[Workflows vs agents]] |
| Multi-agent system | Several agents with separate contexts coordinating on one job | [[What is a multi-agent system]] |
| Orchestrator | Lead agent that plans, delegates and synthesises ([[S38 hadfield2025multiagent\|38]]) | [[MAS roles]] |
| Subagent | Worker with its own context window, prompt, tools and permissions ([[S09 cc_subagents\|9]]) | [[Subagents]] |
| Handoff | One-way transfer of control and conversation state to another agent ([[S60 openai_guide\|60]]) | [[MAS relationships and topologies]] |
| Harness | Everything that is not the model ([[S68 trivedy2026harness\|68]]) | [[What is a harness]] |
| Context engineering | Curating the tokens available during inference ([[S65 rajasekaran2025context\|65]]) | [[Context engineering]] |
| Context rot | Recall accuracy declines as the context grows ([[S65 rajasekaran2025context\|65]]) | [[Context engineering]] |
| Compaction | Summarising a nearly full context to continue ([[S65 rajasekaran2025context\|65]]) | [[Context engineering]] |
| Hook | Command run at a fixed lifecycle event ([[S06 cc_hooks\|6]]) | [[Hooks and deterministic control]] |
| Skill | Folder with SKILL.md, loaded on demand ([[S02 agentskills\|2]]) | [[SKILL.md]] |
| MCP | Protocol connecting agents to tools and data ([[S55 mcp_arch\|55]]) | [[MCP]] |
| A2A | Protocol for agent-to-agent communication ([[S01 a2a_repo\|1]]) | [[A2A]] |
| ACI | Agent-computer interface: the design of tools for models ([[S19 anthropic2024agents\|19]]) | [[Harness components]] |
| Eval | A test: input plus grading logic ([[S36 grace2026evals\|36]]) | [[Evaluation]] |
| Transcript | Full record of one trial ([[S36 grace2026evals\|36]]) | [[Evaluation]] |
| Prompt injection | Input that alters model behaviour in unintended ways ([[S61 owasp2025llm\|61]]) | [[Prompt injection]] |
| Rule of Two | At most two of: untrusted input, private data, external action ([[S50 meta2025rule\|50]]) | [[Rule of Two and lethal trifecta]] |
| Durable execution | Persisting step results so a run can resume ([[S72 vercel_durable\|72]]) | [[Durable execution]] |
| MAST | Taxonomy of 14 MAS failure modes ([[S20 cemri2025mast\|20]]) | [[MAS failure modes]] |
