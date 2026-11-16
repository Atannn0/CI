// Runs after `next build`. Skips when no database is configured, so local builds still pass.
import pg from "pg";
import { applyMigrations, directDatabaseUrl, readMigrations } from "../src/lib/migrate-core.mjs";

// Preview must not migrate against production. Fail before applying SQL when unset.
if (process.env.VERCEL_ENV === "preview" && process.env.KVIZY_PREVIEW_DB_READY !== "1") {
  console.error(
    "migrate: Preview database is not configured. Set a Neon Preview branch + KVIZY_PREVIEW_DB_READY=1 (see docs/preview-database.md).",
  );
  process.exit(1);
}

const url = directDatabaseUrl();
const migrations = await readMigrations();
if (url === "" || migrations.length === 0) {
  console.log("migrate: nothing to do (no DATABASE_URL)");
  process.exit(0);
}

const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 15_000 });
await client.connect();
try {
  await client.query("set lock_timeout = '60s'");
  const applied = await applyMigrations(client, migrations, console.log);
  if (applied.length === 0) console.log("migrate: database is up to date");
} finally {
  await client.end();
}
