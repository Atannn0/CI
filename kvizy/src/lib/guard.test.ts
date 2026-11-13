import { afterEach, describe, expect, it } from "vitest";
import { isRateLimited, isSameOrigin, methodNotAllowed, RATE_LIMITS, resetRateLimitsForTests } from "./guard";

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

describe("isRateLimited", () => {
  afterEach(() => resetRateLimitsForTests());

  it("allows up to the limit then blocks further requests in the window", () => {
    const req = post({ "x-forwarded-for": "203.0.113.9" });
    const { limit, windowMs } = RATE_LIMITS.create;
    for (let i = 0; i < limit; i++) {
      expect(isRateLimited(req, "create-test", limit, windowMs)).toBe(false);
    }
    expect(isRateLimited(req, "create-test", limit, windowMs)).toBe(true);
  });
});

describe("methodNotAllowed", () => {
  it("returns 405 with Allow header", async () => {
    const res = methodNotAllowed("GET, POST");
    expect(res.status).toBe(405);
    expect(res.headers.get("Allow")).toBe("GET, POST");
    expect((await res.json()).error).toBe("method_not_allowed");
  });
});
