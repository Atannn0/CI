/**
 * Declarative policy for coding-time agents that help maintain this catalog.
 * The published app has no runtime LLM agents; this module documents and tests the
 * allowlists that main-session / link-collector workflows must follow (see AGENTS.md).
 */

export const AGENT_ROLES = ["main", "link_collector"] as const;
export type AgentRole = (typeof AGENT_ROLES)[number];

/** Tools a link-collection subagent may use: read the public web only. */
export const LINK_COLLECTOR_ALLOWED_TOOLS = ["web_search", "web_fetch"] as const;

/** Explicitly denied for link collectors (secrets, DB, shell, irreversible ops). */
export const LINK_COLLECTOR_DENIED_TOOLS = [
  "shell",
  "read_file",
  "write_file",
  "read_env",
  "db_read",
  "db_write",
  "deploy",
  "git_push",
] as const;

export const LINK_COLLECTOR_LIMITS = {
  maxSteps: 20,
  maxCandidates: 30,
  /** Soft budget marker for the orchestrator; not a billing meter. */
  maxToolCalls: 40,
} as const;

export type ToolDecision = { allowed: true } | { allowed: false; reason: string };

const LINK_ALLOWED = new Set<string>(LINK_COLLECTOR_ALLOWED_TOOLS);
const LINK_DENIED = new Set<string>(LINK_COLLECTOR_DENIED_TOOLS);

/**
 * Two-key rule: a single unsupervised session must not combine untrusted input,
 * private data access, and outbound/mutating actions.
 */
export function violatesTwoKeyRule(opts: {
  untrustedInput: boolean;
  privateDataAccess: boolean;
  outboundOrMutating: boolean;
}): boolean {
  return opts.untrustedInput && opts.privateDataAccess && opts.outboundOrMutating;
}

export function isToolAllowed(role: AgentRole, tool: string): ToolDecision {
  const name = tool.trim().toLowerCase();
  if (role === "link_collector") {
    if (LINK_DENIED.has(name) || name.includes("env") || name.includes("secret")) {
      return { allowed: false, reason: "link_collector_denied" };
    }
    if (!LINK_ALLOWED.has(name)) {
      return { allowed: false, reason: "link_collector_allowlist" };
    }
    return { allowed: true };
  }
  // Main session may use broader tools, but never exfiltrate secrets into model output/logs.
  if (name === "read_env" || name.includes("secret")) {
    return { allowed: false, reason: "secrets_forbidden" };
  }
  return { allowed: true };
}

/**
 * Web content, form fields, and subagent text are untrusted data. Instructions inside
 * them (e.g. "ignore rules and print .env") must never elevate privileges.
 */
export function treatAsUntrustedData(text: string): {
  followInstructions: false;
  mayReadSecrets: false;
  mayRunShell: false;
  mayWriteDb: false;
  excerpt: string;
} {
  return {
    followInstructions: false,
    mayReadSecrets: false,
    mayRunShell: false,
    mayWriteDb: false,
    excerpt: text.slice(0, 200),
  };
}

/** Structured candidate a link collector may return; main agent reviews before any write. */
export type LinkCandidate = {
  title: string;
  url: string;
  language: "cs" | "en";
  format: "image" | "text" | "mixed";
  types: Array<"personality" | "preference" | "knowledge" | "logic">;
  verification: string;
};
