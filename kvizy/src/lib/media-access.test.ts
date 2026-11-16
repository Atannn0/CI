import { describe, expect, it } from "vitest";
import { detectImageMime, MEDIA_LIMITS } from "./media";

describe("media magic bytes", () => {
  it("accepts jpeg/png/gif/webp signatures and rejects others", () => {
    expect(detectImageMime(Uint8Array.of(0xff, 0xd8, 0xff, 0x00))).toBe("image/jpeg");
    expect(detectImageMime(Uint8Array.of(0x89, 0x50, 0x4e, 0x47))).toBe("image/png");
    expect(detectImageMime(Uint8Array.of(0x47, 0x49, 0x46, 0x38))).toBe("image/gif");
    const webp = new Uint8Array(12);
    webp.set([0x52, 0x49, 0x46, 0x46], 0);
    webp.set([0x57, 0x45, 0x42, 0x50], 8);
    expect(detectImageMime(webp)).toBe("image/webp");
    expect(detectImageMime(Uint8Array.of(0x00, 0x01))).toBeNull();
  });

  it("documents the 1 MB upload cap", () => {
    expect(MEDIA_LIMITS.maxBytes).toBe(1024 * 1024);
  });
});
