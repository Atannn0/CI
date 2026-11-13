import { connection } from "next/server";
import { isRateLimited, isSameOrigin, MAX_BODY_BYTES } from "@/lib/guard";
import { validateQuizInput } from "@/lib/quiz";
import { createQuiz, listQuizzes } from "@/lib/quizzes-repo";

export async function GET() {
  await connection();
  return Response.json({ quizzes: await listQuizzes() });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden", message: "Požadavek z cizího webu." }, { status: 403 });
  }
  if (isRateLimited(request, "create", 10, 60_000)) {
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

  const parsed = validateQuizInput(body);
  if (!parsed.ok) {
    return Response.json(
      { error: "validation", message: "Zkontroluj zvýrazněná pole.", fields: parsed.errors },
      { status: 422 },
    );
  }

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
}
