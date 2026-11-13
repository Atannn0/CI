import "server-only";
import { createHash } from "node:crypto";
import { detectImageMime, MEDIA_LIMITS, type AllowedMime } from "./media";
import { sql } from "./db";

function sha256Hex(buffer: Uint8Array): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export type MediaRow = {
  id: number;
  mimeType: AllowedMime;
  byteSize: number;
  sha256: string;
  data: Buffer;
};

export async function storeMedia(buffer: Uint8Array): Promise<{ ok: true; id: number; mimeType: AllowedMime } | { ok: false; error: string }> {
  if (buffer.byteLength === 0) return { ok: false, error: "empty" };
  if (buffer.byteLength > MEDIA_LIMITS.maxBytes) return { ok: false, error: "too_large" };
  const mime = detectImageMime(buffer);
  if (!mime) return { ok: false, error: "invalid_type" };
  const hash = sha256Hex(buffer);
  const existing = await sql<{ id: number | string }>("select id from quiz_media where sha256 = $1 limit 1", [hash]);
  if (existing[0]) return { ok: true, id: Number(existing[0].id), mimeType: mime };

  const rows = await sql<{ id: number | string }>(
    `insert into quiz_media (mime_type, byte_size, sha256, data) values ($1, $2, $3, $4) returning id`,
    [mime, buffer.byteLength, hash, Buffer.from(buffer)],
  );
  return { ok: true, id: Number(rows[0].id), mimeType: mime };
}

export async function getMedia(id: number): Promise<MediaRow | null> {
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  const rows = await sql<{
    id: number | string;
    mime_type: AllowedMime;
    byte_size: number | string;
    sha256: string;
    data: Buffer | Uint8Array | string;
  }>("select id, mime_type, byte_size, sha256, data from quiz_media where id = $1", [id]);
  const row = rows[0];
  if (!row) return null;
  const data = Buffer.isBuffer(row.data)
    ? row.data
    : typeof row.data === "string"
      ? Buffer.from(row.data, "base64")
      : Buffer.from(row.data);
  return {
    id: Number(row.id),
    mimeType: row.mime_type,
    byteSize: Number(row.byte_size),
    sha256: row.sha256,
    data,
  };
}

export async function mediaExists(id: number): Promise<boolean> {
  const rows = await sql<{ n: number }>("select 1 as n from quiz_media where id = $1 limit 1", [id]);
  return rows.length > 0;
}
