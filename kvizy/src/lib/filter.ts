import { normalizeText, type Quiz, type QuizFormat, type QuizLanguage, type QuizType } from "./quiz";

export type Filters = {
  query: string;
  formats: QuizFormat[];
  types: QuizType[];
  languages: QuizLanguage[];
};

export const EMPTY_FILTERS: Filters = { query: "", formats: [], types: [], languages: [] };

export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.formats.length > 0 ||
    filters.types.length > 0 ||
    filters.languages.length > 0
  );
}

/**
 * Every word of the query must appear in the title, description or topic.
 * Within one filter any selected value matches; all filters and the query must hold together.
 */
export function filterQuizzes(quizzes: Quiz[], filters: Filters): Quiz[] {
  const words = normalizeText(filters.query).split(/\s+/).filter(Boolean);
  return quizzes.filter((quiz) => {
    if (filters.formats.length > 0 && !filters.formats.includes(quiz.format)) return false;
    if (filters.languages.length > 0 && !filters.languages.includes(quiz.language)) return false;
    if (filters.types.length > 0 && !quiz.types.some((t) => filters.types.includes(t))) return false;
    if (words.length === 0) return true;
    const haystack = normalizeText([quiz.title, quiz.description ?? "", quiz.topic ?? ""].join(" "));
    return words.every((word) => haystack.includes(word));
  });
}

/** Applied after filterQuizzes when the visitor hides quizzes marked as done. */
export function withoutDone(quizzes: Quiz[], done: ReadonlySet<number>, hide: boolean): Quiz[] {
  if (!hide || done.size === 0) return quizzes;
  return quizzes.filter((quiz) => !done.has(quiz.id));
}

export function popularQuizzes(quizzes: Quiz[], limit = 6): Quiz[] {
  return [...quizzes]
    .filter((q) => q.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks || a.title.localeCompare(b.title, "cs"))
    .slice(0, limit);
}

export function toggleValue<T>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}
