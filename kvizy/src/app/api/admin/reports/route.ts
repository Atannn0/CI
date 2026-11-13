import { adminAccess } from "@/lib/admin";
import { isRateLimited, methodNotAllowed, RATE_LIMITS, safeServerError } from "@/lib/guard";
import { listReports } from "@/lib/quizzes-repo";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const access = adminAccess(request);
  if (access === "closed") return Response.json({ error: "not_found" }, { status: 404, headers: NO_STORE });
  if (isRateLimited(request, "admin", RATE_LIMITS.admin.limit, RATE_LIMITS.admin.windowMs)) {
    return Response.json({ error: "rate_limited" }, { status: 429, headers: NO_STORE });
  }
  if (access === "denied") {
    return Response.json(
      { error: "unauthorized", message: "Neplatný přístupový klíč." },
      { status: 401, headers: { ...NO_STORE, "WWW-Authenticate": "Bearer" } },
    );
  }
  try {
    return Response.json({ reports: await listReports() }, { headers: NO_STORE });
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
