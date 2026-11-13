import { languageLabel, type QuizLanguage } from "./languages";
import { normalizeText } from "./quiz-text";

export const LANGUAGE_CHIP_LIMIT = 8;
export const LANGUAGE_TOP_COUNT = 7;

export type LanguageCount = { code: QuizLanguage; count: number };

/** Top languages by quiz count (name tie-break), for the compact language filter strip. */
export function topCatalogLanguages(
  counts: LanguageCount[],
  uiLocale: "cs" | "en",
  limit = LANGUAGE_TOP_COUNT,
): QuizLanguage[] {
  return [...counts]
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return languageLabel(a.code, uiLocale).localeCompare(languageLabel(b.code, uiLocale), uiLocale);
    })
    .slice(0, limit)
    .map((c) => c.code);
}

/** Whether to show the "Other language" overflow control. */
export function shouldShowOtherLanguage(totalDistinct: number): boolean {
  return totalDistinct >= LANGUAGE_CHIP_LIMIT + 1;
}

export function languageCountsFromCodes(codes: Iterable<string>): LanguageCount[] {
  const map = new Map<QuizLanguage, number>();
  for (const raw of codes) {
    const code = raw as QuizLanguage;
    map.set(code, (map.get(code) ?? 0) + 1);
  }
  return [...map.entries()].map(([code, count]) => ({ code, count }));
}

export function filterLanguageOptions(
  options: Array<{ code: QuizLanguage; label: string }>,
  query: string,
): Array<{ code: QuizLanguage; label: string }> {
  const q = normalizeText(query);
  if (!q) return options;
  return options.filter((o) => normalizeText(`${o.label} ${o.code}`).includes(q));
}
