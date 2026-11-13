---
tags:
  - security
  - design-rule
summary: "A design rule that bounds the damage of prompt injection by construction."
created: 2026-11-13
---

# Rule of Two and lethal trifecta

**Agents Rule of Two (Meta, 31 October 2025)** ([[S50 meta2025rule|50]]). Until prompt injection can be reliably detected, an agent must satisfy no more than two of these three properties within a session:
- **A** It can process untrustworthy inputs.
- **B** It can access sensitive systems or private data.
- **C** It can change state or communicate externally.

If all three are needed, the agent should not run autonomously and requires supervision such as human approval ([[S50 meta2025rule|50]]).

**Origin.** Meta credits Chromium's Rule of 2 and Simon Willison's "lethal trifecta" ([[S50 meta2025rule|50]]): private data, exposure to untrusted content, and the ability to communicate externally ([[S75 willison2025trifecta|75]]).

**Applied to a MAS (Interpretation)**

| Role | A untrusted input | B private data | C acts externally |
|---|---|---|---|
| Web collector | Yes | No | Read-only requests to an allowlist |
| Internal-data analyst | No (receives structured summaries) | Yes | No |
| Publisher or notifier | No | Limited | Yes, after human approval |

Splitting roles is a security control, not only a performance choice. The summaries passed between roles remain a channel for injected text, so validate their structure.

See [[Prompt injection]], [[Least privilege and permissions]].
