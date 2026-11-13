"use client";

import { useMemo, useState } from "react";
import { TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChoiceGroup, ChoiceOption, Field } from "@/components/form-fields";
import { LanguageCombobox } from "@/components/language-combobox";
import { LocaleSwitch } from "@/components/locale-switch";
import { useLocale } from "@/lib/i18n/locale";
import {
  FORMAT_LABEL_KEYS,
  FORMATS,
  LIMITS,
  QUIZ_TYPES,
  TYPE_LABEL_KEYS,
  urlKey,
  validateQuizInput,
  type Quiz,
  type QuizInputErrors,
  type QuizType,
} from "@/lib/quiz";
import { toggleValue } from "@/lib/filter";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizzes: Quiz[];
  onCreated: (quiz: Quiz) => void;
};

const EMPTY_FORM = {
  title: "",
  url: "",
  description: "",
  topic: "",
  format: "",
  language: "",
  types: [] as QuizType[],
};

export function AddQuizDialog({ open, onOpenChange, quizzes, onCreated }: Props) {
  const { locale, t } = useLocale();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<QuizInputErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const duplicate = useMemo(() => {
    const key = urlKey(form.url);
    if (!key) return null;
    return quizzes.find((q) => urlKey(q.url) === key) ?? null;
  }, [form.url, quizzes]);

  function update<K extends keyof typeof EMPTY_FORM>(field: K, value: (typeof EMPTY_FORM)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError(null);
  }

  // Keep draft values when switching UI language; only clear on explicit close/success.
  function reset() {
    setForm(EMPTY_FORM);
    setErrors({});
    setServerError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = validateQuizInput(form, locale);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    if (duplicate) {
      setErrors({ url: `${t("duplicateUrl")} „${duplicate.title}“.` });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept-Language": locale },
        body: JSON.stringify(parsed.value),
      });
      const data = await response.json();
      if (response.status === 201) {
        onCreated(data.quiz as Quiz);
        toast.success(t("quizAdded"), { description: `„${data.quiz.title}“ ${t("quizAddedDesc")}` });
        reset();
        onOpenChange(false);
        return;
      }
      if (response.status === 409) setErrors({ url: data.message });
      else if (response.status === 422) setErrors(data.fields ?? {});
      setServerError(data.message ?? t("saveFailed"));
    } catch {
      setServerError(t("saveFailedNet"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-8">
            <DialogTitle className="text-xl font-bold">{t("addTitle")}</DialogTitle>
            <LocaleSwitch />
          </div>
          <DialogDescription>{t("addLead")}</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label={t("addTitle")}>
          <Field id="quiz-title" label={t("fieldTitle")} error={errors.title}>
            <Input
              id="quiz-title"
              value={form.title}
              maxLength={LIMITS.title}
              onChange={(e) => update("title", e.target.value)}
              aria-invalid={!!errors.title}
              placeholder={t("titlePlaceholder")}
            />
          </Field>

          <Field id="quiz-url" label={t("fieldUrl")} error={errors.url}>
            <Input
              id="quiz-url"
              type="url"
              inputMode="url"
              value={form.url}
              onChange={(e) => update("url", e.target.value)}
              aria-invalid={!!errors.url}
              placeholder="https://…"
            />
            {duplicate && !errors.url && (
              <p role="status" className="flex items-start gap-1.5 text-sm text-amber-700">
                <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                {t("duplicateUrl")} „{duplicate.title}“.
              </p>
            )}
          </Field>

          <ChoiceGroup legend={t("fieldFormat")} error={errors.format}>
            {FORMATS.map((format) => (
              <ChoiceOption
                key={format}
                type="radio"
                name="format"
                label={t(FORMAT_LABEL_KEYS[format])}
                checked={form.format === format}
                onChange={() => update("format", format)}
              />
            ))}
          </ChoiceGroup>

          <ChoiceGroup legend={t("fieldTypes")} error={errors.types}>
            {QUIZ_TYPES.map((type) => (
              <ChoiceOption
                key={type}
                type="checkbox"
                name="types"
                label={t(TYPE_LABEL_KEYS[type])}
                checked={form.types.includes(type)}
                onChange={() => update("types", toggleValue(form.types, type))}
              />
            ))}
          </ChoiceGroup>

          <Field id="quiz-language" label={t("fieldLanguage")} error={errors.language}>
            <LanguageCombobox
              id="quiz-language"
              value={form.language}
              error={!!errors.language}
              onChange={(code) => update("language", code)}
            />
          </Field>

          <Field id="quiz-topic" label={t("fieldTopic")} error={errors.topic}>
            <Input
              id="quiz-topic"
              value={form.topic}
              maxLength={LIMITS.topic}
              onChange={(e) => update("topic", e.target.value)}
              placeholder={t("topicPlaceholder")}
            />
          </Field>

          <Field id="quiz-description" label={t("fieldDescription")} error={errors.description}>
            <Textarea
              id="quiz-description"
              value={form.description}
              maxLength={LIMITS.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              placeholder={t("descriptionPlaceholder")}
            />
          </Field>

          {serverError && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" size="lg" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" size="lg" disabled={submitting} className="font-semibold">
              {submitting ? t("saving") : t("saveQuiz")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
