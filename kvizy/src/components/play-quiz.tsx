"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { LocaleProvider, useLocale } from "@/lib/i18n/locale";
import { LocaleSwitch } from "@/components/locale-switch";
import { localizedDescription } from "@/lib/descriptions";
import type { GradeResult, PlayPayload } from "@/lib/custom-quizzes-repo";

export function PlayQuiz({ initial }: { initial: PlayPayload }) {
  return (
    <LocaleProvider>
      <PlayQuizInner initial={initial} />
    </LocaleProvider>
  );
}

function PlayQuizInner({ initial }: { initial: PlayPayload }) {
  const { locale, t } = useLocale();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/custom-quizzes/${initial.quiz.slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.fromEntries(Object.entries(answers).map(([k, v]) => [String(k), v])),
        }),
      });
      if (!response.ok) {
        setError(t("saveFailed"));
        return;
      }
      setResult((await response.json()) as GradeResult);
    } catch {
      setError(t("saveFailedNet"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-violet-700">{t("brand")}</p>
          <h1 className="text-3xl font-black tracking-tight">{initial.quiz.title}</h1>
          <p className="mt-1 text-muted-foreground">{localizedDescription(initial.quiz, locale)}</p>
        </div>
        <LocaleSwitch />
      </div>

      {!result ? (
        <>
          {initial.questions.map((question, index) => (
            <fieldset key={question.id} className="rounded-2xl bg-card p-4 ring-1 ring-border">
              <legend className="mb-3 text-base font-semibold">
                {index + 1}. {question.prompt}
              </legend>
              <div className="flex flex-col gap-2">
                {question.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 has-checked:border-primary has-checked:bg-primary/5"
                  >
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      checked={answers[question.id] === option.id}
                      onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button size="lg" className="font-semibold" disabled={submitting} onClick={submit}>
            {submitting ? t("publishing") : t("submitAnswers")}
          </Button>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <p role="status" className="rounded-2xl bg-emerald-50 px-4 py-3 text-lg font-bold text-emerald-900" data-testid="play-score">
            {t("yourScore", { score: result.score, total: result.total })}
          </p>
          {result.results.map((item) => (
            <div key={item.questionId} className="rounded-2xl bg-card p-4 ring-1 ring-border">
              <p className="font-semibold">{item.prompt}</p>
              <p className="mt-2 text-sm">
                {t("yourAnswer")} {item.selectedLabel ?? "—"}
              </p>
              <p className="text-sm text-emerald-800">
                {t("correctAnswer")} {item.correctLabel}
              </p>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setResult(null);
                setAnswers({});
              }}
            >
              {t("playAgain")}
            </Button>
            <Link href="/" className={buttonVariants({ variant: "default" })}>
              {t("backToCatalog")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
