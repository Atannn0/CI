import { describe, expect, it } from "vitest";
import { assertPreviewDatabaseReady } from "./preview-db";

describe("assertPreviewDatabaseReady", () => {
  it("allows production and local without the ready flag", () => {
    expect(() => assertPreviewDatabaseReady({ VERCEL_ENV: "production" })).not.toThrow();
    expect(() => assertPreviewDatabaseReady({ VERCEL_ENV: "development" })).not.toThrow();
    expect(() => assertPreviewDatabaseReady({})).not.toThrow();
  });

  it("allows preview only when KVIZY_PREVIEW_DB_READY=1", () => {
    expect(() =>
      assertPreviewDatabaseReady({ VERCEL_ENV: "preview", KVIZY_PREVIEW_DB_READY: "1" }),
    ).not.toThrow();
    expect(() => assertPreviewDatabaseReady({ VERCEL_ENV: "preview" })).toThrow(/Preview database/);
    expect(() =>
      assertPreviewDatabaseReady({ VERCEL_ENV: "preview", KVIZY_PREVIEW_DB_READY: "0" }),
    ).toThrow(/Preview database/);
  });
});
