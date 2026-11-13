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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  FORMAT_LABELS,
  FORMATS,
  LANGUAGE_LABELS,
  LANGUAGES,
  LIMITS,
  QUIZ_TYPES,
  TYPE_LABELS,
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

  function reset() {
    setForm(EMPTY_FORM);
    setErrors({});
    setServerError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = validateQuizInput(form);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    if (duplicate) {
      setErrors({ url: `Tento odkaz už v katalogu je jako „${duplicate.title}“.` });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.value),
      });
      const data = await response.json();
      if (response.status === 201) {
        onCreated(data.quiz as Quiz);
        toast.success("Kvíz je v katalogu!", { description: `„${data.quiz.title}“ teď najde každý z party.` });
        reset();
        onOpenChange(false);
        return;
      }
      if (response.status === 409) setErrors({ url: data.message });
      else if (response.status === 422) setErrors(data.fields ?? {});
      setServerError(data.message ?? "Uložení se nepovedlo. Zkus to znovu.");
    } catch {
      setServerError("Uložení se nepovedlo. Zkontroluj připojení a zkus to znovu.");
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
          <DialogTitle className="text-xl font-bold">Přidat kvíz</DialogTitle>
          <DialogDescription>Bez registrace. Pole s hvězdičkou jsou povinná.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="Přidat kvíz">
          <Field id="quiz-title" label="Název *" error={errors.title}>
            <Input
              id="quiz-title"
              value={form.title}
              maxLength={LIMITS.title}
              onChange={(e) => update("title", e.target.value)}
              aria-invalid={!!errors.title}
              placeholder="Která seriálová postava jsi?"
            />
          </Field>

          <Field id="quiz-url" label="Přímý odkaz *" error={errors.url}>
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
                Tento odkaz už v katalogu je jako „{duplicate.title}“.
              </p>
            )}
          </Field>

          <ChoiceGroup legend="Formát *" error={errors.format}>
            {FORMATS.map((format) => (
              <ChoiceOption
                key={format}
                type="radio"
                name="format"
                label={FORMAT_LABELS[format]}
                checked={form.format === format}
                onChange={() => update("format", format)}
              />
            ))}
          </ChoiceGroup>

          <ChoiceGroup legend="Typ kvízu * (alespoň jeden)" error={errors.types}>
            {QUIZ_TYPES.map((type) => (
              <ChoiceOption
                key={type}
                type="checkbox"
                name="types"
                label={TYPE_LABELS[type]}
                checked={form.types.includes(type)}
                onChange={() => update("types", toggleValue(form.types, type))}
              />
            ))}
          </ChoiceGroup>

          <ChoiceGroup legend="Jazyk *" error={errors.language}>
            {LANGUAGES.map((language) => (
              <ChoiceOption
                key={language}
                type="radio"
                name="language"
                label={LANGUAGE_LABELS[language]}
                checked={form.language === language}
                onChange={() => update("language", language)}
              />
            ))}
          </ChoiceGroup>

          <Field id="quiz-topic" label="Téma (nepovinné)" error={errors.topic}>
            <Input
              id="quiz-topic"
              value={form.topic}
              maxLength={LIMITS.topic}
              onChange={(e) => update("topic", e.target.value)}
              placeholder="filmy, hudba, jídlo…"
            />
          </Field>

          <Field id="quiz-description" label="Krátký popis (nepovinné)" error={errors.description}>
            <Textarea
              id="quiz-description"
              value={form.description}
              maxLength={LIMITS.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              placeholder="O čem kvíz je a proč se hodí pro partu"
            />
          </Field>

          {serverError && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" size="lg" onClick={() => onOpenChange(false)}>
              Zrušit
            </Button>
            <Button type="submit" size="lg" disabled={submitting} className="font-semibold">
              {submitting ? "Ukládám…" : "Uložit kvíz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function ChoiceGroup({ legend, error, children }: { legend: string; error?: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-1.5" aria-invalid={!!error}>
      <legend className="mb-1.5 text-sm font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function ChoiceOption({
  type,
  name,
  label,
  checked,
  onChange,
}: {
  type: "radio" | "checkbox";
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "inline-flex h-9 cursor-pointer items-center rounded-full border px-3.5 text-sm font-medium transition-colors has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
        checked ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-primary/5",
      )}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}
