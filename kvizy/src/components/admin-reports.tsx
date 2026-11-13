"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocaleProvider, useLocale } from "@/lib/i18n/locale";
import { LocaleSwitch } from "@/components/locale-switch";
import { REPORT_REASON_KEYS, type QuizReport } from "@/lib/report";

export function AdminReports() {
  return (
    <LocaleProvider>
      <AdminReportsInner />
    </LocaleProvider>
  );
}

function AdminReportsInner() {
  const { locale, t } = useLocale();
  const [token, setToken] = useState("");
  const [reports, setReports] = useState<QuizReport[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dateFormat = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  async function load(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/reports", {
        headers: { Authorization: `Bearer ${token.trim()}` },
        cache: "no-store",
      });
      if (response.ok) {
        setReports(((await response.json()) as { reports: QuizReport[] }).reports);
        return;
      }
      setReports(null);
      setError(response.status === 404 ? t("adminClosed") : response.status === 429 ? t("adminRate") : t("adminDenied"));
    } catch {
      setError(t("adminLoadFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <LocaleSwitch />
      </div>
      <form onSubmit={load} className="flex flex-col gap-2 sm:max-w-md" aria-label={t("adminLogin")}>
        <Label htmlFor="admin-token">{t("adminToken")}</Label>
        <div className="flex gap-2">
          <Input
            id="admin-token"
            type="password"
            autoComplete="current-password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button type="submit" size="lg" disabled={loading || token.trim() === ""}>
            {loading ? t("adminLoading") : t("adminShow")}
          </Button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </form>

      {reports && reports.length === 0 && <p className="text-muted-foreground">{t("adminEmpty")}</p>}
      {reports && reports.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-card ring-1 ring-border">
          <table className="w-full text-left text-sm" data-testid="admin-reports">
            <thead className="bg-muted/60 text-xs tracking-wider text-muted-foreground uppercase">
              <tr>
                <th className="px-3 py-2 font-semibold">{t("adminTime")}</th>
                <th className="px-3 py-2 font-semibold">{t("adminQuiz")}</th>
                <th className="px-3 py-2 font-semibold">{t("adminReasonCol")}</th>
                <th className="px-3 py-2 font-semibold">{t("adminNoteCol")}</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t align-top">
                  <td className="px-3 py-2 whitespace-nowrap">{dateFormat.format(new Date(report.createdAt))}</td>
                  <td className="px-3 py-2">
                    <a href={report.quizUrl} target="_blank" rel="noopener noreferrer" className="font-medium underline">
                      {report.quizTitle}
                    </a>
                    <span className="block text-xs text-muted-foreground">ID {report.quizId}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{t(REPORT_REASON_KEYS[report.reason])}</td>
                  <td className="px-3 py-2 break-words">{report.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
