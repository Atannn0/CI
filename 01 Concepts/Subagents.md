---
tags:
  - concept
  - mas
  - subagents
summary: "What a subagent is, why it exists, and how it is configured in Claude Code."
created: 2026-11-13
---

# Subagents

**Core idea.** A subagent is a worker with a fresh context window that does a focused job and returns a short summary to its caller.

**Why they exist**
- A subagent may spend tens of thousands of tokens exploring and return a summary of "often 1,000-2,000 tokens" ([[S65 rajasekaran2025context|65]]).
- Stated benefits: preserve context, enforce constraints through limited tools, reuse configurations, specialise behaviour, control cost by routing to cheaper models ([[S09 cc_subagents|9]]).

**How they are defined in Claude Code** ([[S09 cc_subagents|9]])
- A Markdown file with YAML frontmatter; the body becomes the system prompt.
- Only `name` and `description` are required. Other fields include `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `isolation`.
- Locations by priority: managed settings, `--agents` CLI flag, `.claude/agents/` (project), `~/.claude/agents/` (user), plugin `agents/`.
- Built-in subagents include Explore (read-only search), Plan and general-purpose.
- The `description` tells the main agent when to delegate.

**Programmatic definition.** The Claude Agent SDK exposes subagents, hooks, MCP, permissions and sessions as a library in Python and TypeScript ([[S05 cc_agentsdk|5]]).

**Subagent vs skill vs agent team**
- A skill is reusable content loaded into the current context; a subagent is an isolated worker ([[S10 cc_features|10]]).
- Agent teams are separate sessions that message each other; subagents work inside one session and cost fewer tokens ([[S13 cc_teams|13]]).

See [[Prompting subagents]], [[Agent teams]], [[Template - subagent file]].
