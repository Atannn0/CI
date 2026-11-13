import { normalizeText } from "./quiz-text";

/** Stable ISO-ish codes accepted when adding a quiz. */
export const QUIZ_LANGUAGES = [
  "cs",
  "en",
  "sk",
  "de",
  "pl",
  "fr",
  "es",
  "it",
  "pt",
  "nl",
  "ru",
  "uk",
  "ja",
  "zh",
  "ko",
  "hu",
  "ro",
  "sv",
  "da",
  "fi",
  "no",
  "el",
  "tr",
  "ar",
  "he",
  "hi",
  "th",
  "vi",
  "id",
  "ms",
  "bg",
  "hr",
  "sr",
  "sl",
  "lt",
  "lv",
  "et",
] as const;

export type QuizLanguage = (typeof QUIZ_LANGUAGES)[number];

const ALLOWED = new Set<string>(QUIZ_LANGUAGES);

export function isQuizLanguage(value: unknown): value is QuizLanguage {
  return typeof value === "string" && ALLOWED.has(value);
}

/** Chip / badge code shown next to the language name. */
export function languageCodeBadge(code: QuizLanguage): string {
  if (code === "cs") return "CZ";
  if (code === "en") return "EN";
  if (code === "zh") return "ZH";
  return code.toUpperCase();
}

/** Native UI locale for Intl.DisplayNames (`cs` / `en`). */
export function languageLabel(code: QuizLanguage, uiLocale: "cs" | "en"): string {
  try {
    const name = new Intl.DisplayNames([uiLocale], { type: "language" }).of(code);
    if (name) return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    /* fall through */
  }
  return code;
}

export type LanguageOption = { code: QuizLanguage; label: string; search: string };

/** Options for the add-quiz combobox, searchable without diacritics. */
export function languageOptions(uiLocale: "cs" | "en"): LanguageOption[] {
  return QUIZ_LANGUAGES.map((code) => {
    const label = languageLabel(code, uiLocale);
    const search = normalizeText(`${label} ${code} ${languageCodeBadge(code)}`);
    return { code, label, search };
  }).sort((a, b) => a.label.localeCompare(b.label, uiLocale));
}

/** Languages that already appear in the catalog (for filters). */
export function catalogLanguages(codes: Iterable<string>, uiLocale: "cs" | "en"): LanguageOption[] {
  const present = new Set<string>();
  for (const code of codes) if (isQuizLanguage(code)) present.add(code);
  return languageOptions(uiLocale).filter((o) => present.has(o.code));
}
