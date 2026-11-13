import { registerClick } from "@/lib/quizzes-repo";

export async function POST(_request: Request, ctx: RouteContext<"/api/quizzes/[id]/click">) {
  const { id } = await ctx.params;
  const quizId = Number(id);
  if (!Number.isSafeInteger(quizId) || quizId <= 0) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  const clicks = await registerClick(quizId);
  if (clicks === null) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ clicks });
}
