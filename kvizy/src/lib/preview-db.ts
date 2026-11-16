/**
 * Preview deployments must use a dedicated Neon branch/database, not production.
 * Set KVIZY_PREVIEW_DB_READY=1 only after Preview env vars point at that branch
 * (see docs/preview-database.md).
 *
 * Call only from connection helpers (`sql`) and the migrate script — never at module
 * top-level import, or `next build` / collect page data will fail before runtime.
 */
export function assertPreviewDatabaseReady(
  env: Record<string, string | undefined> = process.env,
): void {
  if (env.VERCEL_ENV !== "preview") return;
  if (env.KVIZY_PREVIEW_DB_READY === "1") return;
  throw new Error(
    "Preview database is not configured. Create a Neon branch for Preview, set DATABASE_URL / DATABASE_URL_UNPOOLED to that branch (Sensitive), set KVIZY_PREVIEW_DB_READY=1 for Preview only, then redeploy. See docs/preview-database.md.",
  );
}
