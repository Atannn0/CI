import { connection } from "next/server";
import { methodNotAllowed, safeServerError } from "@/lib/guard";
import { getMedia } from "@/lib/media-repo";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  await connection();
  try {
    const { id: raw } = await ctx.params;
    const id = Number(raw);
    const media = await getMedia(id);
    if (!media) return new Response("Not found", { status: 404 });
    return new Response(new Uint8Array(media.data), {
      status: 200,
      headers: {
        "Content-Type": media.mimeType,
        "Content-Length": String(media.byteSize),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
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
