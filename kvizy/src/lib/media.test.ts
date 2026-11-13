import { describe, expect, it } from "vitest";
import { detectImageMime } from "./media";

describe("detectImageMime", () => {
  it("recognises PNG and JPEG signatures", () => {
    expect(detectImageMime(Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a))).toBe("image/png");
    expect(detectImageMime(Uint8Array.of(0xff, 0xd8, 0xff, 0xe0))).toBe("image/jpeg");
  });

  it("rejects unknown bytes", () => {
    expect(detectImageMime(Uint8Array.of(0x00, 0x01, 0x02))).toBeNull();
  });
});
