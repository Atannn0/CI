"use client";

import { useState } from "react";
import {
  CheckIcon,
  ExternalLinkIcon,
  FlagIcon,
  FlameIcon,
  LayoutGridIcon,
  PlayIcon,
  Share2Icon,
  TagIcon,
} from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { localizedDescription } from "@/lib/descriptions";
import { FORMAT_LABEL_KEYS, TYPE_LABEL_KEYS, quizShareUrl, type Quiz } from "@/lib/quiz";
import { languageCodeBadge, languageLabel } from "@/lib/languages";
import { useLocale } from "@/lib/i18n/locale";
import { FORMAT_ICONS, TYPE_COLORS, TYPE_ICONS } from "./quiz-meta";

type Props = {
  quiz: Quiz;
  onOpen: (quiz: Quiz) => void;
  onReport: (quiz: Quiz) => void;
  done: boolean;
  onDoneChange: (quiz: Quiz, done: boolean) => void;
  highlight?: boolean;
};

export function QuizCard({ quiz, onOpen, onReport, done, onDoneChange, highlight = false }: Props) {
  const { locale, t } = useLocale();
  const FormatIcon = FORMAT_ICONS[quiz.format];
  const langLabel = languageLabel(quiz.language, locale);
  const description = localizedDescription(quiz, locale);
  const isCustom = quiz.kind === "custom";
  const href = isCustom && quiz.slug ? `/hrat/${quiz.slug}` : quiz.url;
  const [manualUrl, setManualUrl] = useState<string | null>(null);

  async function share() {
    const url = quizShareUrl(quiz, window.location.origin);
    try {
      await navigator.clipboard.writeText(url);
      setManualUrl(null);
      toast.success(t("linkCopied"));
    } catch {
      setManualUrl(url);
      toast.error(t("linkCopyFailed"));
    }
  }

  return (
    <Card
      data-testid="quiz-card"
      data-quiz-id={quiz.id}
      data-format={quiz.format}
      data-language={quiz.language}
      data-types={quiz.types.join(" ")}
      data-collection={quiz.isCollection}
      data-kind={quiz.kind}
      data-done={done}
      className={cn(
        "h-full gap-3 transition-shadow hover:shadow-md",
        done && "bg-emerald-50/50 ring-emerald-200",
        highlight && "ring-2 ring-primary",
      )}
    >
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          {quiz.isCollection && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-amber-950 ring-1 ring-amber-300">
              <LayoutGridIcon className="size-3.5" aria-hidden />
              {t("collectionBadge")}
            </span>
          )}
          {isCustom && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-950 ring-1 ring-emerald-300">
              <PlayIcon className="size-3.5" aria-hidden />
              {t("customBadge")}
            </span>
          )}
          <span
            className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-violet-900 ring-1 ring-violet-200"
            title={`${t("formatTitle")}: ${t(FORMAT_LABEL_KEYS[quiz.format])}`}
          >
            <FormatIcon className="size-3.5" aria-hidden />
            {t(FORMAT_LABEL_KEYS[quiz.format])}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-foreground ring-1 ring-border"
            title={`${t("languageTitle")}: ${langLabel}`}
          >
            <span className="font-bold tracking-wide">{languageCodeBadge(quiz.language)}</span>
            {langLabel}
          </span>
        </div>
        <CardTitle className="text-lg leading-snug font-bold">
          <h3>{quiz.title}</h3>
        </CardTitle>
        {description && <CardDescription className="line-clamp-3">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="mt-auto flex flex-wrap gap-1.5">
        {quiz.types.map((type) => {
          const Icon = TYPE_ICONS[type];
          return (
            <span
              key={type}
              className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1", TYPE_COLORS[type])}
            >
              <Icon className="size-3.5" aria-hidden />
              {t(TYPE_LABEL_KEYS[type])}
            </span>
          );
        })}
        {quiz.topic && (
          <span className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border">
            <TagIcon className="size-3" aria-hidden />
            {quiz.topic}
          </span>
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <div className="flex items-center justify-between gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium select-none">
            <input
              type="checkbox"
              checked={done}
              onChange={(e) => onDoneChange(quiz, e.target.checked)}
              className="size-4.5 cursor-pointer accent-emerald-600 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <span className={cn(done && "text-emerald-800")}>{t("markDone")}</span>
            {done && <CheckIcon className="size-4 text-emerald-600" aria-hidden />}
          </label>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" title={t("openedTimes")}>
            <FlameIcon className="size-3.5 text-orange-500" aria-hidden />
            <span data-testid="click-count">{quiz.clicks}</span>
            {t("openedTimes")}
          </span>
        </div>
        {manualUrl && (
          <p role="status" className="break-all rounded-lg bg-muted px-2 py-1.5 text-xs" data-testid="share-fallback">
            {manualUrl}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <a
            href={href}
            target={isCustom ? undefined : "_blank"}
            rel={isCustom ? undefined : "noopener noreferrer"}
            onClick={() => onOpen(quiz)}
            className={cn(buttonVariants({ size: "lg" }), "px-4 font-semibold")}
          >
            {isCustom ? t("playQuiz") : quiz.isCollection ? t("browseTests") : t("openQuiz")}
            {isCustom ? (
              <PlayIcon data-icon="inline-end" aria-hidden />
            ) : (
              <ExternalLinkIcon data-icon="inline-end" aria-hidden />
            )}
            {!isCustom && <span className="sr-only"> {t("openNewTab")}</span>}
          </a>
          <div className="flex items-center">
            <button
              type="button"
              onClick={share}
              title={t("share")}
              aria-label={t("share")}
              className="grid size-9 place-items-center rounded-full text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              data-testid="share-quiz"
            >
              <Share2Icon className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onReport(quiz)}
              title={t("reportQuiz")}
              aria-label={t("reportQuiz")}
              className="grid size-9 place-items-center rounded-full text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              data-testid="report-quiz"
            >
              <FlagIcon className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
