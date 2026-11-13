---
tags:
  - security
  - checklist
summary: "A one-page checklist to complete before the project presentation."
created: 2026-11-13
---

# Security checklist for student projects

**Recommendation.** Each item points to the note with its sources.

- [ ] Each role has a written tool allowlist ([[Least privilege and permissions]]).
- [ ] No single unsupervised session combines untrusted input, private data and external actions ([[Rule of Two and lethal trifecta]]).
- [ ] All content from the web, files and other agents is treated as untrusted ([[Prompt injection]]).
- [ ] Code execution happens in a sandbox ([[Sandboxing]]).
- [ ] Keys are in environment variables, `.env` is git-ignored, a secret scanner has run ([[Secrets management]]).
- [ ] Every MCP server is listed with its owner and start-up command ([[MCP security]]).
- [ ] The loop has a step limit and the key has a spend limit ([[Cost of MAS]]).
- [ ] Must-never rules are enforced by hooks or deny rules, not by prose ([[Hooks and deterministic control]]).
- [ ] A trace of every run is stored ([[Observability in production]]).
- [ ] The interface tells users they are interacting with an AI system; no personal data is collected without approval ([[EU legal baseline]]).
- [ ] A human approves irreversible or public actions ([[Least privilege and permissions]]).
