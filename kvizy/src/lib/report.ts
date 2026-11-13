export const REPORT_REASONS = ["broken_link", "wrong_category", "inappropriate", "duplicate", "other"] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  broken_link: "Nefunkční odkaz",
  wrong_category: "Nesprávné zařazení",
  inappropriate: "Nevhodný obsah",
  duplicate: "Duplicita",
  other: "Jiné",
};

export const REPORT_LIMITS = { note: 500, otherNoteMin: 5 } as const;

export type ReportInput = { reason: ReportReason; note: string | null };

export type ReportInputErrors = Partial<Record<keyof ReportInput, string>>;

export type QuizReport = {
  id: number;
  quizId: number;
  quizTitle: string;
  quizUrl: string;
  reason: ReportReason;
  note: string | null;
  createdAt: string;
};

export function validateReportInput(
  raw: unknown,
): { ok: true; value: ReportInput } | { ok: false; errors: ReportInputErrors } {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: ReportInputErrors = {};

  const reason = data.reason;
  if (!REPORT_REASONS.includes(reason as ReportReason)) errors.reason = "Vyber důvod hlášení.";

  const note = typeof data.note === "string" ? data.note.trim().replace(/\s+/g, " ") : "";
  if (note.length > REPORT_LIMITS.note) errors.note = `Doplnění může mít nejvýš ${REPORT_LIMITS.note} znaků.`;
  else if (reason === "other" && note.length < REPORT_LIMITS.otherNoteMin)
    errors.note = "U důvodu Jiné stručně popiš, co je špatně.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { reason: reason as ReportReason, note: note === "" ? null : note } };
}
