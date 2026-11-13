---
tags:
  - instructions
  - template
summary: "A starter AGENTS.md for a course project. Recommendation, not a standard."
created: 2026-11-13
---

# Template: AGENTS.md

**Recommendation.** Section choice follows the popular sections named on the format's site ([[S03 agentsmd|3]]) and the map-not-manual advice ([[S48 lopopolo2026harness|48]]). Adapt every line; delete what the agent can read from the code.

```markdown
# AGENTS.md

## Project
One paragraph: what the system answers (KIQ), for whom, and what "done" means.

## Setup and run
- Install: `<command>`
- Run: `<command>`
- Test: `<command>`  (run before every commit)

## Architecture map
- `agents/`  role definitions (collector, analyst, critic)
- `tools/`   one file per tool; read-only unless stated
- `docs/`    decisions and specs; read `docs/architecture.md` first

## Rules
- Every factual claim in an output carries a source URL.
- Never read or write `.env` or anything under `secrets/`.
- Ask before adding a dependency.

## Verification
- A change is finished when `<test command>` passes and the critic reports no unsupported claims.
```

See [[AGENTS.md]].
