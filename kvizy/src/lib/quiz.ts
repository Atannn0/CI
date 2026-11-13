export const FORMATS = ["image", "text", "mixed"] as const;
export const QUIZ_TYPES = ["personality", "preference", "knowledge", "logic"] as const;
export const LANGUAGES = ["cs", "en"] as const;

export type QuizFormat = (typeof FORMATS)[number];
export type QuizType = (typeof QUIZ_TYPES)[number];
export type QuizLanguage = (typeof LANGUAGES)[number];

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

export const LANGUAGE_LABELS: Record<QuizLanguage, string> = {
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

/** Lowercase and strip diacritics so "Kocka" matches "Kočka". */
export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

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
): { ok: true; value: QuizInput } | { ok: false; errors: QuizInputErrors } {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: QuizInputErrors = {};

  const title = optionalText(data.title);
  if (!title) errors.title = "Vyplň název kvízu.";
  else if (title.length > LIMITS.title) errors.title = `Název může mít nejvýš ${LIMITS.title} znaků.`;

  const urlText = typeof data.url === "string" ? data.url.trim() : "";
  if (!urlText) errors.url = "Vlož přímý odkaz na kvíz.";
  else if (urlText.length > LIMITS.url) errors.url = "Odkaz je příliš dlouhý.";
  else if (!parseHttpUrl(urlText)) errors.url = "Odkaz musí začínat http:// nebo https:// a vést na web.";

  const format = data.format;
  if (!FORMATS.includes(format as QuizFormat)) errors.format = "Vyber formát kvízu.";

  const language = data.language;
  if (!LANGUAGES.includes(language as QuizLanguage)) errors.language = "Vyber jazyk kvízu.";

  const typesRaw = Array.isArray(data.types) ? data.types : [];
  const types = QUIZ_TYPES.filter((t) => typesRaw.includes(t));
  if (types.length === 0) errors.types = "Vyber alespoň jeden typ kvízu.";

  const description = optionalText(data.description);
  if (description && description.length > LIMITS.description)
    errors.description = `Popis může mít nejvýš ${LIMITS.description} znaků.`;

  const topicRaw = optionalText(data.topic);
  const topic = topicRaw ? topicRaw.toLowerCase() : null;
  if (topic && topic.length > LIMITS.topic) errors.topic = `Téma může mít nejvýš ${LIMITS.topic} znaků.`;

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

/** Czech plural: 1 kvíz, 2–4 kvízy, 0 and 5+ kvízů. */
export function pluralQuizzes(count: number): string {
  if (count === 1) return "1 kvíz";
  if (count >= 2 && count <= 4) return `${count} kvízy`;
  return `${count} kvízů`;
}
