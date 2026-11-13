/**
 * Browsers always send Origin on cross-site POSTs, so a mismatch means another site is
 * submitting on the visitor's behalf. Requests without Origin (curl, server-side tests) pass.
 * Behind Vercel's proxy the public host (production, preview or custom domain) arrives in
 * x-forwarded-host and host; either may match.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  let originHost: string;
  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }
  const hosts = [request.headers.get("x-forwarded-host"), request.headers.get("host")]
    .flatMap((value) => (value ? value.split(",") : []))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return hosts.includes(originHost);
}

type Bucket = { count: number; resetAt: number };
const buckets = ((globalThis as typeof globalThis & { __kvizyRate?: Map<string, Bucket> }).__kvizyRate ??=
  new Map<string, Bucket>());

/** Fixed-window quotas for public write endpoints (per IP, per process instance). */
const e2e = process.env.KVIZY_E2E === "1";
export const RATE_LIMITS = {
  // E2E suite creates many quizzes in one worker; keep production burst brake tight.
  create: { limit: e2e ? 80 : 10, windowMs: 60_000 },
  click: { limit: e2e ? 200 : 60, windowMs: 60_000 },
  report: { limit: 10, windowMs: 10 * 60_000 },
  admin: { limit: 20, windowMs: 60_000 },
} as const;

/**
 * Fixed-window limit per client IP and action. Kept in memory, so on serverless hosting it is
 * per instance: a brake on bursts, not a global quota.
 */
export function isRateLimited(request: Request, action: string, limit: number, windowMs: number): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  const key = `${action}:${ip}`;
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}

/** Test helper: clears in-memory rate-limit buckets between cases. */
export function resetRateLimitsForTests(): void {
  buckets.clear();
}

export const MAX_BODY_BYTES = 8_000;

/** Public catalog writes that are not allowed (update/delete/set clicks). */
export function methodNotAllowed(allow: string): Response {
  return Response.json(
    { error: "method_not_allowed", message: "Tato operace není povolená." },
    { status: 405, headers: { Allow: allow } },
  );
}

/** Generic 500 that never echoes DB or env details to the client. */
export function safeServerError(message = "Něco se nepovedlo. Zkus to znovu."): Response {
  return Response.json({ error: "server_error", message }, { status: 500 });
}
