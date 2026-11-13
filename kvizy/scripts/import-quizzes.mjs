/**
 * Repeatable catalog import from data/import-quizzes.json (+ optional merge into seed).
 *
 * - Dedupes by normalized url_key
 * - on conflict: keeps id, clicks, and report links (do nothing)
 * - Hides the IDRlabs hub card once individual tests exist
 *
 * Usage (from kvizy/):
 *   npm run import:quizzes              # against DATABASE_URL, or in-memory report only with --dry-run
 *   npm run import:quizzes -- --seed    # also merge into seed-quizzes.json and regenerate 006
 *   npm run import:quizzes -- --dry-run
 */
import { readFile, writeFile } from "node:fs/promises";
import pg from "pg";
import { applyMigrations, pooledDatabaseUrl, readMigrations } from "../src/lib/migrate-core.mjs";

const FORMATS = new Set(["text", "image", "mixed"]);
const TYPES = new Set(["personality", "preference", "knowledge", "logic"]);
const LANG_RE = /^[a-z]{2}$/;

function urlKey(value) {
  const url = new URL(value.trim());
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const port = url.port ? `:${url.port}` : "";
  const path = url.pathname.replace(/\/+$/, "");
  const params = [...url.searchParams.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return `${host}${port}${path}${params ? `?${params}` : ""}`;
}

function validate(q) {
  if (!q.title || !q.url || !FORMATS.has(q.format) || !LANG_RE.test(q.language)) {
    throw new Error(`Invalid import entry: ${q.title ?? q.url}`);
  }
  if (!Array.isArray(q.types) || !q.types.length || !q.types.every((t) => TYPES.has(t))) {
    throw new Error(`Invalid types for ${q.title}`);
  }
  urlKey(q.url);
}

const dryRun = process.argv.includes("--dry-run");
const mergeSeed = process.argv.includes("--seed");

const incoming = JSON.parse(await readFile("data/import-quizzes.json", "utf8"));
for (const q of incoming) validate(q);

const byLang = {};
const bySource = {};
for (const q of incoming) {
  byLang[q.language] = (byLang[q.language] || 0) + 1;
  const source = q.source || "unknown";
  bySource[source] = (bySource[source] || 0) + 1;
}

if (mergeSeed) {
  const seeds = JSON.parse(await readFile("data/seed-quizzes.json", "utf8"));
  const existing = new Set(seeds.map((s) => urlKey(s.url)));
  let added = 0;
  for (const q of incoming) {
    const key = urlKey(q.url);
    if (existing.has(key)) continue;
    existing.add(key);
    seeds.push({
      title: q.title,
      url: q.url,
      language: q.language,
      format: q.format,
      types: q.types,
      topic: q.topic ?? null,
      description: q.description ?? null,
      source: q.source ?? null,
      migration: q.migration ?? "006_seed_idrlabs_ja_zh",
      verification: q.verification ?? { result: "import", checked_at: new Date().toISOString().slice(0, 10) },
    });
    added += 1;
  }
  await writeFile("data/seed-quizzes.json", `${JSON.stringify(seeds, null, 2)}\n`);
  console.log(`seed: merged ${added} new quizzes into data/seed-quizzes.json`);
  const { spawnSync } = await import("node:child_process");
  const gen = spawnSync(process.execPath, ["scripts/build-seed.mjs"], { stdio: "inherit" });
  if (gen.status !== 0) process.exit(gen.status ?? 1);
}

if (dryRun) {
  console.log(`dry-run: ${incoming.length} quizzes`, { byLang, bySource });
  process.exit(0);
}

const databaseUrl = pooledDatabaseUrl();
if (!databaseUrl) {
  console.log("No DATABASE_URL — import JSON is ready; apply via migrations after `npm run import:quizzes -- --seed`.");
  console.log("Counts:", { total: incoming.length, byLang, bySource });
  process.exit(0);
}

const pool = new pg.Pool({ connectionString: databaseUrl, max: 2 });
const client = await pool.connect();
try {
  await applyMigrations(client, await readMigrations(), console.log);
  let inserted = 0;
  let skipped = 0;
  for (const q of incoming) {
    const key = urlKey(q.url);
    const result = await client.query(
      `insert into quizzes (title, url, url_key, description, language, format, types, topic, verified, is_collection, source)
       values ($1,$2,$3,$4,$5,$6,$7,$8,true,false,$9)
       on conflict (url_key) do nothing
       returning id`,
      [q.title, q.url, key, q.description ?? null, q.language, q.format, q.types, q.topic ?? null, q.source ?? null],
    );
    if (result.rowCount) inserted += 1;
    else skipped += 1;
  }
  const hide = await client.query(`update quizzes set hidden = true where url_key = 'idrlabs.com' and hidden = false`);
  console.log(
    JSON.stringify(
      { inserted, skipped, hiddenHub: hide.rowCount, total: incoming.length, byLang, bySource },
      null,
      2,
    ),
  );
} finally {
  client.release();
  await pool.end();
}
