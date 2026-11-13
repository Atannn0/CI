"""A multi-agent system from scratch: one file, Python standard library only.

Illustrative scenario (CI): Key Intelligence Question (KIQ) =
"Which open-source agent framework is most widely adopted and actively maintained?"

Roles:  orchestrator -> N collector subagents (parallel) -> analyst -> critic (verifier)
Harness (everything that is not the model): tool allowlist, host guardrail,
step budget, shared state, trace log (trace.jsonl), fallback data.

Run:  python mas_from_scratch.py
Optional LLM narrative: pip install anthropic ; set ANTHROPIC_API_KEY (never hard-code keys).
"""
import json, os, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

KIQ = "Which open-source agent framework is most widely adopted and actively maintained?"
REPOS = ["langchain-ai/langgraph", "crewAIInc/crewAI", "microsoft/agent-framework",
         "openai/openai-agents-python", "google/adk-python", "pydantic/pydantic-ai"]
# Embedded sample = real values returned by the GitHub API on 2026-11-13 (offline fallback).
SAMPLE = {"langchain-ai/langgraph": (44882, "2026-11-13", "MIT"), "crewAIInc/crewAI": (60832, "2026-11-13", "MIT"),
          "microsoft/agent-framework": (14656, "2026-11-13", "MIT"), "openai/openai-agents-python": (30645, "2026-11-13", "MIT"),
          "google/adk-python": (22198, "2026-11-13", "Apache-2.0"), "pydantic/pydantic-ai": (21182, "2026-11-13", "MIT")}
ALLOWED_HOST = "api.github.com"      # guardrail: the only host any tool may contact
MAX_REVISIONS = 2                    # step budget for the analyst <-> critic loop
TOOLS = {"collector": ["fetch_repo"], "analyst": [], "critic": []}   # least privilege per role

def trace(agent, event, **data):     # observability: one JSON line per step
    with open("trace.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps({"t": datetime.now(timezone.utc).isoformat(), "agent": agent, "event": event, **data}) + "\n")

def fetch_repo(agent, repo):         # TOOL: read-only, one host, with fallback
    assert "fetch_repo" in TOOLS[agent], f"{agent} may not call fetch_repo"
    url = "https://api.github.com/search/repositories?q=" + urllib.parse.quote("repo:" + repo)
    assert urllib.parse.urlparse(url).hostname == ALLOWED_HOST, "blocked by host guardrail"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "mas-from-scratch-lab"})
        with urllib.request.urlopen(req, timeout=10) as r:
            item = json.load(r)["items"][0]
        return item, "live GitHub API"
    except Exception as e:           # offline, rate-limited or blocked: use the embedded sample
        stars, pushed, lic = SAMPLE[repo]
        trace(agent, "fallback", repo=repo, reason=type(e).__name__)
        return {"full_name": repo, "stargazers_count": stars, "pushed_at": pushed, "license": {"spdx_id": lic}}, "embedded sample"

def collector(task):                 # SUBAGENT: own context, returns a condensed result only
    raw, source = fetch_repo("collector", task["repo"])      # raw = large record
    result = {"repo": raw["full_name"], "stars": raw["stargazers_count"], "last_push": raw["pushed_at"][:10],
              "license": (raw.get("license") or {}).get("spdx_id"), "source": source}
    trace("collector", "done", **result)
    return result                    # the orchestrator never sees the raw record

def orchestrator_plan(kiq):          # ORCHESTRATOR: decompose and brief each subagent
    return [{"objective": kiq, "repo": r, "output": "repo, stars, last_push, license, source",
             "boundary": "read-only; one repository; no opinions"} for r in REPOS]

def analyst(findings, feedback=None):  # ANALYST: turn findings into claims (optionally with an LLM)
    ranked = sorted(findings, key=lambda f: (f["last_push"], f["stars"]), reverse=True)
    top = ranked[0]
    stars = top["stars"] * 10 if os.environ.get("INJECT_ERROR") and not feedback else top["stars"]  # fault injection
    draft = {"claim_repo": top["repo"], "claim_stars": stars, "ranking": [f["repo"] for f in ranked],
             "text": f"{top['repo']} leads on recency then stars ({stars} stars, last push {top['last_push']})."}
    if os.environ.get("ANTHROPIC_API_KEY"):   # optional: LLM writes the narrative, numbers stay in code
        import anthropic
        msg = anthropic.Anthropic().messages.create(
            model=os.environ.get("MAS_MODEL", "claude-haiku-5-5"), max_tokens=300,
            messages=[{"role": "user", "content": "You are a CI analyst. In 3 sentences, answer the KIQ using ONLY this data. "
                       f"KIQ: {KIQ}\nData: {json.dumps(findings)}"}])
        draft["text"] = " ".join(getattr(b, "text", "") for b in msg.content).strip()
    trace("analyst", "draft", claim_repo=draft["claim_repo"], claim_stars=draft["claim_stars"])
    return draft

def critic(draft, findings):         # CRITIC: independent, code-based check of every number
    truth = {f["repo"]: f for f in findings}
    issues = []
    if draft["claim_repo"] not in truth:
        issues.append("claimed repository was never collected")
    elif draft["claim_stars"] != truth[draft["claim_repo"]]["stars"]:
        issues.append(f"stars claim {draft['claim_stars']} != collected {truth[draft['claim_repo']]['stars']}")
    trace("critic", "verdict", issues=issues)
    return issues

def main():
    tasks = orchestrator_plan(KIQ)
    with ThreadPoolExecutor(max_workers=len(tasks)) as pool:   # subagents run in parallel
        findings = list(pool.map(collector, tasks))
    draft, issues = analyst(findings), None
    for _ in range(MAX_REVISIONS):
        issues = critic(draft, findings)
        if not issues:
            break
        draft = analyst(findings, feedback=issues)             # revise with the critic's feedback
    print("KIQ:", KIQ)
    for f in sorted(findings, key=lambda f: f["stars"], reverse=True):
        print(f"  {f['repo']:<32} {f['stars']:>7} stars  last push {f['last_push']}  {f['license']}  [{f['source']}]")
    print("Answer:", draft["text"])
    print("Verified by critic:", "yes" if not issues else f"NO -> {issues}")
    print("Note: stars and recency measure adoption and activity, not quality. Trace: trace.jsonl")

if __name__ == "__main__":
    main()
