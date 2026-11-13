import { isRateLimited, isSameOrigin, methodNotAllowed, RATE_LIMITS, safeServerError } from "@/lib/guard";
import { registerClick } from "@/lib/quizzes-repo";

export async function POST(request: Request, ctx: RouteContext<"/api/quizzes/[id]/click">) {
  if (!isSameOrigin(request)) return Response.json({ error: "forbidden" }, { status: 403 });
  if (isRateLimited(request, "click", RATE_LIMITS.click.limit, RATE_LIMITS.click.windowMs)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const { id } = await ctx.params;
  const quizId = Number(id);
  if (!Number.isSafeInteger(quizId) || quizId <= 0) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  try {
    const clicks = await registerClick(quizId);
    if (clicks === null) return Response.json({ error: "not_found" }, { status: 404 });
    return Response.json({ clicks });
  } catch {
    return safeServerError();
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
