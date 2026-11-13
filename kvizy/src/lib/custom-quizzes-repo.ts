import "server-only";
import { randomBytes } from "node:crypto";
import { sql } from "./db";
import { slugifyTitle, type CustomQuizInput } from "./custom-quiz";
import { QUIZ_COLUMNS, toQuiz } from "./quizzes-repo";
import type { Quiz } from "./quiz";

export type PlayQuestion = {
  id: number;
  prompt: string;
  options: { id: number; label: string }[];
};

export type PlayPayload = {
  quiz: Quiz;
  questions: PlayQuestion[];
};

export type GradeResult = {
  score: number;
  total: number;
  results: Array<{
    questionId: number;
    prompt: string;
    selectedOptionId: number | null;
    correctOptionId: number;
    correctLabel: string;
    selectedLabel: string | null;
    isCorrect: boolean;
  }>;
};

async function uniqueSlug(title: string): Promise<string> {
  const base = slugifyTitle(title);
  for (let i = 0; i < 8; i++) {
    const candidate = i === 0 ? `${base}-${randomBytes(2).toString("hex")}` : `${base}-${randomBytes(3).toString("hex")}`;
    const rows = await sql<{ n: number }>("select 1 as n from quizzes where slug = $1 limit 1", [candidate]);
    if (rows.length === 0) return candidate;
  }
  return `${base}-${randomBytes(6).toString("hex")}`;
}

export async function createCustomQuiz(
  input: CustomQuizInput,
  origin: string,
): Promise<{ ok: true; quiz: Quiz }> {
  const slug = await uniqueSlug(input.title);
  const publicPath = `/hrat/${slug}`;
  const absoluteUrl = `${origin.replace(/\/+$/, "")}${publicPath}`;
  const urlKey = `kvizovna.local/hrat/${slug}`;

  const quizRows = await sql<{
    id: number | string;
    title: string;
    url: string;
    description: string | null;
    description_cs: string | null;
    description_en: string | null;
    language: Quiz["language"];
    format: Quiz["format"];
    types: Quiz["types"];
    topic: string | null;
    is_collection: boolean;
    hidden: boolean;
    source: string | null;
    kind: Quiz["kind"];
    slug: string | null;
    clicks: number | string;
    created_at: Date | string;
  }>(
    `insert into quizzes (
       title, url, url_key, description, description_cs, description_en,
       language, format, types, topic, verified, is_collection, source, kind, slug
     ) values ($1,$2,$3,$4,$5,$6,$7,'text',array['knowledge']::text[],null,true,false,'kvizovna','custom',$8)
     returning ${QUIZ_COLUMNS}`,
    [
      input.title,
      absoluteUrl,
      urlKey,
      input.description,
      input.descriptionCs,
      input.descriptionEn,
      input.language,
      slug,
    ],
  );
  const quiz = toQuiz(quizRows[0]);

  for (let qi = 0; qi < input.questions.length; qi++) {
    const question = input.questions[qi];
    const qRows = await sql<{ id: number | string }>(
      `insert into custom_quiz_questions (quiz_id, position, prompt) values ($1,$2,$3) returning id`,
      [quiz.id, qi, question.prompt],
    );
    const questionId = Number(qRows[0].id);
    for (let oi = 0; oi < question.options.length; oi++) {
      const option = question.options[oi];
      await sql(
        `insert into custom_quiz_options (question_id, position, label, is_correct) values ($1,$2,$3,$4)`,
        [questionId, oi, option.label, option.isCorrect],
      );
    }
  }

  return { ok: true, quiz };
}

export async function loadPlayPayload(slug: string): Promise<PlayPayload | null> {
  const quizRows = await sql<{
    id: number | string;
    title: string;
    url: string;
    description: string | null;
    description_cs: string | null;
    description_en: string | null;
    language: Quiz["language"];
    format: Quiz["format"];
    types: Quiz["types"];
    topic: string | null;
    is_collection: boolean;
    hidden: boolean;
    source: string | null;
    kind: Quiz["kind"];
    slug: string | null;
    clicks: number | string;
    created_at: Date | string;
  }>(`select ${QUIZ_COLUMNS} from quizzes where slug = $1 and kind = 'custom' and hidden = false`, [slug]);
  if (!quizRows[0]) return null;
  const quiz = toQuiz(quizRows[0]);

  const questions = await sql<{ id: number | string; prompt: string; position: number }>(
    `select id, prompt, position from custom_quiz_questions where quiz_id = $1 order by position, id`,
    [quiz.id],
  );
  const playQuestions: PlayQuestion[] = [];
  for (const q of questions) {
    const options = await sql<{ id: number | string; label: string; position: number }>(
      `select id, label, position from custom_quiz_options where question_id = $1 order by position, id`,
      [q.id],
    );
    playQuestions.push({
      id: Number(q.id),
      prompt: q.prompt,
      options: options.map((o) => ({ id: Number(o.id), label: o.label })),
    });
  }
  return { quiz, questions: playQuestions };
}

export async function gradeSubmission(
  slug: string,
  answers: Record<string, number>,
): Promise<GradeResult | null> {
  const payload = await loadPlayPayload(slug);
  if (!payload) return null;

  const results: GradeResult["results"] = [];
  let score = 0;
  for (const question of payload.questions) {
    const correctRows = await sql<{ id: number | string; label: string }>(
      `select id, label from custom_quiz_options where question_id = $1 and is_correct = true limit 1`,
      [question.id],
    );
    const correct = correctRows[0];
    if (!correct) continue;
    const correctOptionId = Number(correct.id);
    const selectedOptionId = Number.isFinite(answers[String(question.id)]) ? Number(answers[String(question.id)]) : null;
    const selected = question.options.find((o) => o.id === selectedOptionId) ?? null;
    const isCorrect = selectedOptionId === correctOptionId;
    if (isCorrect) score += 1;
    results.push({
      questionId: question.id,
      prompt: question.prompt,
      selectedOptionId,
      correctOptionId,
      correctLabel: correct.label,
      selectedLabel: selected?.label ?? null,
      isCorrect,
    });
  }
  return { score, total: payload.questions.length, results };
}
