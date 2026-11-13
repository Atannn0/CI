import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { describe, expect, it } from "vitest";
import { applyMigrations, readMigrations, type MigrationClient } from "./migrate-core.mjs";
import { urlKey } from "./quiz";

const REQUESTED_LINKS = [
  "https://www.idrlabs.com/",
  "https://mytype.fyi/type",
  "https://programs.clearerthinking.org/who_attracts_you_study.html",
  "https://www.16personalities.com/",
  "https://9axes.github.io/",
];

/** pg-like client over PGlite: parameterless queries may hold several statements, as with pg. */
function client(db: PGlite): MigrationClient {
  return {
    async query(text: string, params?: unknown[]) {
      if (params && params.length > 0) return db.query<Record<string, unknown>>(text, params);
      const results = await db.exec(text);
      return { rows: (results[results.length - 1]?.rows ?? []) as Record<string, unknown>[] };
    },
  };
}

async function count(db: PGlite, where = "true", params: unknown[] = []) {
  const { rows } = await db.query<{ n: number }>(`select count(*)::int as n from quizzes where ${where}`, params);
  return rows[0].n;
}

describe("migrations", () => {
  it("apply once, then find nothing to do", async () => {
    const db = new PGlite();
    const migrations = await readMigrations();
    expect(await applyMigrations(client(db), migrations)).toEqual(migrations.map((m) => m.name));
    expect(await applyMigrations(client(db), migrations)).toEqual([]);
  });

  it("re-running every seed import adds no duplicates", async () => {
    const db = new PGlite();
    const migrations = await readMigrations();
    await applyMigrations(client(db), migrations);
    const before = await count(db);
    const seeds = JSON.parse(await readFile("data/seed-quizzes.json", "utf8")) as unknown[];
    expect(before).toBe(seeds.length);

    for (const migration of migrations.filter((m) => /_seed_/.test(m.name))) await db.exec(migration.sql);
    expect(await count(db)).toBe(before);
  });

  it("contains each requested link exactly once, with collections flagged", async () => {
    const db = new PGlite();
    await applyMigrations(client(db), await readMigrations());
    const seeds = JSON.parse(await readFile("data/seed-quizzes.json", "utf8")) as { url: string; is_collection?: boolean }[];
    for (const link of REQUESTED_LINKS) {
      const key = urlKey(link)!;
      const { rows } = await db.query<{ is_collection: boolean; hidden: boolean }>(
        "select is_collection, hidden from quizzes where url_key = $1",
        [key],
      );
      expect(rows, link).toHaveLength(1);
      const seed = seeds.find((s) => urlKey(s.url) === key);
      expect(rows[0].is_collection, link).toBe(seed?.is_collection ?? false);
      if (link === "https://www.idrlabs.com/") expect(rows[0].hidden).toBe(true);
    }
  });

  it("imports IDRlabs individuals and ja/zh quizzes without duplicates on re-run", async () => {
    const db = new PGlite();
    await applyMigrations(client(db), await readMigrations());
    const before = await count(db);
    const imports = JSON.parse(await readFile("data/import-quizzes.json", "utf8")) as { url: string; language: string }[];
    expect(imports.filter((q) => q.language === "ja").length).toBeGreaterThanOrEqual(4);
    expect(imports.filter((q) => q.language === "zh").length).toBeGreaterThanOrEqual(4);
    expect(await count(db, "language = 'ja'")).toBeGreaterThanOrEqual(4);
    expect(await count(db, "language = 'zh'")).toBeGreaterThanOrEqual(4);
    expect(await count(db, "url_key like 'idrlabs.com/%'")).toBeGreaterThanOrEqual(10);
    for (const migration of (await readMigrations()).filter((m) => /_seed_/.test(m.name))) await db.exec(migration.sql);
    expect(await count(db)).toBe(before);
  });

  it("keeps a reported quiz and rejects a Jiné report without a note", async () => {
    const db = new PGlite();
    await applyMigrations(client(db), await readMigrations());
    const { rows } = await db.query<{ id: number }>("select id from quizzes order by id limit 1");
    const id = rows[0].id;
    await db.query("insert into quiz_reports (quiz_id, reason, note) values ($1, 'broken_link', null)", [id]);
    await expect(db.query("insert into quiz_reports (quiz_id, reason) values ($1, 'other')", [id])).rejects.toThrow();
    await expect(db.query("insert into quiz_reports (quiz_id, reason) values ($1, 'spam')", [id])).rejects.toThrow();
    expect(await count(db, "id = $1", [id])).toBe(1);
  });
});
