import { describe, expect, it } from "vitest";
import { EMPTY_FILTERS, filterQuizzes, popularQuizzes, toggleValue } from "./filter";
import type { Quiz } from "./quiz";

function quiz(partial: Partial<Quiz> & Pick<Quiz, "id" | "title">): Quiz {
  return {
    url: `https://example.com/${partial.id}`,
    description: null,
    language: "cs",
    format: "text",
    types: ["knowledge"],
    topic: null,
    clicks: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...partial,
  };
}

const catalog: Quiz[] = [
  quiz({ id: 1, title: "Poznáš film podle záběru?", format: "image", types: ["knowledge"], topic: "filmy", clicks: 5 }),
  quiz({ id: 2, title: "Která seriálová postava jsi?", types: ["personality"], topic: "seriály", clicks: 9 }),
  quiz({ id: 3, title: "Co bys radši?", types: ["preference"], description: "Těžké volby o jídle", clicks: 1 }),
  quiz({ id: 4, title: "Guess the flag", language: "en", format: "image", types: ["knowledge"], topic: "vlajky" }),
  quiz({ id: 5, title: "Riddles for friends", language: "en", format: "mixed", types: ["logic", "knowledge"] }),
];

const ids = (list: Quiz[]) => list.map((q) => q.id);

describe("filterQuizzes", () => {
  it("returns everything without filters", () => {
    expect(ids(filterQuizzes(catalog, EMPTY_FILTERS))).toEqual([1, 2, 3, 4, 5]);
  });

  it("searches title, description and topic ignoring diacritics and case", () => {
    expect(ids(filterQuizzes(catalog, { ...EMPTY_FILTERS, query: "SERIALOVA" }))).toEqual([2]);
    expect(ids(filterQuizzes(catalog, { ...EMPTY_FILTERS, query: "jidle" }))).toEqual([3]);
    expect(ids(filterQuizzes(catalog, { ...EMPTY_FILTERS, query: "serialy" }))).toEqual([2]);
    expect(ids(filterQuizzes(catalog, { ...EMPTY_FILTERS, query: "zaberu film" }))).toEqual([1]);
  });

  it("matches any selected value within one filter", () => {
    expect(ids(filterQuizzes(catalog, { ...EMPTY_FILTERS, formats: ["image", "mixed"] }))).toEqual([1, 4, 5]);
    expect(ids(filterQuizzes(catalog, { ...EMPTY_FILTERS, types: ["personality", "logic"] }))).toEqual([2, 5]);
    expect(ids(filterQuizzes(catalog, { ...EMPTY_FILTERS, languages: ["cs", "en"] }))).toHaveLength(5);
  });

  it("requires the query and all three filters at once", () => {
    const filters = { query: "", formats: ["image" as const], types: ["knowledge" as const], languages: ["en" as const] };
    expect(ids(filterQuizzes(catalog, filters))).toEqual([4]);
    expect(ids(filterQuizzes(catalog, { ...filters, query: "vlajky" }))).toEqual([4]);
    expect(ids(filterQuizzes(catalog, { ...filters, query: "film" }))).toEqual([]);
  });

  it("matches a quiz with several types when any of them is selected", () => {
    expect(ids(filterQuizzes(catalog, { ...EMPTY_FILTERS, types: ["logic"], languages: ["en"] }))).toEqual([5]);
    expect(ids(filterQuizzes(catalog, { ...EMPTY_FILTERS, types: ["knowledge"], formats: ["mixed"] }))).toEqual([5]);
  });
});

describe("popularQuizzes", () => {
  it("orders clicked quizzes by clicks and skips unopened ones", () => {
    expect(ids(popularQuizzes(catalog))).toEqual([2, 1, 3]);
    expect(ids(popularQuizzes(catalog, 2))).toEqual([2, 1]);
  });
});

describe("toggleValue", () => {
  it("adds and removes", () => {
    expect(toggleValue(["a"], "b")).toEqual(["a", "b"]);
    expect(toggleValue(["a", "b"], "a")).toEqual(["b"]);
  });
});
