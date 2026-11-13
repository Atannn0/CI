import { connection } from "next/server";
import { methodNotAllowed, safeServerError } from "@/lib/guard";
import { loadPlayPayload } from "@/lib/custom-quizzes-repo";

export async function GET(_request: Request, ctx: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await ctx.params;
  if (!slug || slug.length > 80) return Response.json({ error: "not_found" }, { status: 404 });
  try {
    const payload = await loadPlayPayload(slug);
    if (!payload) return Response.json({ error: "not_found" }, { status: 404 });
    return Response.json(payload);
  } catch {
    return safeServerError();
  }
}

export function POST() {
  return methodNotAllowed("GET");
}

export function PUT() {
  return methodNotAllowed("GET");
}

export function PATCH() {
  return methodNotAllowed("GET");
}

export function DELETE() {
  return methodNotAllowed("GET");
}
