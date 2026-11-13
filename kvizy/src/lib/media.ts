export const MEDIA_LIMITS = {
  maxBytes: 1024 * 1024,
  allowedMime: ["image/jpeg", "image/png", "image/webp", "image/gif"] as const,
  altMax: 200,
} as const;

export type AllowedMime = (typeof MEDIA_LIMITS.allowedMime)[number];

const SIGNATURES: Array<{ mime: AllowedMime; bytes: number[] }> = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
];

export function detectImageMime(buffer: Uint8Array): AllowedMime | null {
  for (const sig of SIGNATURES) {
    if (sig.bytes.every((b, i) => buffer[i] === b)) {
      if (sig.mime === "image/webp") {
        if (buffer.length < 12) return null;
        const tag = String.fromCharCode(buffer[8], buffer[9], buffer[10], buffer[11]);
        if (tag !== "WEBP") return null;
      }
      return sig.mime;
    }
  }
  return null;
}

export function mediaPublicPath(id: number): string {
  return `/api/media/${id}`;
}
