"use client";

import { useMemo, useState } from "react";
import { FlameIcon, ImageIcon, PlusIcon, RotateCcwIcon, SearchIcon, SparklesIcon, XIcon } from "lucide-react";
import { AddQuizDialog } from "@/components/add-quiz-dialog";
import { FilterChip, FilterGroup } from "@/components/filter-chip";
import { QuizCard } from "@/components/quiz-card";
import { FORMAT_ICONS, TYPE_ICONS } from "@/components/quiz-meta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EMPTY_FILTERS, filterQuizzes, hasActiveFilters, popularQuizzes, toggleValue, type Filters } from "@/lib/filter";
import {
  FORMAT_LABELS,
  FORMATS,
  LANGUAGE_LABELS,
  LANGUAGES,
  pluralQuizzes,
  QUIZ_TYPES,
  TYPE_LABELS,
  type Quiz,
} from "@/lib/quiz";

export function Catalog({ initialQuizzes }: { initialQuizzes: Quiz[] }) {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [addOpen, setAddOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<number | null>(null);

  const results = useMemo(() => filterQuizzes(quizzes, filters), [quizzes, filters]);
  const popular = useMemo(() => popularQuizzes(quizzes), [quizzes]);
  const active = hasActiveFilters(filters);
  const imageOnly = filters.formats.length === 1 && filters.formats[0] === "image";

  function openQuiz(quiz: Quiz) {
    setQuizzes((prev) => prev.map((q) => (q.id === quiz.id ? { ...q, clicks: q.clicks + 1 } : q)));
    fetch(`/api/quizzes/${quiz.id}/click`, { method: "POST", keepalive: true })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { clicks: number } | null) => {
        if (data) setQuizzes((prev) => prev.map((q) => (q.id === quiz.id ? { ...q, clicks: data.clicks } : q)));
      })
      .catch(() => {});
  }

  function handleCreated(quiz: Quiz) {
    setQuizzes((prev) => [quiz, ...prev.filter((q) => q.id !== quiz.id)]);
    setFilters(EMPTY_FILTERS);
    setLastAddedId(quiz.id);
  }

  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 text-white">
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-white/15 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-yellow-300/25 blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-10">
          <div className="flex items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight sm:text-xl">
              <span className="grid size-9 place-items-center rounded-xl bg-white/20 ring-1 ring-white/40">
                <SparklesIcon className="size-5" aria-hidden />
              </span>
              Kvízy pro partu
            </p>
            <Button
              size="lg"
              onClick={() => setAddOpen(true)}
              className="h-10 bg-white px-4 font-semibold text-violet-700 shadow-md hover:bg-white/90"
            >
              <PlusIcon data-icon="inline-start" aria-hidden />
              Přidat kvíz
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-black tracking-tight text-balance sm:text-5xl">
              <label htmlFor="search">Najdi kvíz pro svou partu</label>
            </h1>
            <div className="relative">
              <SearchIcon className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="search"
                type="search"
                value={filters.query}
                onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
                placeholder="Filmy, hádanky, jídlo…"
                className="h-14 rounded-2xl border-0 bg-white pr-12 pl-12 text-base text-foreground shadow-lg md:text-lg"
              />
              {filters.query && (
                <button
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, query: "" }))}
                  className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                  aria-label="Vymazat hledání"
                >
                  <XIcon className="size-4" />
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            aria-pressed={imageOnly}
            onClick={() => setFilters((f) => ({ ...f, formats: imageOnly ? [] : ["image"] }))}
            className={cn(
              "group flex items-center gap-4 rounded-2xl px-4 py-3 text-left ring-2 transition-all outline-none focus-visible:ring-4 focus-visible:ring-white sm:max-w-md",
              imageOnly
                ? "bg-white text-violet-700 ring-white"
                : "bg-white/15 text-white ring-white/50 hover:bg-white/25",
            )}
          >
            <span
              className={cn(
                "grid size-12 shrink-0 place-items-center rounded-xl",
                imageOnly ? "bg-violet-100" : "bg-white/20",
              )}
            >
              <ImageIcon className="size-7" aria-hidden />
            </span>
            <span className="flex flex-col">
              <span className="text-lg font-extrabold">Obrázkové kvízy</span>
              <span className="text-sm opacity-90">Málo čtení, hodně koukání. Ideální pro partu.</span>
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
        <section aria-label="Filtry" className="grid gap-5 rounded-2xl bg-card p-4 ring-1 ring-border sm:p-5 lg:grid-cols-[auto_1fr_auto]">
          <FilterGroup title="Formát">
            {FORMATS.map((format) => (
              <FilterChip
                key={format}
                label={FORMAT_LABELS[format]}
                icon={FORMAT_ICONS[format]}
                pressed={filters.formats.includes(format)}
                onToggle={() => setFilters((f) => ({ ...f, formats: toggleValue(f.formats, format) }))}
              />
            ))}
          </FilterGroup>
          <FilterGroup title="Typ kvízu">
            {QUIZ_TYPES.map((type) => (
              <FilterChip
                key={type}
                label={TYPE_LABELS[type]}
                icon={TYPE_ICONS[type]}
                pressed={filters.types.includes(type)}
                onToggle={() => setFilters((f) => ({ ...f, types: toggleValue(f.types, type) }))}
              />
            ))}
          </FilterGroup>
          <FilterGroup title="Jazyk">
            {LANGUAGES.map((language) => (
              <FilterChip
                key={language}
                label={LANGUAGE_LABELS[language]}
                pressed={filters.languages.includes(language)}
                onToggle={() => setFilters((f) => ({ ...f, languages: toggleValue(f.languages, language) }))}
              />
            ))}
          </FilterGroup>
        </section>

        {!active && popular.length > 0 && (
          <section aria-labelledby="popular-heading" className="flex flex-col gap-4">
            <h2 id="popular-heading" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
              <FlameIcon className="size-6 text-orange-500" aria-hidden />
              Populární kvízy
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="popular-list">
              {popular.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onOpen={openQuiz} />
              ))}
            </div>
          </section>
        )}
        {!active && popular.length === 0 && (
          <section aria-labelledby="popular-heading" className="flex flex-col gap-2">
            <h2 id="popular-heading" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
              <FlameIcon className="size-6 text-orange-500" aria-hidden />
              Populární kvízy
            </h2>
            <p className="text-muted-foreground">Zatím nikdo nic neotevřel. Buďte první, kdo rozjede žebříček!</p>
          </section>
        )}

        <section aria-labelledby="results-heading" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="results-heading" className="text-2xl font-extrabold tracking-tight">
              {active ? "Výsledky" : "Všechny kvízy"}{" "}
              <span className="text-base font-semibold text-muted-foreground" data-testid="result-count" aria-live="polite">
                {active ? `Nalezeno: ${pluralQuizzes(results.length)}` : pluralQuizzes(results.length)}
              </span>
            </h2>
            {active && (
              <Button variant="outline" size="lg" onClick={() => setFilters(EMPTY_FILTERS)}>
                <RotateCcwIcon data-icon="inline-start" aria-hidden />
                Vymazat hledání a filtry
              </Button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border px-6 py-12 text-center">
              <p className="text-lg font-bold">Tady nic není.</p>
              <p className="text-muted-foreground" data-testid="empty-message">
                Žádný kvíz neodpovídá hledání a filtrům. Zkus jiné slovo nebo uber filtry.
              </p>
              <Button variant="outline" onClick={() => setFilters(EMPTY_FILTERS)}>
                Vymazat hledání a filtry
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="results-list">
              {results.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onOpen={openQuiz} highlight={quiz.id === lastAddedId} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Kvízy se otevírají na původních webech v nové záložce.
      </footer>

      <AddQuizDialog open={addOpen} onOpenChange={setAddOpen} quizzes={quizzes} onCreated={handleCreated} />
    </>
  );
}
