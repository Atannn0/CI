"use client";

import { useState } from "react";
import { CircleCheckIcon } from "lucide-react";
import { ChoiceGroup, ChoiceOption, Field } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/lib/i18n/locale";
import type { Quiz } from "@/lib/quiz";
import {
  REPORT_LIMITS,
  REPORT_REASON_KEYS,
  REPORT_REASONS,
  validateReportInput,
  type ReportInputErrors,
  type ReportReason,
} from "@/lib/report";

type Props = {
  quiz: Quiz | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ReportQuizDialog({ quiz, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        {quiz && <ReportForm key={quiz.id} quiz={quiz} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function ReportForm({ quiz, onClose }: { quiz: Quiz; onClose: () => void }) {
  const { locale, t } = useLocale();
  const [reason, setReason] = useState<ReportReason | "">("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<ReportInputErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = validateReportInput({ reason, note }, locale);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setSubmitting(true);
    setServerError(null);
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept-Language": locale },
        body: JSON.stringify(parsed.value),
      });
      if (response.status === 201) {
        setSent(true);
        return;
      }
      const data = (await response.json().catch(() => ({}))) as { message?: string; fields?: ReportInputErrors };
      if (response.status === 422) setErrors(data.fields ?? {});
      setServerError(data.message ?? t("reportFailed"));
    } catch {
      setServerError(t("reportFailedNet"));
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("reportThanks")}</DialogTitle>
          <DialogDescription>„{quiz.title}“</DialogDescription>
        </DialogHeader>
        <p role="status" className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-3 text-emerald-900">
          <CircleCheckIcon className="mt-0.5 size-5 shrink-0" aria-hidden />
          {t("reportSaved")}
        </p>
        <DialogFooter>
          <Button type="button" size="lg" onClick={onClose}>
            {t("reportClose")}
          </Button>
        </DialogFooter>
      </>
    );
  }

  const noteRequired = reason === "other";
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">{t("reportTitle")}</DialogTitle>
        <DialogDescription className="text-base font-medium text-foreground">„{quiz.title}“</DialogDescription>
      </DialogHeader>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label={t("reportTitle")}>
        <ChoiceGroup legend={t("reportReason")} error={errors.reason}>
          {REPORT_REASONS.map((value) => (
            <ChoiceOption
              key={value}
              type="radio"
              name="reason"
              label={t(REPORT_REASON_KEYS[value])}
              checked={reason === value}
              onChange={() => {
                setReason(value);
                setErrors({});
                setServerError(null);
              }}
            />
          ))}
        </ChoiceGroup>

        <Field id="report-note" label={noteRequired ? t("reportNoteRequired") : t("reportNote")} error={errors.note}>
          <Textarea
            id="report-note"
            value={note}
            maxLength={REPORT_LIMITS.note}
            onChange={(e) => {
              setNote(e.target.value);
              setErrors((prev) => ({ ...prev, note: undefined }));
              setServerError(null);
            }}
            aria-invalid={!!errors.note}
            rows={3}
            placeholder={noteRequired ? t("reportNotePlaceholderOther") : t("reportNotePlaceholder")}
          />
        </Field>

        {serverError && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" size="lg" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit" size="lg" disabled={submitting} className="font-semibold">
            {submitting ? t("reportSending") : t("reportSend")}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
