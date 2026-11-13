"use client";

import { useLocale } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

export function LocaleSwitch() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div
      role="group"
      aria-label={t("localeSwitch")}
      className="inline-flex h-9 items-center rounded-full border border-violet-300/80 bg-white/70 p-0.5 text-sm font-semibold shadow-sm"
      data-testid="locale-switch"
    >
      {(["cs", "en"] as const).map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(code)}
            className={cn(
              "rounded-full px-2.5 py-1 transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              active ? "bg-violet-600 text-white" : "text-violet-900/80 hover:bg-violet-100",
            )}
          >
            {code === "cs" ? t("localeCs") : t("localeEn")}
          </button>
        );
      })}
    </div>
  );
}
