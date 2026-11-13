"use client";

import { useMemo, useRef, useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { languageOptions, type QuizLanguage } from "@/lib/languages";
import { normalizeText } from "@/lib/quiz-text";
import { useLocale } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  value: string;
  onChange: (code: QuizLanguage) => void;
  error?: boolean;
};

export function LanguageCombobox({ id, value, onChange, error }: Props) {
  const { locale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const options = useMemo(() => languageOptions(locale), [locale]);
  const selected = options.find((o) => o.code === value);

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return options;
    return options.filter((o) => o.search.includes(q));
  }, [options, query]);

  return (
    <div className="relative" data-testid="language-combobox">
      <button
        type="button"
        id={id}
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-haspopup="listbox"
        data-invalid={error || undefined}
        onClick={() => {
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border bg-background px-3 text-left text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          error ? "border-destructive" : "border-border",
        )}
      >
        <span className={cn(!selected && "text-muted-foreground")}>
          {selected ? `${selected.label} (${selected.code})` : t("languageSearch")}
        </span>
        <ChevronsUpDownIcon className="size-4 opacity-60" aria-hidden />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg"
          role="presentation"
        >
          <input
            ref={inputRef}
            data-testid="language-combobox-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("languageSearch")}
            className="h-10 w-full border-b border-border bg-transparent px-3 text-sm outline-none"
            aria-label={t("languageSearch")}
            autoComplete="off"
          />
          <ul
            id={`${id}-listbox`}
            role="listbox"
            data-testid="language-combobox-list"
            className="max-h-56 overflow-y-auto py-1"
            aria-label={t("language")}
          >
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">{t("languageEmpty")}</li>
            )}
            {filtered.map((option) => {
              const active = option.code === value;
              return (
                <li key={option.code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted",
                      active && "bg-primary/10 font-medium",
                    )}
                    onClick={() => {
                      onChange(option.code);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    <CheckIcon className={cn("size-4", active ? "opacity-100" : "opacity-0")} aria-hidden />
                    <span className="flex-1">{option.label}</span>
                    <span className="text-xs font-semibold tracking-wide text-muted-foreground">{option.code}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
