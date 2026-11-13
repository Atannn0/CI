"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { REPORT_REASON_LABELS, type QuizReport } from "@/lib/report";

const DATE_FORMAT = new Intl.DateTimeFormat("cs-CZ", { dateStyle: "medium", timeStyle: "short" });

export function AdminReports() {
  const [token, setToken] = useState("");
  const [reports, setReports] = useState<QuizReport[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      setError(
        response.status === 404
          ? "Správa hlášení je vypnutá: na serveru není nastavený přístupový klíč."
          : response.status === 429
            ? "Příliš mnoho pokusů. Zkus to za minutu."
            : "Neplatný přístupový klíč.",
      );
    } catch {
      setError("Hlášení se nepodařilo načíst. Zkontroluj připojení.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={load} className="flex flex-col gap-2 sm:max-w-md" aria-label="Přihlášení správce">
        <Label htmlFor="admin-token">Přístupový klíč správce</Label>
        <div className="flex gap-2">
          <Input
            id="admin-token"
            type="password"
            autoComplete="current-password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button type="submit" size="lg" disabled={loading || token.trim() === ""}>
            {loading ? "Načítám…" : "Zobrazit hlášení"}
          </Button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </form>

      {reports && reports.length === 0 && <p className="text-muted-foreground">Zatím žádná hlášení.</p>}
      {reports && reports.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-card ring-1 ring-border">
          <table className="w-full text-left text-sm" data-testid="admin-reports">
            <thead className="bg-muted/60 text-xs tracking-wider text-muted-foreground uppercase">
              <tr>
                <th className="px-3 py-2 font-semibold">Čas</th>
                <th className="px-3 py-2 font-semibold">Kvíz</th>
                <th className="px-3 py-2 font-semibold">Důvod</th>
                <th className="px-3 py-2 font-semibold">Doplnění</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t align-top">
                  <td className="px-3 py-2 whitespace-nowrap">{DATE_FORMAT.format(new Date(report.createdAt))}</td>
                  <td className="px-3 py-2">
                    <a href={report.quizUrl} target="_blank" rel="noopener noreferrer" className="font-medium underline">
                      {report.quizTitle}
                    </a>
                    <span className="block text-xs text-muted-foreground">ID {report.quizId}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{REPORT_REASON_LABELS[report.reason]}</td>
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
