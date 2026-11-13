import { headers } from "next/headers";
import { isRateLimited, isSameOrigin, MAX_BODY_BYTES, methodNotAllowed, RATE_LIMITS, safeServerError } from "@/lib/guard";
import { validateCustomQuizInput } from "@/lib/custom-quiz";
import { createCustomQuiz } from "@/lib/custom-quizzes-repo";
import { DEFAULT_LOCALE, type UiLocale } from "@/lib/i18n/messages";

function requestLocale(request: Request): UiLocale {
  const header = request.headers.get("accept-language")?.toLowerCase() ?? "";
  return header.startsWith("en") ? "en" : DEFAULT_LOCALE;
}

async function requestOrigin(request: Request): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? new URL(request.url).host;
  return `${proto}://${host}`;
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
  if (text.length > MAX_BODY_BYTES * 8) {
    return Response.json({ error: "too_large", message: "Data formuláře jsou příliš velká." }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "invalid_json", message: "Neplatná data formuláře." }, { status: 400 });
  }

  const locale = requestLocale(request);
  const parsed = validateCustomQuizInput(body, locale);
  if (!parsed.ok) {
    return Response.json(
      {
        error: "validation",
        message: locale === "en" ? "Check the highlighted fields." : "Zkontroluj zvýrazněná pole.",
        fields: parsed.errors,
      },
      { status: 422 },
    );
  }

  try {
    const origin = await requestOrigin(request);
    const result = await createCustomQuiz(parsed.value, origin);
    if (!result.ok) {
      return Response.json(
        {
          error: "validation",
          message: locale === "en" ? "An image is missing or invalid." : "Obrázek chybí nebo je neplatný.",
          fields: { detail: locale === "en" ? "Re-upload the images." : "Nahraj obrázky znovu." },
        },
        { status: 422 },
      );
    }
    return Response.json({ quiz: result.quiz }, { status: 201 });
  } catch {
    return safeServerError("Uložení se nepovedlo. Zkus to znovu.");
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
