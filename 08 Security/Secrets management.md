---
tags:
  - security
summary: "Keep keys out of prompts, code, repositories and agent reach."
created: 2026-11-13
---

# Secrets management

- Block agent access to secret files by enforcement: the documented hook example protects `.env` ([[S06 cc_hooks|6]]).
- On Vercel all environment variables are encrypted; values marked sensitive can only be decrypted during builds ([[S40 vercel_env|40]]).
- Cloud coding sessions use a scoped credential inside the sandbox instead of the user's real token ([[S15 cc_security|15]]).
- Budgets can be attached to AI Gateway keys, which limits the damage of a leaked key ([[S71 vercel_research|71]]).
- MCP servers must not accept tokens that were not issued for them (no token passthrough) ([[S57 mcp_security|57]]).
- Secret scanners with active repositories: Gitleaks and TruffleHog ([[S29 github2026meta|29]]).

**Recommendation**
1. Read keys from environment variables; never write them in code, prompts or instruction files.
2. Add `.env` to `.gitignore` before the first commit and run a secret scanner in CI.
3. Use one key per project with a spend limit; rotate it after the course ends.

See [[Security checklist for student projects]].
