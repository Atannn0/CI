"use client";

import Link from "next/link";
import { ArrowLeftIcon, SparklesIcon } from "lucide-react";
import { LocaleSwitch } from "@/components/locale-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { LocaleProvider, useLocale } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";
import type { MessageKey } from "@/lib/i18n/messages";

const SECTIONS: Array<{ title: MessageKey; body: MessageKey }> = [
  { title: "privacyNoAccountsTitle", body: "privacyNoAccountsBody" },
  { title: "privacyLocalTitle", body: "privacyLocalBody" },
  { title: "privacyIpTitle", body: "privacyIpBody" },
  { title: "privacyReportsTitle", body: "privacyReportsBody" },
  { title: "privacyUploadsTitle", body: "privacyUploadsBody" },
  { title: "privacyCatalogTitle", body: "privacyCatalogBody" },
  { title: "privacyProcessorsTitle", body: "privacyProcessorsBody" },
  { title: "privacyAdultTitle", body: "privacyAdultBody" },
  { title: "privacyCookiesTitle", body: "privacyCookiesBody" },
  { title: "privacyContactTitle", body: "privacyContactBody" },
];

export function PrivacyPage() {
  return (
    <LocaleProvider>
      <PrivacyPageInner />
    </LocaleProvider>
  );
}

function PrivacyPageInner() {
  const { t } = useLocale();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-violet-200/70 bg-lavender text-violet-950 dark:border-violet-800/60 dark:bg-violet-950 dark:text-violet-50">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <p className="inline-flex min-w-0 items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-600 text-white shadow-sm dark:bg-violet-500">
              <SparklesIcon className="size-5" aria-hidden />
            </span>
            <span className="truncate">{t("brand")}</span>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <LocaleSwitch />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit gap-1.5")}
            data-testid="privacy-back"
          >
            <ArrowLeftIcon className="size-4" aria-hidden />
            {t("privacyBack")}
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-balance sm:text-4xl">{t("privacyTitle")}</h1>
          <p className="text-base text-muted-foreground sm:text-lg">{t("privacyLead")}</p>
        </div>

        <div className="flex flex-col gap-6" data-testid="privacy-sections">
          {SECTIONS.map((section) => (
            <section key={section.title} className="flex flex-col gap-2 rounded-2xl bg-card p-4 ring-1 ring-border sm:p-5">
              <h2 className="text-lg font-bold tracking-tight">{t(section.title)}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{t(section.body)}</p>
            </section>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">{t("privacyUpdated")}</p>
      </main>
    </div>
  );
}
