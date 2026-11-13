import { connection } from "next/server";
import { validateQuizInput } from "@/lib/quiz";
import { createQuiz, listQuizzes } from "@/lib/quizzes-repo";

export async function GET() {
  await connection();
  return Response.json({ quizzes: await listQuizzes() });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
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
