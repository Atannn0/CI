"use client";

import { ExternalLinkIcon, FlameIcon, TagIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FORMAT_LABELS, LANGUAGE_LABELS, TYPE_LABELS, type Quiz } from "@/lib/quiz";
import { FORMAT_ICONS, LANGUAGE_CODES, TYPE_COLORS, TYPE_ICONS } from "./quiz-meta";

type Props = {
  quiz: Quiz;
  onOpen: (quiz: Quiz) => void;
  highlight?: boolean;
};

export function QuizCard({ quiz, onOpen, highlight = false }: Props) {
  const FormatIcon = FORMAT_ICONS[quiz.format];
  return (
    <Card
      data-testid="quiz-card"
      data-quiz-id={quiz.id}
      data-format={quiz.format}
      data-language={quiz.language}
      data-types={quiz.types.join(" ")}
      className={cn(
        "h-full gap-3 transition-shadow hover:shadow-md",
        highlight && "ring-2 ring-primary",
      )}
    >
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          <span
            className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-violet-900 ring-1 ring-violet-200"
            title={`Formát: ${FORMAT_LABELS[quiz.format]}`}
          >
            <FormatIcon className="size-3.5" aria-hidden />
            {FORMAT_LABELS[quiz.format]}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-foreground ring-1 ring-border"
            title={`Jazyk: ${LANGUAGE_LABELS[quiz.language]}`}
          >
            <span className="font-bold tracking-wide">{LANGUAGE_CODES[quiz.language]}</span>
            {LANGUAGE_LABELS[quiz.language]}
          </span>
        </div>
        <CardTitle className="text-lg leading-snug font-bold">
          <h3>{quiz.title}</h3>
        </CardTitle>
        {quiz.description && <CardDescription className="line-clamp-3">{quiz.description}</CardDescription>}
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
              {TYPE_LABELS[type]}
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
      <CardFooter className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" title="Počet otevření">
          <FlameIcon className="size-3.5 text-orange-500" aria-hidden />
          <span data-testid="click-count">{quiz.clicks}</span>× otevřeno
        </span>
        <a
          href={quiz.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onOpen(quiz)}
          className={cn(buttonVariants({ size: "lg" }), "px-4 font-semibold")}
        >
          Otevřít kvíz
          <ExternalLinkIcon data-icon="inline-end" aria-hidden />
          <span className="sr-only"> (otevře se v nové záložce)</span>
        </a>
      </CardFooter>
    </Card>
  );
}
