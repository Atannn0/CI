---
tags:
  - security
summary: "The top LLM risk: what it is, why it cannot be fully prevented, how to limit damage."
created: 2026-11-13
---

# Prompt injection

- A prompt injection vulnerability occurs when prompts alter the model's behaviour or output in unintended ways ([[S61 owasp2025llm|61]]).
- *Indirect* injection: a user asks for a summary of a webpage that contains hidden instructions, which leads to exfiltration of the private conversation ([[S61 owasp2025llm|61]]).
- OWASP states it is unclear whether fool-proof prevention exists, given how generative models work ([[S61 owasp2025llm|61]]).
- Vendor documentation agrees: protections reduce risk but "no system is completely immune" ([[S15 cc_security|15]]).

**Mitigations documented**
- Constrain model behaviour through specific role and limits in the system prompt ([[S61 owasp2025llm|61]]).
- Require approval for sensitive operations; do not auto-approve commands that fetch web content ([[S15 cc_security|15]]).
- Process fetched web content in a separate context window ([[S15 cc_security|15]]).
- Do not pipe untrusted content directly to the agent; use virtual machines for scripts that touch external services ([[S15 cc_security|15]]).
- Layer guardrails: relevance and safety classifiers, PII filter, tool risk ratings, rules-based checks, output validation ([[S60 openai_guide|60]]).

**For CI projects (Interpretation).** Every web page, PDF, patent abstract and e-mail your collector reads is untrusted content. Design as if one of them contains instructions.

See [[Rule of Two and lethal trifecta]], [[Threat model for agents]].
