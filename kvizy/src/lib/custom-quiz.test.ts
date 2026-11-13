import { describe, expect, it } from "vitest";
import { scorePersonalityDraft, validateCustomQuizInput } from "./custom-quiz";

describe("validateCustomQuizInput", () => {
  const base = {
    title: "Jaké zvíře jsi?",
    language: "cs",
    format: "text",
    mode: "personality",
    description: "",
    outcomes: [
      { key: "fox", title: "Liška", description: "Chytrá a rychlá." },
      { key: "owl", title: "Sova", description: "Moudrá." },
      { key: "otter", title: "Vydra", description: "Hrava." },
    ],
    questions: [
      {
        prompt: "Večer raději…",
        options: [
          { label: "Plánuji", outcomeKey: "owl", weight: 2 },
          { label: "Improvizuji", outcomeKey: "fox", weight: 3 },
          { label: "Hraju si", outcomeKey: "otter", weight: 1 },
        ],
      },
    ],
  };

  it("accepts a personality quiz with weighted outcomes", () => {
    const result = validateCustomQuizInput(base);
    expect(result.ok).toBe(true);
  });

  it("rejects answers mapped to a missing outcome", () => {
    const result = validateCustomQuizInput({
      ...base,
      questions: [
        {
          prompt: "Q",
          options: [
            { label: "A", outcomeKey: "missing", weight: 1 },
            { label: "B", outcomeKey: "fox", weight: 1 },
          ],
        },
      ],
    });
    expect(result.ok).toBe(false);
  });

  it("requires exactly one correct answer for knowledge mode", () => {
    const result = validateCustomQuizInput({
      title: "Math",
      language: "en",
      format: "text",
      mode: "knowledge",
      questions: [
        {
          prompt: "2+2?",
          options: [
            { label: "3", isCorrect: false },
            { label: "4", isCorrect: false },
          ],
        },
      ],
    });
    expect(result.ok).toBe(false);
  });
});

describe("scorePersonalityDraft", () => {
  it("breaks ties by outcome order", () => {
    const outcomes = [
      { key: "fox", title: "Liška", description: "a", image: null },
      { key: "owl", title: "Sova", description: "b", image: null },
    ];
    const questions = [
      {
        prompt: "Q",
        image: null,
        options: [
          { label: "A", isCorrect: false, outcomeKey: "owl", weight: 2, image: null },
          { label: "B", isCorrect: false, outcomeKey: "fox", weight: 2, image: null },
        ],
      },
    ];
    // Selecting fox (index 1) and … only one question → fox=2, owl=0
    expect(scorePersonalityDraft(outcomes, questions, { 0: 1 })?.key).toBe("fox");
    // Tie: both 2 — fox is first in editor order
    const tied = [
      {
        prompt: "Q1",
        image: null,
        options: [
          { label: "A", isCorrect: false, outcomeKey: "fox", weight: 2, image: null },
          { label: "B", isCorrect: false, outcomeKey: "owl", weight: 2, image: null },
        ],
      },
      {
        prompt: "Q2",
        image: null,
        options: [
          { label: "A", isCorrect: false, outcomeKey: "owl", weight: 2, image: null },
          { label: "B", isCorrect: false, outcomeKey: "fox", weight: 2, image: null },
        ],
      },
    ];
    expect(scorePersonalityDraft(outcomes, tied, { 0: 0, 1: 0 })?.key).toBe("fox");
  });
});
