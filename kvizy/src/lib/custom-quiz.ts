import { t, type UiLocale } from "@/lib/i18n/messages";
import { isQuizLanguage, type QuizLanguage } from "@/lib/languages";
import { bilingualDescriptions } from "@/lib/descriptions";
import { FORMATS, LIMITS, type QuizFormat, type QuizType } from "@/lib/quiz";

export const CUSTOM_LIMITS = {
  questionsMin: 1,
  questionsMax: 40,
  optionsMin: 2,
  optionsMax: 6,
  prompt: 500,
  option: 300,
  outcomesMin: 2,
  outcomesMax: 12,
  outcomeTitle: 120,
  outcomeDescription: 500,
  weightMin: 1,
  weightMax: 5,
  altMax: 200,
} as const;

export type CustomMode = "knowledge" | "personality";

export type CustomImageInput = {
  mediaId: number;
  alt: string;
};

export type CustomOptionInput = {
  label: string;
  isCorrect: boolean;
  outcomeKey: string | null;
  weight: number | null;
  image: CustomImageInput | null;
};

export type CustomQuestionInput = {
  prompt: string;
  image: CustomImageInput | null;
  options: CustomOptionInput[];
};

export type CustomOutcomeInput = {
  key: string;
  title: string;
  description: string;
  image: CustomImageInput | null;
};

export type CustomQuizInput = {
  title: string;
  language: QuizLanguage;
  format: QuizFormat;
  mode: CustomMode;
  description: string | null;
  descriptionCs: string;
  descriptionEn: string;
  outcomes: CustomOutcomeInput[];
  questions: CustomQuestionInput[];
};

export type CustomQuizErrors = {
  title?: string;
  language?: string;
  format?: string;
  mode?: string;
  description?: string;
  outcomes?: string;
  questions?: string;
  detail?: string;
};

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed === "" ? null : trimmed;
}

function parseImage(
  raw: unknown,
  locale: UiLocale,
): { ok: true; value: CustomImageInput | null } | { ok: false; error: string } {
  if (raw == null) return { ok: true, value: null };
  if (typeof raw !== "object") return { ok: false, error: t("errCustomImage", locale) };
  const data = raw as Record<string, unknown>;
  const mediaId = Number(data.mediaId);
  if (!Number.isSafeInteger(mediaId) || mediaId <= 0) return { ok: false, error: t("errCustomImage", locale) };
  const alt = optionalText(data.alt);
  if (!alt || alt.length > CUSTOM_LIMITS.altMax) return { ok: false, error: t("errCustomImageAlt", locale) };
  return { ok: true, value: { mediaId, alt } };
}

export function collectMediaIds(input: CustomQuizInput): number[] {
  const ids = new Set<number>();
  for (const outcome of input.outcomes) if (outcome.image) ids.add(outcome.image.mediaId);
  for (const question of input.questions) {
    if (question.image) ids.add(question.image.mediaId);
    for (const option of question.options) if (option.image) ids.add(option.image.mediaId);
  }
  return [...ids];
}

