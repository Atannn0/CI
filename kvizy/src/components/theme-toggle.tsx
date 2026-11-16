"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLocale();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const dark = mounted && resolvedTheme === "dark";
  const label = dark ? t("themeToLight") : t("themeToDark");

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      title={label}
      aria-label={label}
      disabled={!mounted}
      className={cn(
        "grid size-9 place-items-center rounded-full border border-violet-300/80 bg-white/70 text-violet-900 shadow-sm outline-none transition-colors",
        "hover:bg-violet-100 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "dark:border-violet-700 dark:bg-violet-950/70 dark:text-violet-100 dark:hover:bg-violet-900",
        !mounted && "opacity-70",
      )}
      data-testid="theme-toggle"
    >
      {dark ? <SunIcon className="size-4" aria-hidden /> : <MoonIcon className="size-4" aria-hidden />}
    </button>
  );
}
