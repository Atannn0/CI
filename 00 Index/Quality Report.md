---
tags:
  - index
  - quality
summary: "What was verified, how, and what was not."
created: 2026-11-13
---

# Quality Report

Created 2026-11-13. Reports only what was actually done.

**Scope decision.** The project template asks for three audience tracks. The request named one audience (master's students in a competitive intelligence course) and three output formats, so this package contains the student track only.

**Sources.** 81 sources: 60 Tier 1, 20 Tier 2, 1 Tier 3. Each source note states how it was read (full page fetched, or search excerpt). The single Tier 3 source is cited only as the origin of a term and is corroborated by a Tier 2 source.

**Tools.** 170 tools verified on 2026-11-13: open-source repositories through the GitHub API (existence, description, licence, stars, last push, archived flag); hosted products through an official page opened in this session. 6 archived repositories are flagged. Tool websites were not opened one by one.

**Self-Refine (2 rounds).** Round 1 removed or reworded statements that were not in a source read in this session: a claim about early subagent counts, an unverified Codex cloud mode, an unverified `.aiignore` reference, an unverified Kiro folder path, and an authentication statement that lacked its "unless previously approved" qualifier. Round 2 was automated: every citation key resolves to a source, every wikilink resolves to a note, and tool counts are computed, not typed.

**Self-Consistency.**
- Scaling study: the research blog and arXiv v3 report different scope (180 configurations and four benchmarks vs 260 and six). Both are shown in [[Scaling evidence]]; the later preprint is used for scope.
- Star counts moved between two retrievals on the same day (LangGraph 44,882 then 44,883). Tables use the first retrieval; the lab shows the live output.
- Critical numbers with one vendor source (token multipliers, cost of the three-agent harness, error-amplification factors from the blog) are labelled single-source in [[Fact Sheet]] and [[Cost of MAS]]. A second independent source was not found for them.

**Code.** `mas_from_scratch.py` was executed in this session on Python 3.13 with live GitHub API access and again with fault injection; the output in [[Lab B - low-code MAS in Python]] is the real output. The optional LLM branch was not executed (no API key). Its call signature (`model`, `max_tokens`, `messages`) and response fields (`content`, `text`) were checked against the installed `anthropic` package 2.8.0. The script has 101 lines, above the 80-line target.

**Unverified or omitted**
- Volume and pages of Wooldridge and Jennings (1995) come from a secondary citation; the DOI was not verified and is omitted.
- The Official Journal series number for the GDPR was not read in this session.
- Byline of "Building effective agents" appeared as "Erik S. and Barry Zhang"; the bibliography therefore uses the corporate author.
- Publication dates of several vendor pages were not captured; they are cited as n.d. with a retrieval date.
- Prices and free tiers of deployment platforms, GitHub search-endpoint rate limits and metadata reuse terms were not verified.
- The AI Act note reports dates from Commission pages; the consolidated legal text on EUR-Lex was not opened. Applicability to a specific project was not assessed.
- No peer-reviewed source was found in this session for harness engineering; that topic rests on vendor engineering posts.

**Before teaching.** Re-check the tool statuses and the Vercel limits, both of which change often, and replace vendor single-source numbers if independent replications appear.
