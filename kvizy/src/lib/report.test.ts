import { describe, expect, it } from "vitest";
import { REPORT_LIMITS, REPORT_REASONS, validateReportInput } from "./report";

describe("validateReportInput", () => {
  it("accepts every reason with an optional note", () => {
    for (const reason of REPORT_REASONS.filter((r) => r !== "other")) {
      expect(validateReportInput({ reason })).toEqual({ ok: true, value: { reason, note: null } });
    }
    expect(validateReportInput({ reason: "broken_link", note: "  Stránka   hlásí 404 " })).toEqual({
      ok: true,
      value: { reason: "broken_link", note: "Stránka hlásí 404" },
    });
  });

  it("requires a reason from the list", () => {
    expect(validateReportInput({})).toMatchObject({ ok: false, errors: { reason: "Vyber důvod hlášení." } });
    expect(validateReportInput({ reason: "spam" })).toMatchObject({ ok: false });
    expect(validateReportInput(null)).toMatchObject({ ok: false });
  });

  it("requires a short description for Jiné", () => {
    expect(validateReportInput({ reason: "other" })).toMatchObject({ ok: false, errors: { note: expect.any(String) } });
    expect(validateReportInput({ reason: "other", note: "   ok  " })).toMatchObject({ ok: false });
    expect(validateReportInput({ reason: "other", note: "Kvíz je jen v němčině" })).toMatchObject({ ok: true });
  });

  it("limits the note length", () => {
    const long = "a".repeat(REPORT_LIMITS.note + 1);
    expect(validateReportInput({ reason: "duplicate", note: long })).toMatchObject({ ok: false, errors: { note: expect.any(String) } });
    expect(validateReportInput({ reason: "duplicate", note: 42 })).toEqual({ ok: true, value: { reason: "duplicate", note: null } });
  });
});
