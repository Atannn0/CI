"use client";

import { useMemo, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { ChoiceGroup, ChoiceOption, Field } from "@/components/form-fields";
import { ImageField, type ImageDraft } from "@/components/image-field";
import { LanguageCombobox } from "@/components/language-combobox";
import { LocaleSwitch } from "@/components/locale-switch";
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
import {
  CUSTOM_LIMITS,
  scoreKnowledgeDraft,
  scorePersonalityDraft,
  validateCustomQuizInput,
  type CustomMode,
} from "@/lib/custom-quiz";
import { useLocale } from "@/lib/i18n/locale";
import { FORMAT_LABEL_KEYS, FORMATS, LIMITS, type Quiz, type QuizFormat } from "@/lib/quiz";
import type { QuizLanguage } from "@/lib/languages";

type OptionDraft = {
  label: string;
  isCorrect: boolean;
  outcomeKey: string;
  weight: number;
  image: ImageDraft;
};

type QuestionDraft = {
  prompt: string;
  image: ImageDraft;
  options: OptionDraft[];
};

type OutcomeDraft = {
  key: string;
  title: string;
  description: string;
  image: ImageDraft;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (quiz: Quiz) => void;
};

function newKey() {
  return `o${Math.random().toString(36).slice(2, 8)}`;
}

const emptyOption = (outcomeKey = ""): OptionDraft => ({
  label: "",
  isCorrect: false,
  outcomeKey,
  weight: 1,
  image: null,
});

const emptyQuestion = (mode: CustomMode, outcomes: OutcomeDraft[]): QuestionDraft => ({
  prompt: "",
  image: null,
  options: [
    { ...emptyOption(outcomes[0]?.key ?? ""), isCorrect: mode === "knowledge" },
    emptyOption(outcomes[0]?.key ?? ""),
  ],
});

const emptyOutcome = (): OutcomeDraft => ({
  key: newKey(),
  title: "",
  description: "",
  image: null,
});

function toImagePayload(image: ImageDraft) {
  return image ? { mediaId: image.mediaId, alt: image.alt } : null;
}

export function CreateQuizDialog({ open, onOpenChange, onCreated }: Props) {
  const { locale, t } = useLocale();
  const [mode, setMode] = useState<CustomMode>("knowledge");
  const [format, setFormat] = useState<QuizFormat>("text");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [outcomes, setOutcomes] = useState<OutcomeDraft[]>([emptyOutcome(), emptyOutcome()]);
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion("knowledge", [])]);
  const [preview, setPreview] = useState(false);
  const [playAnswers, setPlayAnswers] = useState<Record<number, number>>({});
  const [playResult, setPlayResult] = useState<"pending" | "done">("pending");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const outcomeKeySet = useMemo(() => new Set(outcomes.map((o) => o.key)), [outcomes]);

  function reset() {
    setMode("knowledge");
    setFormat("text");
    setTitle("");
    setLanguage("");
    setDescription("");
    setOutcomes([emptyOutcome(), emptyOutcome()]);
    setQuestions([emptyQuestion("knowledge", [])]);
    setPreview(false);
    setPlayAnswers({});
    setPlayResult("pending");
    setError(null);
  }

  function switchMode(next: CustomMode) {
    setMode(next);
    setQuestions((prev) =>
      prev.map((q) => ({
        ...q,
        options: q.options.map((o, oi) => ({
          ...o,
          isCorrect: next === "knowledge" ? oi === 0 : false,
          outcomeKey: next === "personality" ? (outcomes[0]?.key ?? "") : "",
          weight: 1,
        })),
      })),
    );
  }

  function updateQuestion(index: number, next: QuestionDraft) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? next : q)));
  }

  function removeOutcome(index: number) {
    const removed = outcomes[index];
    const next = outcomes.filter((_, i) => i !== index);
    setOutcomes(next);
    // Keep the stale outcomeKey so the option is marked until the author reassigns it.
    void removed;
  }

  function moveOutcome(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= outcomes.length) return;
    const next = [...outcomes];
    [next[index], next[target]] = [next[target], next[index]];
    setOutcomes(next);
  }

  function payload() {
    return {
      title,
      language,
      format,
      mode,
      description,
      outcomes:
        mode === "personality"
          ? outcomes.map((o) => ({
              key: o.key,
              title: o.title,
              description: o.description,
              image: toImagePayload(o.image),
            }))
          : [],
      questions: questions.map((q) => ({
        prompt: q.prompt,
        image: toImagePayload(q.image),
        options: q.options.map((o) => ({
          label: o.label,
          isCorrect: mode === "knowledge" ? o.isCorrect : false,
          outcomeKey: mode === "personality" ? o.outcomeKey : null,
          weight: mode === "personality" ? o.weight : null,
          image: toImagePayload(o.image),
        })),
      })),
    };
  }

  function enterPreview() {
    const parsed = validateCustomQuizInput(payload(), locale);
    if (!parsed.ok) {
      setError(
        parsed.errors.detail ||
          parsed.errors.outcomes ||
          parsed.errors.questions ||
          parsed.errors.title ||
          parsed.errors.language ||
          parsed.errors.format ||
          parsed.errors.mode ||
          t("errCheckFields"),
      );
      return;
    }
    setError(null);
    setPlayAnswers({});
    setPlayResult("pending");
    setPreview(true);
  }

  async function publish() {
    const parsed = validateCustomQuizInput(payload(), locale);
    if (!parsed.ok) {
      setError(parsed.errors.detail || parsed.errors.questions || t("errCheckFields"));
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

  const knowledgePreview = scoreKnowledgeDraft(
    questions.map((q) => ({
      prompt: q.prompt,
      image: null,
      options: q.options.map((o) => ({
        label: o.label,
        isCorrect: o.isCorrect,
        outcomeKey: null,
        weight: null,
        image: null,
      })),
    })),
    playAnswers,
  );
  const personalityWinner = scorePersonalityDraft(
    outcomes.map((o) => ({ key: o.key, title: o.title, description: o.description, image: null })),
    questions.map((q) => ({
      prompt: q.prompt,
      image: null,
      options: q.options.map((o) => ({
        label: o.label,
        isCorrect: false,
        outcomeKey: o.outcomeKey,
        weight: o.weight,
        image: null,
      })),
    })),
    playAnswers,
  );

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
            <ChoiceGroup legend={t("quizMode")}>
              <ChoiceOption
                type="radio"
                name="mode"
                label={t("modeKnowledge")}
                checked={mode === "knowledge"}
                onChange={() => switchMode("knowledge")}
              />
              <ChoiceOption
                type="radio"
                name="mode"
                label={t("modePersonality")}
                checked={mode === "personality"}
                onChange={() => switchMode("personality")}
              />
            </ChoiceGroup>

            <ChoiceGroup legend={t("fieldFormatCustom")}>
              {FORMATS.map((f) => (
                <ChoiceOption
                  key={f}
                  type="radio"
                  name="format"
                  label={t(FORMAT_LABEL_KEYS[f])}
                  checked={format === f}
                  onChange={() => setFormat(f)}
                />
              ))}
            </ChoiceGroup>

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

            {mode === "personality" && (
              <div className="flex flex-col gap-3" data-testid="outcomes-editor">
                <div>
                  <p className="text-sm font-semibold">{t("outcomesHeading")}</p>
                  <p className="text-xs text-muted-foreground">{t("outcomesHelp")}</p>
                </div>
                {outcomes.map((outcome, oi) => (
                  <div key={outcome.key} className="rounded-xl border border-border p-3" data-testid="outcome-card">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {oi + 1}. {outcome.title || t("outcomeTitle")}
                      </p>
                      <div className="flex gap-1">
                        <Button type="button" variant="ghost" size="sm" disabled={oi === 0} onClick={() => moveOutcome(oi, -1)}>
                          <ArrowUpIcon className="size-4" aria-label={t("moveUp")} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={oi === outcomes.length - 1}
                          onClick={() => moveOutcome(oi, 1)}
                        >
                          <ArrowDownIcon className="size-4" aria-label={t("moveDown")} />
                        </Button>
                        {outcomes.length > CUSTOM_LIMITS.outcomesMin && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeOutcome(oi)}>
                            <Trash2Icon data-icon="inline-start" aria-hidden />
                            {t("removeOutcome")}
                          </Button>
                        )}
                      </div>
                    </div>
                    <Field id={`outcome-${oi}-title`} label={t("outcomeTitle")}>
                      <Input
                        id={`outcome-${oi}-title`}
                        value={outcome.title}
                        maxLength={CUSTOM_LIMITS.outcomeTitle}
                        onChange={(e) =>
                          setOutcomes((prev) => prev.map((o, i) => (i === oi ? { ...o, title: e.target.value } : o)))
                        }
                      />
                    </Field>
                    <Field id={`outcome-${oi}-desc`} label={t("outcomeDescription")}>
                      <Textarea
                        id={`outcome-${oi}-desc`}
                        value={outcome.description}
                        maxLength={CUSTOM_LIMITS.outcomeDescription}
                        rows={2}
                        onChange={(e) =>
                          setOutcomes((prev) =>
                            prev.map((o, i) => (i === oi ? { ...o, description: e.target.value } : o)),
                          )
                        }
                      />
                    </Field>
                    <ImageField
                      id={`outcome-${oi}-image`}
                      value={outcome.image}
                      onChange={(image) => setOutcomes((prev) => prev.map((o, i) => (i === oi ? { ...o, image } : o)))}
                    />
                  </div>
                ))}
                {outcomes.length < CUSTOM_LIMITS.outcomesMax && (
                  <Button type="button" variant="outline" onClick={() => setOutcomes((prev) => [...prev, emptyOutcome()])}>
                    <PlusIcon data-icon="inline-start" aria-hidden />
                    {t("addOutcome")}
                  </Button>
                )}
              </div>
            )}

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
                <ImageField
                  id={`q-${qi}-image`}
                  value={question.image}
                  onChange={(image) => updateQuestion(qi, { ...question, image })}
                />
                <div className="mt-2 flex flex-col gap-3">
                  {question.options.map((option, oi) => {
                    const orphan = mode === "personality" && option.outcomeKey && !outcomeKeySet.has(option.outcomeKey);
                    return (
                      <div key={oi} className="rounded-lg bg-muted/40 p-2" data-testid="custom-option">
                        <div className="flex flex-wrap items-center gap-2">
                          {mode === "knowledge" ? (
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
                          ) : null}
                          <Input
                            value={option.label}
                            maxLength={CUSTOM_LIMITS.option}
                            placeholder={`${t("optionLabel")} ${oi + 1}`}
                            className="flex-1"
                            onChange={(e) =>
                              updateQuestion(qi, {
                                ...question,
                                options: question.options.map((o, j) =>
                                  j === oi ? { ...o, label: e.target.value } : o,
                                ),
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
                        {mode === "personality" && (
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            <label className="flex flex-col gap-1 text-xs font-medium">
                              {t("mapsToOutcome")}
                              <select
                                className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
                                value={option.outcomeKey}
                                onChange={(e) =>
                                  updateQuestion(qi, {
                                    ...question,
                                    options: question.options.map((o, j) =>
                                      j === oi ? { ...o, outcomeKey: e.target.value } : o,
                                    ),
                                  })
                                }
                              >
                                <option value="">—</option>
                                {outcomes.map((o) => (
                                  <option key={o.key} value={o.key}>
                                    {o.title || o.key}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="flex flex-col gap-1 text-xs font-medium">
                              {t("weightLabel")}
                              <Input
                                type="number"
                                min={CUSTOM_LIMITS.weightMin}
                                max={CUSTOM_LIMITS.weightMax}
                                value={option.weight}
                                onChange={(e) =>
                                  updateQuestion(qi, {
                                    ...question,
                                    options: question.options.map((o, j) =>
                                      j === oi ? { ...o, weight: Number(e.target.value) || 1 } : o,
                                    ),
                                  })
                                }
                              />
                            </label>
                          </div>
                        )}
                        {orphan ? (
                          <p role="alert" className="mt-1 text-xs text-destructive">
                            {t("orphanOutcome")}
                          </p>
                        ) : null}
                        <div className="mt-2">
                          <ImageField
                            id={`q-${qi}-opt-${oi}-image`}
                            value={option.image}
                            onChange={(image) =>
                              updateQuestion(qi, {
                                ...question,
                                options: question.options.map((o, j) => (j === oi ? { ...o, image } : o)),
                              })
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                  {question.options.length < CUSTOM_LIMITS.optionsMax && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuestion(qi, {
                          ...question,
                          options: [...question.options, emptyOption(outcomes[0]?.key ?? "")],
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuestions((prev) => [...prev, emptyQuestion(mode, outcomes)])}
              >
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
              <Button type="button" size="lg" onClick={enterPreview}>
                {t("preview")}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex flex-col gap-4" data-testid="create-preview">
            <div>
              <h3 className="text-lg font-bold">{title}</h3>
              {description.trim() && <p className="text-muted-foreground">{description.trim()}</p>}
              <p className="mt-1 text-xs text-muted-foreground">{t("previewPlay")}</p>
            </div>

            {playResult === "pending" ? (
              <>
                {questions.map((question, qi) => (
                  <fieldset key={qi} className="rounded-xl border border-border p-3">
                    <legend className="px-1 font-medium">
                      {qi + 1}. {question.prompt || t("imageUpload")}
                    </legend>
                    {question.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={question.image.url} alt={question.image.alt} className="mb-2 max-h-40 rounded-lg object-contain" />
                    )}
                    <div className="flex flex-col gap-2">
                      {question.options.map((option, oi) => (
                        <label
                          key={oi}
                          className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 has-checked:border-primary"
                        >
                          <input
                            type="radio"
                            name={`preview-q-${qi}`}
                            checked={playAnswers[qi] === oi}
                            onChange={() => setPlayAnswers((prev) => ({ ...prev, [qi]: oi }))}
                          />
                          <span className="flex flex-col gap-1">
                            {option.label}
                            {option.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={option.image.url} alt={option.image.alt} className="max-h-24 rounded object-contain" />
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
                <Button
                  type="button"
                  size="lg"
                  className="font-semibold"
                  onClick={() => setPlayResult("done")}
                  disabled={Object.keys(playAnswers).length < questions.length}
                >
                  {t("submitAnswers")}
                </Button>
              </>
            ) : mode === "knowledge" ? (
              <div className="flex flex-col gap-3">
                <p className="rounded-xl bg-emerald-50 px-3 py-2 font-bold text-emerald-900" data-testid="preview-score">
                  {t("yourScore", { score: knowledgePreview.score, total: knowledgePreview.total })}
                </p>
                {questions.map((question, qi) => (
                  <div key={qi} className="rounded-xl border border-border p-3 text-sm">
                    <p className="font-medium">{question.prompt}</p>
                    <p>
                      {t("yourAnswer")} {question.options[playAnswers[qi]]?.label ?? "—"}
                    </p>
                    <p className="text-emerald-800">
                      {t("correctAnswer")} {question.options.find((o) => o.isCorrect)?.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-emerald-50 px-4 py-3" data-testid="preview-personality">
                <p className="text-sm font-semibold text-emerald-900">{t("yourPersonality")}</p>
                <p className="text-xl font-black">{personalityWinner?.title}</p>
                <p className="text-emerald-900/80">{personalityWinner?.description}</p>
                {personalityWinner &&
                  (() => {
                    const full = outcomes.find((o) => o.key === personalityWinner.key);
                    return full?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={full.image.url} alt={full.image.alt} className="mt-2 max-h-40 rounded-lg object-contain" />
                    ) : null;
                  })()}
              </div>
            )}

            {error && (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" size="lg" onClick={() => setPreview(false)}>
                {t("backToEdit")}
              </Button>
              {playResult === "done" && (
                <Button type="button" variant="outline" size="lg" onClick={() => { setPlayResult("pending"); setPlayAnswers({}); }}>
                  {t("playAgain")}
                </Button>
              )}
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
