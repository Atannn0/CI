import { isRateLimited, isSameOrigin } from "@/lib/guard";
import { registerClick } from "@/lib/quizzes-repo";

export async function POST(request: Request, ctx: RouteContext<"/api/quizzes/[id]/click">) {
  if (!isSameOrigin(request)) return Response.json({ error: "forbidden" }, { status: 403 });
  if (isRateLimited(request, "click", 60, 60_000)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const { id } = await ctx.params;
  const quizId = Number(id);
  if (!Number.isSafeInteger(quizId) || quizId <= 0) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  const clicks = await registerClick(quizId);
  if (clicks === null) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ clicks });
}
