import type { UiLocale } from "@/lib/i18n/messages";

export function defaultDescriptionCs(title: string): string {
  return `Kvíz o: ${title}`;
}

export function defaultDescriptionEn(title: string): string {
  return `Quiz about: ${title}`;
}

function looksMostlyAscii(value: string): boolean {
  const letters = value.replace(/[^A-Za-zÀ-ž]/g, "");
  if (!letters) return true;
  const ascii = (value.match(/[A-Za-z]/g) || []).length;
  return ascii / letters.length > 0.85;
}

/** Build bilingual blurbs from an optional user/import description. */
export function bilingualDescriptions(
  title: string,
  description: string | null | undefined,
  explicit?: { cs?: string | null; en?: string | null },
): { description: string | null; descriptionCs: string; descriptionEn: string } {
  const trimmed = typeof description === "string" ? description.trim().replace(/\s+/g, " ") : "";
  const original = trimmed === "" ? null : trimmed;
  const explicitCs = explicit?.cs?.trim() || "";
  const explicitEn = explicit?.en?.trim() || "";
  const cs = explicitCs || original || defaultDescriptionCs(title);
  const en =
    explicitEn ||
    (original && looksMostlyAscii(original) ? original : "") ||
    defaultDescriptionEn(title);
  return { description: original, descriptionCs: cs.slice(0, 300), descriptionEn: en.slice(0, 300) };
}

export function localizedDescription(
  quiz: { descriptionCs?: string | null; descriptionEn?: string | null; description?: string | null; title: string },
  locale: UiLocale,
): string {
  if (locale === "en") {
    return quiz.descriptionEn || quiz.description || defaultDescriptionEn(quiz.title);
  }
  return quiz.descriptionCs || quiz.description || defaultDescriptionCs(quiz.title);
}
