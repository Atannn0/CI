"use client";

import { useMemo, useState } from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { filterLanguageOptions } from "@/lib/language-filter";
import { languageCodeBadge, type LanguageOption, type QuizLanguage } from "@/lib/languages";
import { useLocale } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: LanguageOption[];
  selected: QuizLanguage[];
  onToggle: (code: QuizLanguage) => void;
};

export function OtherLanguagePicker({ open, onOpenChange, options, selected, onToggle }: Props) {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => filterLanguageOptions(options, query), [options, query]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("otherLanguage")}</DialogTitle>
          <DialogDescription>{t("otherLanguageSearch")}</DialogDescription>
        </DialogHeader>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("otherLanguageSearch")}
          data-testid="other-language-search"
          autoFocus
        />
        <div className="flex max-h-80 flex-col gap-1 overflow-y-auto" data-testid="other-language-list">
          {filtered.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">{t("otherLanguageEmpty")}</p>
          ) : (
            filtered.map((option) => {
              const pressed = selected.includes(option.code);
              return (
                <button
                  key={option.code}
                  type="button"
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-muted",
                    pressed && "bg-primary/10 font-semibold",
                  )}
                  onClick={() => onToggle(option.code)}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[0.65rem] font-bold tracking-wide">
                      {languageCodeBadge(option.code)}
                    </span>
                    {option.label}
                  </span>
                  {pressed ? <CheckIcon className="size-4 text-primary" aria-hidden /> : null}
                </button>
              );
            })
          )}
        </div>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          {t("cancel")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
