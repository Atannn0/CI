import { isRateLimited, isSameOrigin, MAX_BODY_BYTES, methodNotAllowed, RATE_LIMITS, safeServerError } from "@/lib/guard";
import { gradeSubmission } from "@/lib/custom-quizzes-repo";
import { registerClick } from "@/lib/quizzes-repo";

export async function POST(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  if (!isSameOrigin(request)) return Response.json({ error: "forbidden" }, { status: 403 });
  if (isRateLimited(request, "click", RATE_LIMITS.click.limit, RATE_LIMITS.click.windowMs)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const { slug } = await ctx.params;
  if (!slug || slug.length > 80) return Response.json({ error: "not_found" }, { status: 404 });

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return Response.json({ error: "too_large" }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const answersRaw = (body && typeof body === "object" ? (body as { answers?: unknown }).answers : null) ?? {};
  const answers: Record<string, number> = {};
  if (answersRaw && typeof answersRaw === "object") {
    for (const [key, value] of Object.entries(answersRaw as Record<string, unknown>)) {
      const n = Number(value);
      if (Number.isSafeInteger(n) && n > 0) answers[key] = n;
    }
  }

  try {
    const graded = await gradeSubmission(slug, answers);
    if (!graded) return Response.json({ error: "not_found" }, { status: 404 });
    const payload = await import("@/lib/custom-quizzes-repo").then((m) => m.loadPlayPayload(slug));
    if (payload) await registerClick(payload.quiz.id);
    return Response.json(graded);
  } catch {
    return safeServerError();
  }
}

export function GET() {
  return methodNotAllowed("POST");
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
