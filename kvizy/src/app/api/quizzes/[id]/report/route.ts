import { isRateLimited, isSameOrigin, MAX_BODY_BYTES, methodNotAllowed, RATE_LIMITS, safeServerError } from "@/lib/guard";
import { DEFAULT_LOCALE, type UiLocale } from "@/lib/i18n/messages";
import { createReport } from "@/lib/quizzes-repo";
import { validateReportInput } from "@/lib/report";

function requestLocale(request: Request): UiLocale {
  const header = request.headers.get("accept-language")?.toLowerCase() ?? "";
  return header.startsWith("en") ? "en" : DEFAULT_LOCALE;
}

export async function POST(request: Request, ctx: RouteContext<"/api/quizzes/[id]/report">) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden", message: "Požadavek z cizího webu." }, { status: 403 });
  }
  if (isRateLimited(request, "report", RATE_LIMITS.report.limit, RATE_LIMITS.report.windowMs)) {
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

  const locale = requestLocale(request);
  const parsed = validateReportInput(body, locale);
  if (!parsed.ok) {
    return Response.json(
      { error: "validation", message: locale === "en" ? "Check the highlighted fields." : "Zkontroluj zvýrazněná pole.", fields: parsed.errors },
      { status: 422 },
    );
  }

  try {
    const report = await createReport(quizId, parsed.value);
    if (!report) return Response.json({ error: "not_found", message: "Tento kvíz v katalogu není." }, { status: 404 });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return safeServerError("Hlášení se nepovedlo uložit. Zkus to znovu.");
  }
}

export function PUT() {
  return methodNotAllowed("POST");
}

export function PATCH() {
  return methodNotAllowed("POST");
}

export function DELETE() {
  return methodNotAllowed("POST");
}

export function GET() {
  return methodNotAllowed("POST");
}
