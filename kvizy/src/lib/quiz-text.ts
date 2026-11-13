/** Lowercase and strip diacritics so "Kocka" matches "Kočka". */
export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
