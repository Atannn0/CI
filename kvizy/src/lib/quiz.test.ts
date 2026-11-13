import { describe, expect, it } from "vitest";
import { normalizeText, pluralQuizzes, urlKey, validateQuizInput } from "./quiz";

describe("normalizeText", () => {
  it("strips diacritics and case", () => {
    expect(normalizeText("Která SERIÁLOVÁ postava jsi?")).toBe("ktera serialova postava jsi?");
    expect(normalizeText("Jídlo")).toBe(normalizeText("jidlo"));
  });
});

describe("urlKey", () => {
  it("treats scheme, www, trailing slash, fragment and param order as the same link", () => {
    const key = urlKey("https://www.Example.com/quiz/?b=2&a=1#start");
    expect(urlKey("http://example.com/quiz?a=1&b=2")).toBe(key);
  });

  it("keeps different paths apart", () => {
    expect(urlKey("https://example.com/quiz-1")).not.toBe(urlKey("https://example.com/quiz-2"));
  });

  it("rejects non-http links", () => {
    expect(urlKey("ftp://example.com/quiz")).toBeNull();
    expect(urlKey("javascript:alert(1)")).toBeNull();
    expect(urlKey("not a url")).toBeNull();
  });
});

describe("validateQuizInput", () => {
  const valid = {
    title: "  Poznáš film podle záběru? ",
    url: "https://example.com/film",
    format: "image",
    language: "cs",
    types: ["knowledge"],
    description: "",
    topic: " Filmy ",
  };

  it("accepts a complete quiz and normalises optional fields", () => {
    const result = validateQuizInput(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.title).toBe("Poznáš film podle záběru?");
      expect(result.value.description).toBeNull();
      expect(result.value.descriptionCs).toBe("Kvíz o: Poznáš film podle záběru?");
      expect(result.value.descriptionEn).toBe("Quiz about: Poznáš film podle záběru?");
      expect(result.value.topic).toBe("filmy");
    }
  });

  it("keeps a filled description as CS and templates EN when the text is Czech", () => {
    const result = validateQuizInput({ ...valid, description: "  Těžké české hádanky  " });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.description).toBe("Těžké české hádanky");
      expect(result.value.descriptionCs).toBe("Těžké české hádanky");
      expect(result.value.descriptionEn).toBe("Quiz about: Poznáš film podle záběru?");
    }
  });

  it("requires title, link, format, at least one type and language", () => {
    const result = validateQuizInput({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(["format", "language", "title", "types", "url"]);
    }
  });

  it("accepts http and https but nothing else", () => {
    expect(validateQuizInput({ ...valid, url: "http://example.com/a" }).ok).toBe(true);
    expect(validateQuizInput({ ...valid, url: "ftp://example.com/a" }).ok).toBe(false);
    expect(validateQuizInput({ ...valid, url: "example.com/a" }).ok).toBe(false);
    expect(validateQuizInput({ ...valid, url: "javascript:alert(1)" }).ok).toBe(false);
    expect(validateQuizInput({ ...valid, url: "data:text/html,<script>alert(1)</script>" }).ok).toBe(false);
  });

  it("rejects unknown enum values but accepts extended languages", () => {
    expect(validateQuizInput({ ...valid, format: "video" }).ok).toBe(false);
    expect(validateQuizInput({ ...valid, types: ["funny"] }).ok).toBe(false);
    expect(validateQuizInput({ ...valid, language: "xx" }).ok).toBe(false);
    expect(validateQuizInput({ ...valid, language: "de" }).ok).toBe(true);
    expect(validateQuizInput({ ...valid, language: "ja" }).ok).toBe(true);
    expect(validateQuizInput({ ...valid, language: "zh" }).ok).toBe(true);
  });

  it("ignores client attempts to set clicks, id or isCollection", () => {
    const result = validateQuizInput({
      ...valid,
      clicks: 999_999,
      id: 42,
      isCollection: true,
      verified: true,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).not.toHaveProperty("clicks");
      expect(result.value).not.toHaveProperty("id");
      expect(result.value).not.toHaveProperty("isCollection");
    }
  });

  it("enforces text length limits without fetching the URL", () => {
    const longTitle = "a".repeat(121);
    expect(validateQuizInput({ ...valid, title: longTitle }).ok).toBe(false);
    const longDesc = "b".repeat(301);
    expect(validateQuizInput({ ...valid, description: longDesc }).ok).toBe(false);
  });
});

describe("pluralQuizzes", () => {
  it("uses Czech plural forms", () => {
    expect([0, 1, 2, 4, 5, 22].map(pluralQuizzes)).toEqual([
      "0 kvízů",
      "1 kvíz",
      "2 kvízy",
      "4 kvízy",
      "5 kvízů",
      "22 kvízů",
    ]);
  });
});
