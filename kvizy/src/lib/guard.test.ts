import { describe, expect, it } from "vitest";
import { isSameOrigin } from "./guard";

function post(headers: Record<string, string>) {
  return new Request("http://internal/api/quizzes", { method: "POST", headers });
}

describe("isSameOrigin", () => {
  it("accepts requests without Origin", () => {
    expect(isSameOrigin(post({ host: "localhost:4387" }))).toBe(true);
  });

  it("accepts the local dev origin", () => {
    expect(isSameOrigin(post({ origin: "http://localhost:4387", host: "localhost:4387" }))).toBe(true);
  });

  it("accepts Vercel production, preview and custom domains behind the proxy", () => {
    for (const domain of ["kvizy.vercel.app", "kvizy-git-feature-atannn0.vercel.app", "kvizy.example.cz"]) {
      expect(isSameOrigin(post({ origin: `https://${domain}`, host: domain, "x-forwarded-host": domain }))).toBe(true);
    }
  });

  it("accepts when only x-forwarded-host carries the public host", () => {
    expect(
      isSameOrigin(post({ origin: "https://kvizy.vercel.app", host: "internal:3000", "x-forwarded-host": "kvizy.vercel.app" })),
    ).toBe(true);
  });

  it("rejects other sites and malformed origins", () => {
    expect(isSameOrigin(post({ origin: "https://evil.example", host: "kvizy.vercel.app" }))).toBe(false);
    expect(isSameOrigin(post({ origin: "https://kvizy.vercel.app.evil.example", host: "kvizy.vercel.app" }))).toBe(false);
    expect(isSameOrigin(post({ origin: "null", host: "kvizy.vercel.app" }))).toBe(false);
  });
});
