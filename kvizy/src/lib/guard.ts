import "server-only";

/**
 * Browsers always send Origin on cross-site POSTs, so a mismatch means another site is
 * submitting on the visitor's behalf. Requests without Origin (curl, server-side tests) pass.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

type Bucket = { count: number; resetAt: number };
const buckets = ((globalThis as typeof globalThis & { __kvizyRate?: Map<string, Bucket> }).__kvizyRate ??=
  new Map<string, Bucket>());

/** Fixed-window limit per client IP and action, kept in memory per server instance. */
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
