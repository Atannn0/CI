import { expect, test } from "@playwright/test";
import { cards, stubExternalSites, toggleCatalogLanguage } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await stubExternalSites(context, baseURL!);
});

test("jazyk je první filtr; při 9+ jazycích je Jiný jazyk", async ({ page, request }) => {
  const { quizzes } = await (await request.get("/api/quizzes")).json();
  const langs = new Set((quizzes as { language: string }[]).map((q) => q.language));
  await page.goto("/");
  const groups = page.getByTestId("filter-group");
  await expect(groups.first().locator("p")).toHaveText("Jazyk");

  if (langs.size <= 8) {
    await expect(page.getByTestId("other-language")).toHaveCount(0);
    expect(langs.size).toBeGreaterThan(0);
  } else {
    await expect(page.getByTestId("other-language")).toBeVisible();
    expect(await groups.first().getByTestId("filter-chip").count()).toBe(7);

    // Pick a language that is outside the top seven (Korean is tied on count, later by name).
    await page.getByTestId("other-language").click();
    const picker = page.getByRole("dialog");
    await picker.getByTestId("other-language-search").fill("kor");
    await picker.getByTestId("other-language-list").getByRole("button", { name: /Korejština|Korean/i }).click();
    await picker.getByRole("button", { name: "Zrušit" }).click();
    const extra = groups.first().getByTestId("filter-chip").filter({ hasText: /Korejština|Korean/i });
    await expect(extra).toBeVisible();
    await extra.click();
    await expect(extra).toHaveCount(0);
  }
});

test("filtry da/fr/it najdou importované kvízy", async ({ page, request }) => {
  const { quizzes } = await (await request.get("/api/quizzes")).json();
  const counts: Record<string, number> = { da: 0, fr: 0, it: 0 };
  for (const q of quizzes as { language: string }[]) {
    if (q.language in counts) counts[q.language] += 1;
  }
  expect(counts.da).toBeGreaterThanOrEqual(3);
  expect(counts.fr).toBeGreaterThanOrEqual(3);
  expect(counts.it).toBeGreaterThanOrEqual(3);

  for (const [code, label] of [
    ["da", "Dánština"],
    ["fr", "Francouzština"],
    ["it", "Italština"],
  ] as const) {
    await page.goto("/");
    await toggleCatalogLanguage(page, label);
    await expect(cards(page).first()).toHaveAttribute("data-language", code);
    expect(await cards(page).count()).toBeGreaterThanOrEqual(3);
  }
});
