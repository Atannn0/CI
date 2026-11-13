import "server-only";
import { randomBytes } from "node:crypto";
import { sql } from "./db";
import {
  collectMediaIds,
  quizTypesForMode,
  slugifyTitle,
  type CustomMode,
  type CustomQuizInput,
} from "./custom-quiz";
import { mediaExists } from "./media-repo";
import { mediaPublicPath } from "./media";
import { QUIZ_COLUMNS, toQuiz } from "./quizzes-repo";
import type { Quiz } from "./quiz";

export type PlayImage = { url: string; alt: string } | null;

export type PlayOption = {
  id: number;
  label: string;
  image: PlayImage;
};

export type PlayQuestion = {
  id: number;
  prompt: string;
  image: PlayImage;
  options: PlayOption[];
};

export type PlayOutcome = {
  key: string;
  title: string;
  description: string;
  image: PlayImage;
};

export type PlayPayload = {
  quiz: Quiz;
  mode: CustomMode;
  questions: PlayQuestion[];
  outcomes: PlayOutcome[];
};

export type GradeResult = {
  mode: CustomMode;
  score?: number;
  total?: number;
  results?: Array<{
    questionId: number;
    prompt: string;
    selectedOptionId: number | null;
    correctOptionId: number;
    correctLabel: string;
    selectedLabel: string | null;
    isCorrect: boolean;
  }>;
  outcome?: PlayOutcome;
  totals?: Record<string, number>;
};

function toPlayImage(mediaId: number | string | null | undefined, alt: string | null | undefined): PlayImage {
  if (mediaId == null || mediaId === "") return null;
  return { url: mediaPublicPath(Number(mediaId)), alt: alt?.trim() || "" };
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugifyTitle(title);
  for (let i = 0; i < 8; i++) {
    const candidate = i === 0 ? `${base}-${randomBytes(2).toString("hex")}` : `${base}-${randomBytes(3).toString("hex")}`;
    const rows = await sql<{ n: number }>("select 1 as n from quizzes where slug = $1 limit 1", [candidate]);
    if (rows.length === 0) return candidate;
  }
  return `${base}-${randomBytes(6).toString("hex")}`;
}

export async function assertMediaIdsExist(ids: number[]): Promise<boolean> {
  for (const id of ids) {
    if (!(await mediaExists(id))) return false;
  }
  return true;
}

