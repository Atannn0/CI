import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { cards, filterButton, search, stubExternalSites } from "./helpers";

type Seed = { title: string; url: string; is_collection?: boolean };

const REQUESTED_LINKS = [
  "https://mytype.fyi/type",
  "https://programs.clearerthinking.org/who_attracts_you_study.html",
  "https://www.16personalities.com/",
  "https://9axes.github.io/",
];

const seeds = JSON.parse(readFileSync("data/seed-quizzes.json", "utf8")) as Seed[];

test.beforeEach(async ({ context, baseURL }) => {
  await stubExternalSites(context, baseURL!);
});

for (const link of REQUESTED_LINKS) {
  test(`odkaz ${link} je v katalogu jednou a dá se dohledat`, async ({ page, request }) => {
    const seed = seeds.find((s) => s.url === link);
    expect(seed, "seed entry").toBeTruthy();
    const { quizzes } = await (await request.get("/api/quizzes")).json();
    const matches = quizzes.filter((q: { url: string }) => q.url === link);
    expect(matches).toHaveLength(1);

    await page.goto("/");
    await search(page, seed!.title);
    const card = cards(page).and(page.locator(`[data-quiz-id="${matches[0].id}"]`));
    await expect(card).toBeVisible();
    const action = card.getByRole("link", { name: seed!.is_collection ? /Prohlédnout testy/ : /Otevřít kvíz/ });
    await expect(action).toHaveAttribute("href", link);
    if (seed!.is_collection) {
      await expect(card).toHaveAttribute("data-collection", "true");
      await expect(card).toContainText("Výběr testů");
    } else {
      await expect(card).not.toContainText("Výběr testů");
    }
  });
}

test("hub IDRlabs je skrytý; jednotlivé IDRlabs kvízy jdou otevřít", async ({ page, request }) => {
  const { quizzes } = await (await request.get("/api/quizzes")).json();
  expect(quizzes.some((q: { url: string }) => q.url === "https://www.idrlabs.com/")).toBe(false);
  const idrlabs = quizzes.filter((q: { url: string }) => q.url.includes("idrlabs.com/"));
  expect(idrlabs.length).toBeGreaterThanOrEqual(5);

  await page.goto("/");
  await search(page, idrlabs[0].title);
  const card = cards(page).and(page.locator(`[data-quiz-id="${idrlabs[0].id}"]`));
  await expect(card).toBeVisible();
  const link = card.getByRole("link", { name: /Otevřít kvíz/ });
  await expect(link).toHaveAttribute("href", idrlabs[0].url);
  await expect(link).toHaveAttribute("target", "_blank");

  await search(page, idrlabs[1].title);
  await expect(cards(page).and(page.locator(`[data-quiz-id="${idrlabs[1].id}"]`))).toBeVisible();
});

test("filtry Japonština a Čínština vrátí odpovídající kvízy", async ({ page }) => {
  await page.goto("/");
  await filterButton(page, "Japonština").click();
  const ja = cards(page);
  expect(await ja.count()).toBeGreaterThanOrEqual(1);
  for (const card of await ja.all()) await expect(card).toHaveAttribute("data-language", "ja");

  await page.getByRole("button", { name: "Vymazat hledání a filtry" }).first().click();
  await filterButton(page, "Čínština").click();
  const zh = cards(page);
  expect(await zh.count()).toBeGreaterThanOrEqual(1);
  for (const card of await zh.all()) await expect(card).toHaveAttribute("data-language", "zh");
});
