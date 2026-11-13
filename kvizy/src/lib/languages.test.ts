import { describe, expect, it } from "vitest";
import { catalogLanguages, isQuizLanguage, languageOptions, languageLabel } from "./languages";

describe("languages", () => {
  it("accepts standard codes including ja and zh", () => {
    expect(isQuizLanguage("cs")).toBe(true);
    expect(isQuizLanguage("ja")).toBe(true);
    expect(isQuizLanguage("zh")).toBe(true);
    expect(isQuizLanguage("de")).toBe(true);
    expect(isQuizLanguage("xx")).toBe(false);
  });

  it("searches without diacritics (nem → Němčina)", () => {
    const options = languageOptions("cs");
    const hit = options.filter((o) => o.search.includes("nem"));
    expect(hit.some((o) => o.code === "de")).toBe(true);
    expect(languageLabel("de", "cs").toLowerCase()).toContain("něm");
  });

  it("lists only languages present in the catalog for filters", () => {
    const opts = catalogLanguages(["en", "ja", "en"], "cs");
    expect(opts.map((o) => o.code).sort()).toEqual(["en", "ja"]);
  });
});
