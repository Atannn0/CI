import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_TOKEN_ENV = "KVIZY_ADMIN_TOKEN";
export const ADMIN_TOKEN_MIN_LENGTH = 24;

export type AdminAccess = "closed" | "denied" | "granted";

const digest = (value: string) => createHash("sha256").update(value).digest();

/**
 * Admin endpoints stay closed (as if they did not exist) unless KVIZY_ADMIN_TOKEN holds a long
 * enough secret; a request must then send it as `Authorization: Bearer <token>`.
 */
export function adminAccess(request: Request, env: Record<string, string | undefined> = process.env): AdminAccess {
  const expected = (env[ADMIN_TOKEN_ENV] ?? "").trim();
  if (expected.length < ADMIN_TOKEN_MIN_LENGTH) return "closed";
  const match = /^Bearer\s+(.+)$/i.exec(request.headers.get("authorization") ?? "");
  if (!match) return "denied";
  return timingSafeEqual(digest(match[1].trim()), digest(expected)) ? "granted" : "denied";
}
