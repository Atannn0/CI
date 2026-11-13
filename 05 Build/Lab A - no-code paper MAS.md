---
tags:
  - build
  - lab
  - no-code
summary: "A 20-minute no-code lab: run a three-role MAS by hand in separate chats."
created: 2026-11-13
---

# Lab A: no-code paper MAS (20 min)

**Goal.** Experience orchestration, isolated contexts and independent verification without writing code.

**What you need**
- A browser and a chat assistant. Claude has a free plan with limited usage, as of 13 November 2026 ([[S14 claude_pricing|14]]). Alternative: any other chat assistant your faculty permits.
- A text editor for three files.
- Real input: the public documentation pages of two agent frameworks, for example ([[S44 langgraph_docs|44]]) and ([[S22 crewai_docs|22]]).

Data protection: use public pages only. Do not paste personal, confidential or client data.

**Steps**
1. Write the KIQ: "Which of these two frameworks fits a three-person CI team with Python skills?"
2. Create `collector.txt`, `analyst.txt`, `critic.txt` using the template in [[Prompting subagents]].
3. Open chat 1 (collector A). Paste `collector.txt` and the first documentation page. Ask for a 150-word evidence summary with quotes.
4. Open a new chat 2 (collector B). Repeat with the second page.
5. Checkpoint: you now have two summaries. Neither collector saw the other's page.
6. Open chat 3 (analyst). Paste `analyst.txt` and only the two summaries. Ask for a recommendation with reasons.
7. Open chat 4 (critic). Paste `critic.txt`, the recommendation and the two summaries. Ask it to list every claim that the summaries do not support.
8. Checkpoint: you should see a list of supported and unsupported claims.
9. Return the critic's list to chat 3 and ask for a revision.

You were the harness: you routed messages, enforced isolation and decided when to stop ([[S68 trivedy2026harness|68]]).

**Experiment.** Repeat steps 6-9 in one single chat that plays all roles. Compare the number of unsupported claims.

**Test.** Check three claims of the final answer against the original pages yourself.

**Develop.** Replace the two pages with two annual reports or two patent abstracts relevant to your project.

**If stuck**
- The critic agrees with everything: tell it that its only job is to find unsupported claims, and give it the summaries, not the analyst's reasoning. A reviewer asked to find gaps will usually report some, so ask for correctness issues only ([[S07 cc_best|7]]).
- Summaries are too long to paste: lower the word limit in `collector.txt`.
