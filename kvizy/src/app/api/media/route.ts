import { isRateLimited, isSameOrigin, methodNotAllowed, RATE_LIMITS, safeServerError } from "@/lib/guard";
import { MEDIA_LIMITS } from "@/lib/media";
import { storeMedia } from "@/lib/media-repo";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden", message: "Požadavek z cizího webu." }, { status: 403 });
  }
  if (isRateLimited(request, "media", RATE_LIMITS.create.limit, RATE_LIMITS.create.windowMs)) {
    return Response.json({ error: "rate_limited", message: "Nahráváš moc rychle." }, { status: 429 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "validation", message: "Chybí soubor." }, { status: 422 });
    }
    if (file.size > MEDIA_LIMITS.maxBytes) {
      return Response.json(
        {
          error: "too_large",
          message: `Obrázek smí mít nejvýše ${MEDIA_LIMITS.maxBytes / 1024} KB.`,
        },
        { status: 413 },
      );
    }
    const buffer = new Uint8Array(await file.arrayBuffer());
    const stored = await storeMedia(buffer);
    if (!stored.ok) {
      const message =
        stored.error === "too_large"
          ? `Obrázek smí mít nejvýše ${MEDIA_LIMITS.maxBytes / 1024} KB.`
          : stored.error === "invalid_type"
            ? `Povolené formáty: JPEG, PNG, WebP, GIF.`
            : "Soubor se nepodařilo nahrát.";
      return Response.json({ error: stored.error, message }, { status: 422 });
    }
    return Response.json(
      {
        id: stored.id,
        mimeType: stored.mimeType,
        url: `/api/media/${stored.id}`,
        maxBytes: MEDIA_LIMITS.maxBytes,
        allowed: MEDIA_LIMITS.allowedMime,
      },
      { status: 201 },
    );
  } catch {
    return safeServerError("Nahrání se nepovedlo.");
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