export async function createCustomQuiz(
  input: CustomQuizInput,
  origin: string,
): Promise<{ ok: true; quiz: Quiz } | { ok: false; error: "media" }> {
  if (!(await assertMediaIdsExist(collectMediaIds(input)))) return { ok: false, error: "media" };

  const slug = await uniqueSlug(input.title);
  const publicPath = `/hrat/${slug}`;
  const absoluteUrl = `${origin.replace(/\/+$/, "")}${publicPath}`;
  const urlKey = `kvizovna.local/hrat/${slug}`;
  const types = quizTypesForMode(input.mode);

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
       language, format, types, topic, verified, is_collection, source, kind, slug, custom_mode
     ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,null,true,false,'kvizovna','custom',$10,$11)
     returning ${QUIZ_COLUMNS}`,
    [
      input.title,
      absoluteUrl,
      urlKey,
      input.description,
      input.descriptionCs,
      input.descriptionEn,
      input.language,
      input.format,
      types,
      slug,
      input.mode,
    ],
  );
  const quiz = toQuiz(quizRows[0]);

  for (let oi = 0; oi < input.outcomes.length; oi++) {
    const outcome = input.outcomes[oi];
    await sql(
      `insert into custom_quiz_outcomes (quiz_id, position, outcome_key, title, description, image_media_id, image_alt)
       values ($1,$2,$3,$4,$5,$6,$7)`,
      [
        quiz.id,
        oi,
        outcome.key,
        outcome.title,
        outcome.description,
        outcome.image?.mediaId ?? null,
        outcome.image?.alt ?? null,
      ],
    );
  }

  for (let qi = 0; qi < input.questions.length; qi++) {
    const question = input.questions[qi];
    const qRows = await sql<{ id: number | string }>(
      `insert into custom_quiz_questions (quiz_id, position, prompt, image_media_id, image_alt)
       values ($1,$2,$3,$4,$5) returning id`,
      [quiz.id, qi, question.prompt, question.image?.mediaId ?? null, question.image?.alt ?? null],
    );
    const questionId = Number(qRows[0].id);
    for (let oi = 0; oi < question.options.length; oi++) {
      const option = question.options[oi];
      await sql(
        `insert into custom_quiz_options
           (question_id, position, label, is_correct, image_media_id, image_alt, outcome_key, weight)
         values ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          questionId,
          oi,
          option.label,
          option.isCorrect,
          option.image?.mediaId ?? null,
          option.image?.alt ?? null,
          option.outcomeKey,
          option.weight,
        ],
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
    custom_mode: string | null;
  }>(
    `select ${QUIZ_COLUMNS}, custom_mode from quizzes where slug = $1 and kind = 'custom' and hidden = false`,
    [slug],
  );
  if (!quizRows[0]) return null;
  const quiz = toQuiz(quizRows[0]);
  const mode: CustomMode = quizRows[0].custom_mode === "personality" ? "personality" : "knowledge";

  const outcomeRows = await sql<{
    outcome_key: string;
    title: string;
    description: string;
    image_media_id: number | string | null;
    image_alt: string | null;
  }>(
    `select outcome_key, title, description, image_media_id, image_alt
     from custom_quiz_outcomes where quiz_id = $1 order by position, id`,
    [quiz.id],
  );
  const outcomes: PlayOutcome[] = outcomeRows.map((o) => ({
    key: o.outcome_key,
    title: o.title,
    description: o.description,
    image: toPlayImage(o.image_media_id, o.image_alt),
  }));

  const questions = await sql<{
    id: number | string;
    prompt: string;
    position: number;
    image_media_id: number | string | null;
    image_alt: string | null;
  }>(
    `select id, prompt, position, image_media_id, image_alt
     from custom_quiz_questions where quiz_id = $1 order by position, id`,
    [quiz.id],
  );
  const playQuestions: PlayQuestion[] = [];
  for (const q of questions) {
    const options = await sql<{
      id: number | string;
      label: string;
      position: number;
      image_media_id: number | string | null;
      image_alt: string | null;
    }>(
      `select id, label, position, image_media_id, image_alt
       from custom_quiz_options where question_id = $1 order by position, id`,
      [q.id],
    );
    playQuestions.push({
      id: Number(q.id),
      prompt: q.prompt,
      image: toPlayImage(q.image_media_id, q.image_alt),
      options: options.map((o) => ({
        id: Number(o.id),
        label: o.label,
        image: toPlayImage(o.image_media_id, o.image_alt),
      })),
    });
  }
  return { quiz, mode, questions: playQuestions, outcomes };
}

export async function gradeSubmission(
  slug: string,
  answers: Record<string, number>,
): Promise<GradeResult | null> {
  const payload = await loadPlayPayload(slug);
  if (!payload) return null;

  if (payload.mode === "personality") {
    const totals: Record<string, number> = {};
    for (const outcome of payload.outcomes) totals[outcome.key] = 0;

    for (const question of payload.questions) {
      const selectedOptionId = Number.isFinite(answers[String(question.id)])
        ? Number(answers[String(question.id)])
        : null;
      if (selectedOptionId == null) continue;
      const rows = await sql<{ outcome_key: string | null; weight: number | string | null }>(
        `select outcome_key, weight from custom_quiz_options where id = $1 and question_id = $2`,
        [selectedOptionId, question.id],
      );
      const row = rows[0];
      if (!row?.outcome_key || row.weight == null) continue;
      totals[row.outcome_key] = (totals[row.outcome_key] ?? 0) + Number(row.weight);
    }

    let winner = payload.outcomes[0] ?? null;
    let best = -1;
    for (const outcome of payload.outcomes) {
      const score = totals[outcome.key] ?? 0;
      if (score > best) {
        best = score;
        winner = outcome;
      }
    }
    return { mode: "personality", outcome: winner ?? undefined, totals };
  }

  const results: NonNullable<GradeResult["results"]> = [];
  let score = 0;
  for (const question of payload.questions) {
    const correctRows = await sql<{ id: number | string; label: string }>(
      `select id, label from custom_quiz_options where question_id = $1 and is_correct = true limit 1`,
      [question.id],
    );
    const correct = correctRows[0];
    if (!correct) continue;
    const correctOptionId = Number(correct.id);
    const selectedOptionId = Number.isFinite(answers[String(question.id)])
      ? Number(answers[String(question.id)])
      : null;
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
  return { mode: "knowledge", score, total: payload.questions.length, results };
}
