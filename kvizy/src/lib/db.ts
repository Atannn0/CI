import "server-only";
import { readdir, readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";

// Next.js may load this module once per route bundle; keep one connection per process
// so pages and API routes share the same in-memory PGlite during local development.
const store = globalThis as typeof globalThis & {
  __kvizyPool?: pg.Pool;
  __kvizyLocal?: Promise<PGlite>;
};

export async function sql<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  if (databaseUrl !== "") {
    store.__kvizyPool ??= new pg.Pool({ connectionString: databaseUrl, max: 5 });
    return (await store.__kvizyPool.query(text, params)).rows as T[];
  }
  store.__kvizyLocal ??= startLocal().catch((error: unknown) => {
    store.__kvizyLocal = undefined;
    throw error;
  });
  return (await (await store.__kvizyLocal).query<T>(text, params)).rows;
}

async function startLocal(): Promise<PGlite> {
  const db = new PGlite();
  const files = (await readdir("migrations").catch(() => [])).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    await db.exec(await readFile(`migrations/${file}`, "utf8"));
  }
  return db;
}

export function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "23505";
}
