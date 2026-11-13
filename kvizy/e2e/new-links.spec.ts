import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { cards, search, stubExternalSites } from "./helpers";

type Seed = { title: string; url: string; is_collection?: boolean };

const REQUESTED_LINKS = [
  "https://www.idrlabs.com/",
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
