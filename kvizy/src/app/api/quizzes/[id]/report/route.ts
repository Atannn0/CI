import { isRateLimited, isSameOrigin, MAX_BODY_BYTES } from "@/lib/guard";
import { createReport } from "@/lib/quizzes-repo";
import { validateReportInput } from "@/lib/report";

export async function POST(request: Request, ctx: RouteContext<"/api/quizzes/[id]/report">) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden", message: "Požadavek z cizího webu." }, { status: 403 });
  }
  if (isRateLimited(request, "report", 10, 10 * 60_000)) {
    return Response.json(
      { error: "rate_limited", message: "Odesíláš hlášení moc rychle. Zkus to za pár minut." },
      { status: 429 },
    );
  }

  const { id } = await ctx.params;
  const quizId = Number(id);
  if (!Number.isSafeInteger(quizId) || quizId <= 0) {
    return Response.json({ error: "not_found", message: "Tento kvíz v katalogu není." }, { status: 404 });
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return Response.json({ error: "too_large", message: "Hlášení je příliš dlouhé." }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "invalid_json", message: "Neplatná data hlášení." }, { status: 400 });
  }

  const parsed = validateReportInput(body);
  if (!parsed.ok) {
    return Response.json(
      { error: "validation", message: "Zkontroluj zvýrazněná pole.", fields: parsed.errors },
      { status: 422 },
    );
  }

  const report = await createReport(quizId, parsed.value);
  if (!report) return Response.json({ error: "not_found", message: "Tento kvíz v katalogu není." }, { status: 404 });
  return Response.json({ ok: true }, { status: 201 });
}
