---
tags:
  - security
summary: "Isolation of what agents execute: local OS sandboxes and cloud microVMs."
created: 2026-11-13
---

# Sandboxing

**Local** ([[S08 cc_sandbox|8]])
- The Claude Code sandbox is an operating-system boundary around shell commands: you set which files and network domains they can reach.
- macOS uses Seatbelt; Linux and WSL2 use bubblewrap. On native Windows commands run unsandboxed.
- It covers shell commands only; file tools, MCP servers and hooks run outside it.
- Both layers are needed: without network isolation a compromised agent could exfiltrate files such as SSH keys; without filesystem isolation it could backdoor resources to gain network access.
- Built on the open-source `@anthropic-ai/sandbox-runtime` package.

**Cloud**
- Vercel Sandbox runs untrusted or AI-generated code in isolated Firecracker microVMs, each with its own filesystem and network ([[S73 vercel_sandbox|73]]).
- Claude Code cloud sessions run in isolated virtual machines with limited network access and scoped credentials ([[S15 cc_security|15]]).
- Modal Sandboxes run arbitrary commands in containers ([[S54 modal_docs|54]]).
- Open-source options with active repositories include E2B and OpenSandbox ([[S29 github2026meta|29]]).

**Why it matters for MAS.** Bash and code execution let agents create their own tools, which is why sandboxes are a core harness component ([[S68 trivedy2026harness|68]]).

See [[Least privilege and permissions]], [[Vercel for agents]].
