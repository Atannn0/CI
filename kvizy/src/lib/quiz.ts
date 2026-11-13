import { t, type UiLocale } from "@/lib/i18n/messages";
import { isQuizLanguage, type QuizLanguage } from "@/lib/languages";

export { normalizeText } from "@/lib/quiz-text";
export { QUIZ_LANGUAGES as LANGUAGES, type QuizLanguage } from "@/lib/languages";

export const FORMATS = ["image", "text", "mixed"] as const;
export const QUIZ_TYPES = ["personality", "preference", "knowledge", "logic"] as const;

export type QuizFormat = (typeof FORMATS)[number];
export type QuizType = (typeof QUIZ_TYPES)[number];

export const FORMAT_LABEL_KEYS = {
  image: "formatImage",
  text: "formatText",
  mixed: "formatMixed",
} as const;

export const TYPE_LABEL_KEYS = {
  personality: "typePersonality",
  preference: "typePreference",
  knowledge: "typeKnowledge",
  logic: "typeLogic",
} as const;

/** Czech labels kept for unit tests and non-React callers; UI prefers `t(...)`. */
export const FORMAT_LABELS: Record<QuizFormat, string> = {
  image: "Obrázkový",
  text: "Textový",
  mixed: "Kombinovaný",
};

export const TYPE_LABELS: Record<QuizType, string> = {
  personality: "Osobnostní",
  preference: "Preferenční",
  knowledge: "Znalostní",
  logic: "Logický a hádankový",
};

export const LANGUAGE_LABELS: Record<"cs" | "en", string> = {
  cs: "Čeština",
  en: "Angličtina",
};

export type Quiz = {
  id: number;
  title: string;
  url: string;
  description: string | null;
  language: QuizLanguage;
  format: QuizFormat;
  types: QuizType[];
  topic: string | null;
  /** The link leads to a hub of several tests rather than to one quiz. */
  isCollection: boolean;
  /** Soft-hidden from the public catalog (e.g. replaced hub card). */
  hidden: boolean;
  source: string | null;
  clicks: number;
  createdAt: string;
};

export type QuizInput = {
  title: string;
  url: string;
  description: string | null;
  language: QuizLanguage;
  format: QuizFormat;
  types: QuizType[];
  topic: string | null;
};

export type QuizInputErrors = Partial<Record<keyof QuizInput, string>>;

export const LIMITS = { title: 120, url: 2000, description: 300, topic: 40 } as const;

/** Returns null unless the value is an absolute http(s) URL. */
export function parseHttpUrl(value: string): URL | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".") && url.hostname !== "localhost") return null;
    return url;
  } catch {
    return null;
  }
}

/**
 * Key used to detect the same quiz submitted twice: ignores the scheme, a leading
 * "www.", the fragment, a trailing slash and the order of query parameters.
 */
export function urlKey(value: string): string | null {
  const url = parseHttpUrl(value);
  if (!url) return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const port = url.port ? `:${url.port}` : "";
  const path = url.pathname.replace(/\/+$/, "");
  const params = [...url.searchParams.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return `${host}${port}${path}${params ? `?${params}` : ""}`;
}

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed === "" ? null : trimmed;
}

export function validateQuizInput(
  raw: unknown,
  locale: UiLocale = "cs",
): { ok: true; value: QuizInput } | { ok: false; errors: QuizInputErrors } {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: QuizInputErrors = {};

  const title = optionalText(data.title);
  if (!title) errors.title = t("errTitleRequired", locale);
  else if (title.length > LIMITS.title) errors.title = t("errTitleTooLong", locale, { n: LIMITS.title });

  const urlText = typeof data.url === "string" ? data.url.trim() : "";
  if (!urlText) errors.url = t("errUrlRequired", locale);
  else if (urlText.length > LIMITS.url) errors.url = t("errUrlTooLong", locale);
  else if (!parseHttpUrl(urlText)) errors.url = t("errUrlInvalid", locale);

  const format = data.format;
  if (!FORMATS.includes(format as QuizFormat)) errors.format = t("errFormat", locale);

  const language = data.language;
  if (!isQuizLanguage(language)) errors.language = t("errLanguage", locale);

  const typesRaw = Array.isArray(data.types) ? data.types : [];
  const types = QUIZ_TYPES.filter((x) => typesRaw.includes(x));
  if (types.length === 0) errors.types = t("errTypes", locale);

  const description = optionalText(data.description);
  if (description && description.length > LIMITS.description)
    errors.description = t("errDescriptionTooLong", locale, { n: LIMITS.description });

  const topicRaw = optionalText(data.topic);
  const topic = topicRaw ? topicRaw.toLowerCase() : null;
  if (topic && topic.length > LIMITS.topic) errors.topic = t("errTopicTooLong", locale, { n: LIMITS.topic });

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      title: title!,
      url: parseHttpUrl(urlText)!.toString(),
      description,
      language: language as QuizLanguage,
      format: format as QuizFormat,
      types,
      topic,
    },
  };
}

/** Czech plural kept for backwards-compatible imports; prefer i18n `pluralQuizzes`. */
export function pluralQuizzes(count: number): string {
  if (count === 1) return "1 kvíz";
  if (count >= 2 && count <= 4) return `${count} kvízy`;
  return `${count} kvízů`;
}
