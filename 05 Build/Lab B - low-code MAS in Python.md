---
tags:
  - build
  - lab
  - low-code
summary: "A 45-minute lab: a complete MAS and harness in one standard-library Python file."
created: 2026-11-13
---

# Lab B: low-code MAS in Python (45 min)

**Goal.** Run and modify a complete MAS (orchestrator, parallel collector subagents, analyst, critic) with a minimal harness.

File: `mas_from_scratch.py` in the `attachments` folder of this vault.

**What you need**
- Python 3.10 or newer. The standard library is enough.
- No API key by default. Optional: `pip install anthropic` (version 2.8.0 requires Python >= 3.10) and the environment variable `ANTHROPIC_API_KEY`; the script then asks a model for the narrative ([[S17 claude_messages|17]]). Default model id `claude-haiku-5-5`, as of 13 November 2026 ([[S12 claude_models|12]]).
- Internet access is optional: without it the script uses an embedded sample of the same data.

**Data.** Public repository metadata from the GitHub REST API. Unauthenticated requests are allowed for public data, with a primary limit of 60 requests per hour ([[S28 github_ratelimit|28]]). [UNVERIFIED] The search endpoint may have its own lower limit, and the reuse terms for the metadata were not checked; on any error the script falls back to the sample.

**Steps**
1. Run `python mas_from_scratch.py` (on some systems `python3`).
2. Checkpoint: you should see six frameworks with stars, last push and licence, an answer, and "Verified by critic: yes".
3. Open `trace.jsonl`. Each line is one step of one agent.
4. Read the code top to bottom and find: the tool allowlist, the host guardrail, the step budget, the subagent that returns a condensed result.

**Real output of the run on 13 November 2026 (live API)**

```text
KIQ: Which open-source agent framework is most widely adopted and actively maintained?
  crewAIInc/crewAI                   60832 stars  last push 2026-11-13  MIT  [live GitHub API]
  langchain-ai/langgraph             44883 stars  last push 2026-11-13  MIT  [live GitHub API]
  openai/openai-agents-python        30645 stars  last push 2026-11-13  MIT  [live GitHub API]
  google/adk-python                  22198 stars  last push 2026-11-13  Apache-2.0  [live GitHub API]
  pydantic/pydantic-ai               21182 stars  last push 2026-11-13  MIT  [live GitHub API]
  microsoft/agent-framework          14656 stars  last push 2026-11-13  MIT  [live GitHub API]
Answer: crewAIInc/crewAI leads on recency then stars (60832 stars, last push 2026-11-13).
Verified by critic: yes
```

The LLM branch was not executed in this session (no API key). Star counts change between retrievals, so your numbers will differ slightly from the tables elsewhere in the vault.

**Experiment.** Run with `INJECT_ERROR=1` (Windows PowerShell: `$env:INJECT_ERROR=1; python mas_from_scratch.py`). The analyst misreports a number; the trace shows the critic rejecting the draft and the analyst revising. In the session run the critic logged `stars claim 608320 != collected 60832`.

**Test.** Compare one star count with the repository page in your browser.

**Develop.** Change `REPOS` and `KIQ` to a question from your own project, then add a second tool and decide which role may call it.

**If stuck**
- `python` not found: use `python3`, or `py` on Windows.
- Every row says "embedded sample": you are offline or rate-limited; wait or continue with the sample.
- `ModuleNotFoundError: anthropic`: you set an API key without installing the package; run `pip install anthropic` or unset the key.

Concepts shown: [[MAS roles]], [[Subagents]], [[Harness components]], [[Least privilege and permissions]], [[Evaluation]].
