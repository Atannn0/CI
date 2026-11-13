import "server-only";
import { isUniqueViolation, sql } from "./db";
import { urlKey, type Quiz, type QuizInput } from "./quiz";

type QuizRow = {
  id: number | string;
  title: string;
  url: string;
  description: string | null;
  language: Quiz["language"];
  format: Quiz["format"];
  types: Quiz["types"];
  topic: string | null;
  clicks: number | string;
  created_at: Date | string;
};

const COLUMNS = "id, title, url, description, language, format, types, topic, clicks, created_at";

function toQuiz(row: QuizRow): Quiz {
  return {
    id: Number(row.id),
    title: row.title,
    url: row.url,
    description: row.description,
    language: row.language,
    format: row.format,
    types: row.types,
    topic: row.topic,
    clicks: Number(row.clicks),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function listQuizzes(): Promise<Quiz[]> {
  const rows = await sql<QuizRow>(`select ${COLUMNS} from quizzes order by created_at desc, id desc`);
  return rows.map(toQuiz);
}

export async function findByUrl(url: string): Promise<Quiz | null> {
  const key = urlKey(url);
  if (!key) return null;
  const rows = await sql<QuizRow>(`select ${COLUMNS} from quizzes where url_key = $1`, [key]);
  return rows[0] ? toQuiz(rows[0]) : null;
}

export type CreateResult = { ok: true; quiz: Quiz } | { ok: false; duplicate: Quiz | null };

export async function createQuiz(input: QuizInput): Promise<CreateResult> {
  const existing = await findByUrl(input.url);
  if (existing) return { ok: false, duplicate: existing };
  try {
    const rows = await sql<QuizRow>(
      `insert into quizzes (title, url, url_key, description, language, format, types, topic)
       values ($1, $2, $3, $4, $5, $6, $7, $8)
       returning ${COLUMNS}`,
      [input.title, input.url, urlKey(input.url), input.description, input.language, input.format, input.types, input.topic],
    );
    return { ok: true, quiz: toQuiz(rows[0]) };
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, duplicate: await findByUrl(input.url) };
    throw error;
  }
}

export async function registerClick(id: number): Promise<number | null> {
  const rows = await sql<{ clicks: number | string }>(
    "update quizzes set clicks = clicks + 1 where id = $1 returning clicks",
    [id],
  );
  return rows[0] ? Number(rows[0].clicks) : null;
}