export function validateCustomQuizInput(
  raw: unknown,
  locale: UiLocale = "cs",
): { ok: true; value: CustomQuizInput } | { ok: false; errors: CustomQuizErrors } {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: CustomQuizErrors = {};

  const title = optionalText(data.title);
  if (!title) errors.title = t("errTitleRequired", locale);
  else if (title.length > LIMITS.title) errors.title = t("errTitleTooLong", locale, { n: LIMITS.title });

  const language = data.language;
  if (!isQuizLanguage(language)) errors.language = t("errLanguage", locale);

  const format = data.format ?? "text";
  if (!FORMATS.includes(format as QuizFormat)) errors.format = t("errFormat", locale);

  const mode = data.mode === "personality" ? "personality" : data.mode === "knowledge" ? "knowledge" : null;
  if (!mode) errors.mode = t("errCustomMode", locale);

  const description = optionalText(data.description);
  if (description && description.length > LIMITS.description) {
    errors.description = t("errDescriptionTooLong", locale, { n: LIMITS.description });
  }

  const outcomes: CustomOutcomeInput[] = [];
  const outcomeKeys = new Set<string>();
  if (mode === "personality") {
    const outcomesRaw = Array.isArray(data.outcomes) ? data.outcomes : [];
    if (outcomesRaw.length < CUSTOM_LIMITS.outcomesMin) errors.outcomes = t("errCustomOutcomesMin", locale);
    else if (outcomesRaw.length > CUSTOM_LIMITS.outcomesMax) errors.outcomes = t("errCustomOutcomesMax", locale);
    else {
      for (let i = 0; i < outcomesRaw.length; i++) {
        const o = (outcomesRaw[i] && typeof outcomesRaw[i] === "object" ? outcomesRaw[i] : {}) as Record<
          string,
          unknown
        >;
        const key = optionalText(o.key) ?? `o${i + 1}`;
        const outcomeTitle = optionalText(o.title);
        const outcomeDescription = optionalText(o.description);
        if (!outcomeTitle || outcomeTitle.length > CUSTOM_LIMITS.outcomeTitle) {
          errors.detail = t("errCustomOutcomeTitle", locale, { n: i + 1 });
          break;
        }
        if (!outcomeDescription || outcomeDescription.length > CUSTOM_LIMITS.outcomeDescription) {
          errors.detail = t("errCustomOutcomeDesc", locale, { n: i + 1 });
          break;
        }
        if (outcomeKeys.has(key)) {
          errors.detail = t("errCustomOutcomeDup", locale);
          break;
        }
        const image = parseImage(o.image, locale);
        if (!image.ok) {
          errors.detail = image.error;
          break;
        }
        outcomeKeys.add(key);
        outcomes.push({ key, title: outcomeTitle, description: outcomeDescription, image: image.value });
      }
    }
  }

  const questionsRaw = Array.isArray(data.questions) ? data.questions : [];
  if (questionsRaw.length < CUSTOM_LIMITS.questionsMin) errors.questions = t("errCustomQuestionsMin", locale);
  else if (questionsRaw.length > CUSTOM_LIMITS.questionsMax) errors.questions = t("errCustomQuestionsMax", locale);

  const questions: CustomQuestionInput[] = [];
  if (!errors.questions && !errors.detail && !errors.outcomes) {
    for (let i = 0; i < questionsRaw.length; i++) {
      const q = (questionsRaw[i] && typeof questionsRaw[i] === "object" ? questionsRaw[i] : {}) as Record<
        string,
        unknown
      >;
      const prompt = optionalText(q.prompt) ?? "";
      if (prompt.length > CUSTOM_LIMITS.prompt) {
        errors.detail = t("errCustomPrompt", locale, { n: i + 1 });
        break;
      }
      const qImage = parseImage(q.image, locale);
      if (!qImage.ok) {
        errors.detail = qImage.error;
        break;
      }
      if (!prompt && !qImage.value) {
        errors.detail = t("errCustomPromptOrImage", locale, { n: i + 1 });
        break;
      }
      const optionsRaw = Array.isArray(q.options) ? q.options : [];
      if (optionsRaw.length < CUSTOM_LIMITS.optionsMin || optionsRaw.length > CUSTOM_LIMITS.optionsMax) {
        errors.detail = t("errCustomOptionsCount", locale, { n: i + 1 });
        break;
      }
      const options: CustomOptionInput[] = [];
      let correct = 0;
      for (const opt of optionsRaw) {
        const o = (opt && typeof opt === "object" ? opt : {}) as Record<string, unknown>;
        const label = optionalText(o.label) ?? "";
        if (label.length > CUSTOM_LIMITS.option) {
          errors.detail = t("errCustomOptionLabel", locale, { n: i + 1 });
          break;
        }
        const oImage = parseImage(o.image, locale);
        if (!oImage.ok) {
          errors.detail = oImage.error;
          break;
        }
        if (!label && !oImage.value) {
          errors.detail = t("errCustomOptionOrImage", locale, { n: i + 1 });
          break;
        }
        if (mode === "knowledge") {
          const isCorrect = o.isCorrect === true;
          if (isCorrect) correct += 1;
          options.push({ label, isCorrect, outcomeKey: null, weight: null, image: oImage.value });
        } else {
          const outcomeKey = optionalText(o.outcomeKey);
          if (!outcomeKey || !outcomeKeys.has(outcomeKey)) {
            errors.detail = t("errCustomOptionOutcome", locale, { n: i + 1 });
            break;
          }
          const weight = Number(o.weight ?? 1);
          if (!Number.isInteger(weight) || weight < CUSTOM_LIMITS.weightMin || weight > CUSTOM_LIMITS.weightMax) {
            errors.detail = t("errCustomOptionWeight", locale, { n: i + 1 });
            break;
          }
          options.push({ label, isCorrect: false, outcomeKey, weight, image: oImage.value });
        }
      }
      if (errors.detail) break;
      if (mode === "knowledge" && correct !== 1) {
        errors.detail = t("errCustomOneCorrect", locale, { n: i + 1 });
        break;
      }
      questions.push({ prompt, image: qImage.value, options });
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  const blurbs = bilingualDescriptions(title!, description, {
    cs: typeof data.descriptionCs === "string" ? data.descriptionCs : null,
    en: typeof data.descriptionEn === "string" ? data.descriptionEn : null,
  });
  return {
    ok: true,
    value: {
      title: title!,
      language: language as QuizLanguage,
      format: format as QuizFormat,
      mode: mode!,
      description: blurbs.description,
      descriptionCs: blurbs.descriptionCs,
      descriptionEn: blurbs.descriptionEn,
      outcomes,
      questions,
    },
  };
}

export function quizTypesForMode(mode: CustomMode): QuizType[] {
  return mode === "personality" ? ["personality"] : ["knowledge"];
}

export function slugifyTitle(title: string): string {
  const base = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || "kviz";
}

/** Client-side preview scoring for personality drafts (same tie-break as server: first in list wins). */
export function scorePersonalityDraft(
  outcomes: CustomOutcomeInput[],
  questions: CustomQuestionInput[],
  answers: Record<number, number>,
): CustomOutcomeInput | null {
  const totals = new Map<string, number>();
  for (const outcome of outcomes) totals.set(outcome.key, 0);
  for (let qi = 0; qi < questions.length; qi++) {
    const selected = answers[qi];
    const option = questions[qi]?.options[selected];
    if (!option?.outcomeKey || option.weight == null) continue;
    totals.set(option.outcomeKey, (totals.get(option.outcomeKey) ?? 0) + option.weight);
  }
  let winner: CustomOutcomeInput | null = null;
  let best = -1;
  for (const outcome of outcomes) {
    const score = totals.get(outcome.key) ?? 0;
    if (score > best) {
      best = score;
      winner = outcome;
    }
  }
  return winner;
}

export function scoreKnowledgeDraft(
  questions: CustomQuestionInput[],
  answers: Record<number, number>,
): { score: number; total: number; details: Array<{ correct: boolean; correctIndex: number }> } {
  let score = 0;
  const details = questions.map((question, qi) => {
    const correctIndex = question.options.findIndex((o) => o.isCorrect);
    const correct = answers[qi] === correctIndex;
    if (correct) score += 1;
    return { correct, correctIndex };
  });
  return { score, total: questions.length, details };
}
