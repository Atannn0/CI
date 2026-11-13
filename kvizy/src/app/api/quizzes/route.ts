import { connection } from "next/server";
import { isRateLimited, isSameOrigin, MAX_BODY_BYTES, methodNotAllowed, RATE_LIMITS, safeServerError } from "@/lib/guard";
import { DEFAULT_LOCALE, type UiLocale } from "@/lib/i18n/messages";
import { validateQuizInput } from "@/lib/quiz";
import { createQuiz, listQuizzes } from "@/lib/quizzes-repo";

function requestLocale(request: Request): UiLocale {
  const header = request.headers.get("accept-language")?.toLowerCase() ?? "";
  return header.startsWith("en") ? "en" : DEFAULT_LOCALE;
}

export async function GET() {
  await connection();
  return Response.json({ quizzes: await listQuizzes() });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden", message: "Požadavek z cizího webu." }, { status: 403 });
  }
  if (isRateLimited(request, "create", RATE_LIMITS.create.limit, RATE_LIMITS.create.windowMs)) {
    return Response.json(
      { error: "rate_limited", message: "Přidáváš kvízy moc rychle. Zkus to za chvíli." },
      { status: 429 },
    );
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return Response.json({ error: "too_large", message: "Data formuláře jsou příliš velká." }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "invalid_json", message: "Neplatná data formuláře." }, { status: 400 });
  }

  const locale = requestLocale(request);
  const parsed = validateQuizInput(body, locale);
  if (!parsed.ok) {
    return Response.json(
      { error: "validation", message: locale === "en" ? "Check the highlighted fields." : "Zkontroluj zvýrazněná pole.", fields: parsed.errors },
      { status: 422 },
    );
  }

  try {
    const result = await createQuiz(parsed.value);
    if (!result.ok) {
      return Response.json(
        {
          error: "duplicate",
          message: result.duplicate
            ? `Tento odkaz už v katalogu je jako „${result.duplicate.title}“.`
            : "Tento odkaz už v katalogu je.",
          existing: result.duplicate,
        },
        { status: 409 },
      );
    }
    return Response.json({ quiz: result.quiz }, { status: 201 });
  } catch {
    // Never echo DB/connection details to the client.
    return safeServerError("Uložení se nepovedlo. Zkus to znovu.");
  }
}

export function PUT() {
  return methodNotAllowed("GET, POST");
}

export function PATCH() {
  return methodNotAllowed("GET, POST");
}

export function DELETE() {
  return methodNotAllowed("GET, POST");
}
