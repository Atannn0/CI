import { describe, expect, it } from "vitest";
import {
  filterLanguageOptions,
  languageCountsFromCodes,
  shouldShowOtherLanguage,
  topCatalogLanguages,
} from "./language-filter";

describe("language filter helpers", () => {
  it("shows Other language only from 9 distinct languages", () => {
    expect(shouldShowOtherLanguage(8)).toBe(false);
    expect(shouldShowOtherLanguage(9)).toBe(true);
  });

  it("picks top 7 by count then name", () => {
    const counts = languageCountsFromCodes([
      "cs",
      "cs",
      "en",
      "en",
      "en",
      "de",
      "de",
      "fr",
      "it",
      "ja",
      "ko",
      "sv",
      "es",
    ]);
    const top = topCatalogLanguages(counts, "cs", 7);
    expect(top).toHaveLength(7);
    expect(top[0]).toBe("en");
    expect(top[1]).toBe("cs");
    expect(top[2]).toBe("de");
  });

  it("filters other-language search without diacritics", () => {
    const options = [
      { code: "cs" as const, label: "Čeština" },
      { code: "fr" as const, label: "Francouzština" },
    ];
    expect(filterLanguageOptions(options, "cest").map((o) => o.code)).toEqual(["cs"]);
    expect(filterLanguageOptions(options, "FRAN").map((o) => o.code)).toEqual(["fr"]);
  });
});
