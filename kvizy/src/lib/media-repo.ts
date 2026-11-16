import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { detectImageMime, MEDIA_LIMITS, type AllowedMime } from "./media";
import { sql } from "./db";

function sha256Hex(buffer: Uint8Array | string): string {
  return createHash("sha256").update(buffer).digest("hex");
}

function hashToken(token: string): string {
  return sha256Hex(token);
}

function tokensMatch(expectedHash: string | null, provided: string | null | undefined): boolean {
  if (!expectedHash || !provided) return false;
  const left = Buffer.from(expectedHash, "utf8");
  const right = Buffer.from(hashToken(provided), "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export type MediaRow = {
  id: number;
  mimeType: AllowedMime;
  byteSize: number;
  sha256: string;
  data: Buffer;
  /** True when attached to a published custom quiz (safe for public cache). */
  isPublic: boolean;
};

/** Store a new draft image. Always inserts a row so each upload gets its own access token. */
export async function storeMedia(
  buffer: Uint8Array,
): Promise<{ ok: true; id: number; mimeType: AllowedMime; accessToken: string } | { ok: false; error: string }> {
  if (buffer.byteLength === 0) return { ok: false, error: "empty" };
  if (buffer.byteLength > MEDIA_LIMITS.maxBytes) return { ok: false, error: "too_large" };
  const mime = detectImageMime(buffer);
  if (!mime) return { ok: false, error: "invalid_type" };
  const hash = sha256Hex(buffer);
  const accessToken = randomBytes(24).toString("base64url");
  const rows = await sql<{ id: number | string }>(
    `insert into quiz_media (mime_type, byte_size, sha256, data, access_token_hash)
     values ($1, $2, $3, $4, $5) returning id`,
    [mime, buffer.byteLength, hash, Buffer.from(buffer), hashToken(accessToken)],
  );
  return { ok: true, id: Number(rows[0].id), mimeType: mime, accessToken };
}

/**
 * Serve media only when:
 * - it is attached to a published (non-hidden) custom quiz, or
 * - the caller presents the draft access token from upload.
 */
export async function getMediaForRequest(
  id: number,
  accessToken: string | null,
): Promise<MediaRow | null> {
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  const rows = await sql<{
    id: number | string;
    mime_type: AllowedMime;
    byte_size: number | string;
    sha256: string;
    data: Buffer | Uint8Array | string;
    access_token_hash: string | null;
    quiz_id: number | string | null;
    quiz_hidden: boolean | null;
    quiz_kind: string | null;
  }>(
    `select m.id, m.mime_type, m.byte_size, m.sha256, m.data, m.access_token_hash, m.quiz_id,
            q.hidden as quiz_hidden, q.kind as quiz_kind
     from quiz_media m
     left join quizzes q on q.id = m.quiz_id
     where m.id = $1`,
    [id],
  );
  const row = rows[0];
  if (!row) return null;

  const published =
    row.quiz_id != null && row.quiz_kind === "custom" && row.quiz_hidden === false;
  const draftOk = tokensMatch(row.access_token_hash, accessToken);
  if (!published && !draftOk) return null;

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
    isPublic: published,
  };
}

/** Verify media IDs exist and each draft is presented with its upload token (or already owned by quiz). */
export async function assertMediaOwned(
  items: Array<{ mediaId: number; accessToken: string }>,
): Promise<boolean> {
  for (const item of items) {
    const rows = await sql<{
      access_token_hash: string | null;
      quiz_id: number | string | null;
    }>("select access_token_hash, quiz_id from quiz_media where id = $1", [item.mediaId]);
    const row = rows[0];
    if (!row) return false;
    if (row.quiz_id != null) return false; // already attached to another quiz — cannot steal
    if (!tokensMatch(row.access_token_hash, item.accessToken)) return false;
  }
  return true;
}

export async function attachMediaToQuiz(quizId: number, mediaIds: number[]): Promise<void> {
  const unique = [...new Set(mediaIds)];
  for (const id of unique) {
    await sql(`update quiz_media set quiz_id = $1 where id = $2 and quiz_id is null`, [quizId, id]);
  }
}

export async function mediaExists(id: number): Promise<boolean> {
  const rows = await sql<{ n: number }>("select 1 as n from quiz_media where id = $1 limit 1", [id]);
  return rows.length > 0;
}

export function mediaDraftUrl(id: number, accessToken: string): string {
  return `/api/media/${id}?access=${encodeURIComponent(accessToken)}`;
}

export function mediaPublicUrl(id: number): string {
  return `/api/media/${id}`;
}
