"use client";

import { useState } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { LanguageCombobox } from "@/components/language-combobox";
import { LocaleSwitch } from "@/components/locale-switch";
import { Field } from "@/components/form-fields";
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
import { CUSTOM_LIMITS, validateCustomQuizInput } from "@/lib/custom-quiz";
import { useLocale } from "@/lib/i18n/locale";
import { LIMITS, type Quiz } from "@/lib/quiz";
import type { QuizLanguage } from "@/lib/languages";

type OptionDraft = { label: string; isCorrect: boolean };
type QuestionDraft = { prompt: string; options: OptionDraft[] };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (quiz: Quiz) => void;
};

const emptyQuestion = (): QuestionDraft => ({
  prompt: "",
  options: [
    { label: "", isCorrect: true },
    { label: "", isCorrect: false },
  ],
});

export function CreateQuizDialog({ open, onOpenChange, onCreated }: Props) {
  const { locale, t } = useLocale();
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()]);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setTitle("");
    setLanguage("");
    setDescription("");
    setQuestions([emptyQuestion()]);
    setPreview(false);
    setError(null);
  }

  function updateQuestion(index: number, next: QuestionDraft) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? next : q)));
  }

  async function publish() {
    const parsed = validateCustomQuizInput({ title, language, description, questions }, locale);
    if (!parsed.ok) {
      setError(parsed.errors.detail || parsed.errors.questions || parsed.errors.title || parsed.errors.language || t("errCheckFields"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/custom-quizzes", {
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
      setError(data.message ?? data.fields?.detail ?? t("saveFailed"));
    } catch {
      setError(t("saveFailedNet"));
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
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-8">
            <DialogTitle className="text-xl font-bold">{t("createTitle")}</DialogTitle>
            <LocaleSwitch />
          </div>
          <DialogDescription>{t("createLead")}</DialogDescription>
        </DialogHeader>

        {!preview ? (
          <div className="flex flex-col gap-4">
            <Field id="custom-title" label={t("fieldTitle")}>
              <Input id="custom-title" value={title} maxLength={LIMITS.title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field id="custom-language" label={t("fieldLanguage")}>
              <LanguageCombobox id="custom-language" value={language} onChange={(code: QuizLanguage) => setLanguage(code)} />
            </Field>
            <Field id="custom-description" label={t("fieldDescription")}>
              <Textarea
                id="custom-description"
                value={description}
                maxLength={LIMITS.description}
                rows={2}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            {questions.map((question, qi) => (
              <div key={qi} className="rounded-xl border border-border p-3" data-testid="custom-question">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{t("questionN", { n: qi + 1 })}</p>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== qi))}
                    >
                      <Trash2Icon data-icon="inline-start" aria-hidden />
                      {t("removeQuestion")}
                    </Button>
                  )}
                </div>
                <Field id={`q-${qi}-prompt`} label={t("promptLabel")}>
                  <Textarea
                    id={`q-${qi}-prompt`}
                    value={question.prompt}
                    maxLength={CUSTOM_LIMITS.prompt}
                    rows={2}
                    onChange={(e) => updateQuestion(qi, { ...question, prompt: e.target.value })}
                  />
                </Field>
                <div className="mt-2 flex flex-col gap-2">
                  {question.options.map((option, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={option.isCorrect}
                        onChange={() =>
                          updateQuestion(qi, {
                            ...question,
                            options: question.options.map((o, j) => ({ ...o, isCorrect: j === oi })),
                          })
                        }
                        aria-label={t("correctLabel")}
                      />
                      <Input
                        value={option.label}
                        maxLength={CUSTOM_LIMITS.option}
                        placeholder={`${t("optionLabel")} ${oi + 1}`}
                        onChange={(e) =>
                          updateQuestion(qi, {
                            ...question,
                            options: question.options.map((o, j) => (j === oi ? { ...o, label: e.target.value } : o)),
                          })
                        }
                      />
                      {question.options.length > CUSTOM_LIMITS.optionsMin && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuestion(qi, {
                              ...question,
                              options: question.options.filter((_, j) => j !== oi),
                            })
                          }
                        >
                          {t("removeOption")}
                        </Button>
                      )}
                    </div>
                  ))}
                  {question.options.length < CUSTOM_LIMITS.optionsMax && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuestion(qi, {
                          ...question,
                          options: [...question.options, { label: "", isCorrect: false }],
                        })
                      }
                    >
                      <PlusIcon data-icon="inline-start" aria-hidden />
                      {t("addOption")}
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {questions.length < CUSTOM_LIMITS.questionsMax && (
              <Button type="button" variant="outline" onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}>
                <PlusIcon data-icon="inline-start" aria-hidden />
                {t("addQuestion")}
              </Button>
            )}

            {error && (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" size="lg" onClick={() => onOpenChange(false)}>
                {t("cancel")}
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  const parsed = validateCustomQuizInput({ title, language, description, questions }, locale);
                  if (!parsed.ok) {
                    setError(
                      parsed.errors.detail ||
                        parsed.errors.questions ||
                        parsed.errors.title ||
                        parsed.errors.language ||
                        t("errCheckFields"),
                    );
                    return;
                  }
                  setError(null);
                  setPreview(true);
                }}
              >
                {t("preview")}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold">{title}</h3>
              {description.trim() && <p className="text-muted-foreground">{description.trim()}</p>}
            </div>
            {questions.map((question, qi) => (
              <div key={qi} className="rounded-xl border border-border p-3">
                <p className="font-medium">
                  {qi + 1}. {question.prompt}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {question.options.map((option, oi) => (
                    <li key={oi} className={option.isCorrect ? "font-semibold text-emerald-700" : undefined}>
                      {option.label}
                      {option.isCorrect ? ` (${t("correctLabel")})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {error && (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" size="lg" onClick={() => setPreview(false)}>
                {t("backToEdit")}
              </Button>
              <Button type="button" size="lg" disabled={submitting} onClick={publish} className="font-semibold">
                {submitting ? t("publishing") : t("publishQuiz")}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
