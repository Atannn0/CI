import { t, type UiLocale } from "@/lib/i18n/messages";
import { isQuizLanguage, type QuizLanguage } from "@/lib/languages";
import { bilingualDescriptions } from "@/lib/descriptions";
import { LIMITS } from "@/lib/quiz";

export const CUSTOM_LIMITS = {
  questionsMin: 1,
  questionsMax: 40,
  optionsMin: 2,
  optionsMax: 6,
  prompt: 500,
  option: 300,
} as const;

export type CustomOptionInput = { label: string; isCorrect: boolean };
export type CustomQuestionInput = { prompt: string; options: CustomOptionInput[] };

export type CustomQuizInput = {
  title: string;
  language: QuizLanguage;
  description: string | null;
  descriptionCs: string;
  descriptionEn: string;
  questions: CustomQuestionInput[];
};

export type CustomQuizErrors = {
  title?: string;
  language?: string;
  description?: string;
  questions?: string;
  detail?: string;
};

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed === "" ? null : trimmed;
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

  const description = optionalText(data.description);
  if (description && description.length > LIMITS.description) {
    errors.description = t("errDescriptionTooLong", locale, { n: LIMITS.description });
  }

  const questionsRaw = Array.isArray(data.questions) ? data.questions : [];
  if (questionsRaw.length < CUSTOM_LIMITS.questionsMin) errors.questions = t("errCustomQuestionsMin", locale);
  else if (questionsRaw.length > CUSTOM_LIMITS.questionsMax) errors.questions = t("errCustomQuestionsMax", locale);

  const questions: CustomQuestionInput[] = [];
  if (!errors.questions) {
    for (let i = 0; i < questionsRaw.length; i++) {
      const q = (questionsRaw[i] && typeof questionsRaw[i] === "object" ? questionsRaw[i] : {}) as Record<
        string,
        unknown
      >;
      const prompt = optionalText(q.prompt);
      if (!prompt || prompt.length > CUSTOM_LIMITS.prompt) {
        errors.detail = t("errCustomPrompt", locale, { n: i + 1 });
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
        const label = optionalText(o.label);
        if (!label || label.length > CUSTOM_LIMITS.option) {
          errors.detail = t("errCustomOptionLabel", locale, { n: i + 1 });
          break;
        }
        const isCorrect = o.isCorrect === true;
        if (isCorrect) correct += 1;
        options.push({ label, isCorrect });
      }
      if (errors.detail) break;
      if (correct !== 1) {
        errors.detail = t("errCustomOneCorrect", locale, { n: i + 1 });
        break;
      }
      questions.push({ prompt, options });
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
      description: blurbs.description,
      descriptionCs: blurbs.descriptionCs,
      descriptionEn: blurbs.descriptionEn,
      questions,
    },
  };
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
