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

export const MAX_BODY_BYTES = 8_000;
