import { describe, expect, it } from "vitest";
import { bilingualDescriptions, localizedDescription } from "./descriptions";

describe("bilingualDescriptions", () => {
  it("fills both locales from templates when description is empty or whitespace", () => {
    expect(bilingualDescriptions("Můj kvíz", null)).toEqual({
      description: null,
      descriptionCs: "Kvíz o: Můj kvíz",
      descriptionEn: "Quiz about: Můj kvíz",
    });
    expect(bilingualDescriptions("Můj kvíz", "   ")).toEqual({
      description: null,
      descriptionCs: "Kvíz o: Můj kvíz",
      descriptionEn: "Quiz about: Můj kvíz",
    });
  });

  it("keeps the original and prefers explicit translations", () => {
    const result = bilingualDescriptions("Colors", "Barevný kvíz", {
      cs: "Český popis",
      en: "English blurb",
    });
    expect(result).toEqual({
      description: "Barevný kvíz",
      descriptionCs: "Český popis",
      descriptionEn: "English blurb",
    });
  });

  it("uses an English template when the original is Czech-only", () => {
    const result = bilingualDescriptions("Hádanky", "Těžké české hádanky");
    expect(result.description).toBe("Těžké české hádanky");
    expect(result.descriptionCs).toBe("Těžké české hádanky");
    expect(result.descriptionEn).toBe("Quiz about: Hádanky");
  });
});

describe("localizedDescription", () => {
  it("switches blurbs with the UI locale", () => {
    const quiz = {
      title: "X",
      description: "orig",
      descriptionCs: "Česky",
      descriptionEn: "English",
    };
    expect(localizedDescription(quiz, "cs")).toBe("Česky");
    expect(localizedDescription(quiz, "en")).toBe("English");
  });
});
