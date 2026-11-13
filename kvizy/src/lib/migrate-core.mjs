// Shared by the build step (scripts/migrate.mjs) and the app's first database request (src/lib/db.ts),
// so whichever runs first applies the migrations and the other finds nothing to do.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const LOCK_KEY = 7272741;

/** @returns {Promise<{ name: string, sql: string }[]>} */
export async function readMigrations() {
  // Paths stay literal under migrations/ so the bundler traces only that folder.
  const names = (await readdir(path.join(process.cwd(), "migrations")).catch(() => []))
    .filter((f) => f.endsWith(".sql"))
    .sort();
  return Promise.all(
    names.map(async (name) => ({ name, sql: await readFile(path.join(process.cwd(), "migrations", name), "utf8") })),
  );
}

/**
 * Applies pending migrations, each in its own transaction. A transaction-scoped advisory lock
 * serialises concurrent runners and, unlike a session lock, is safe behind a transaction pooler
 * such as Neon's PgBouncer.
 *
 * @param {{ query: (text: string, params?: unknown[]) => Promise<{ rows: any[] }> }} client a single connection
 * @param {{ name: string, sql: string }[]} migrations
 * @param {(message: string) => void} [log]
 * @returns {Promise<string[]>} names of the migrations applied by this call
 */
export async function applyMigrations(client, migrations, log = () => {}) {
  if (migrations.length === 0) return [];
  const pending = await pendingMigrations(client, migrations);
  if (pending.length === 0) return [];

  await inTransaction(client, async () => {
    await client.query(
      "create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())",
    );
  });

  const applied = [];
  for (const migration of pending) {
    await inTransaction(client, async () => {
      const done = await client.query("select 1 from schema_migrations where name = $1", [migration.name]);
      if (done.rows.length > 0) return;
      await client.query(migration.sql);
      await client.query("insert into schema_migrations (name) values ($1)", [migration.name]);
      applied.push(migration.name);
      log(`migrate: applied ${migration.name}`);
    });
  }
  return applied;
}

async function pendingMigrations(client, migrations) {
  try {
    const { rows } = await client.query("select name from schema_migrations");
    const done = new Set(rows.map((r) => r.name));
    return migrations.filter((m) => !done.has(m.name));
  } catch (error) {
    if (error && error.code === "42P01") return migrations;
    throw error;
  }
}

async function inTransaction(client, fn) {
  await client.query("begin");
  try {
    await client.query("select pg_advisory_xact_lock($1)", [LOCK_KEY]);
    await fn();
    await client.query("commit");
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  }
}

/** Neon on Vercel sets DATABASE_URL (pooled); POSTGRES_URL is the legacy name for the same thing. */
export function pooledDatabaseUrl(env = process.env) {
  return (env.DATABASE_URL || env.POSTGRES_URL || "").trim();
}

/** Direct connection for one-off scripts, falling back to the pooled one. */
export function directDatabaseUrl(env = process.env) {
  return (env.DATABASE_URL_UNPOOLED || env.POSTGRES_URL_NON_POOLING || pooledDatabaseUrl(env)).trim();
}
