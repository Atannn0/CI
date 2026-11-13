import { expect, firefox, test } from "@playwright/test";
import {
  cards,
  expectCount,
  openAddLink,
  openCreateQuiz,
  pickLanguage,
  search,
  stubExternalSites,
  toggleCatalogLanguage,
  uniqueSuffix,
} from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await stubExternalSites(context, baseURL!);
});

test("jeden křížek vymaže hledání a vrátí fokus", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("Najdi kvíz pro svou partu");
  await input.fill("filmy");
  await expect(page.getByTestId("clear-search")).toBeVisible();
  await expect(page.getByTestId("clear-search")).toHaveCount(1);
  await page.getByTestId("clear-search").click();
  await expect(input).toHaveValue("");
  await expect(page.getByTestId("clear-search")).toHaveCount(0);
  await expect(input).toBeFocused();
});

test("Populární kvízy ukazují nejvýše 6 karet", async ({ page, request }) => {
  const { quizzes: before } = await (await request.get("/api/quizzes")).json();
  const targets = before.slice(0, 8);
  expect(targets.length).toBeGreaterThanOrEqual(8);
  for (const quiz of targets) {
    const res = await request.post(`/api/quizzes/${quiz.id}/click`);
    expect(res.status()).toBe(200);
  }

  await page.goto("/");
  await expect(page.getByTestId("popular-list").getByTestId("quiz-card")).toHaveCount(6);
  await expect(cards(page)).toHaveCount(before.length);
});

test("sdílení zkopíruje přímý odkaz externího kvízu", async ({ page, context, request }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const tag = uniqueSuffix();
  const url = `https://example.com/share-ext-${tag}`;
  const created = await request.post("/api/quizzes", {
    data: {
      title: `Share me ${tag}`,
      url,
      format: "text",
      language: "cs",
      types: ["knowledge"],
    },
  });
  expect(created.status()).toBe(201);

  await page.goto("/");
  await search(page, `Share me ${tag}`);
  await expectCount(page, 1);
  await cards(page).first().getByTestId("share-quiz").click();
  await expect(page.getByText("Odkaz zkopírován")).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toBe(url);
});

test("vlastní kvíz: zveřejnění, přeložený popis, skóre v jiném prohlížeči", async ({ page, context, baseURL }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const tag = uniqueSuffix();
  const title = `Vlastní znalosti ${tag}`;

  await page.goto("/");
  await openCreateQuiz(page);
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Název *").fill(title);
  await pickLanguage(dialog, "ces", /Čeština/);
  await dialog.getByLabel("Krátký popis (nepovinné)").fill("   ");
  await dialog.getByLabel("Text otázky").fill("Kolik je 2+2?");
  await dialog.getByPlaceholder("Možnost 1").fill("3");
  await dialog.getByPlaceholder("Možnost 2").fill("4");
  await dialog.getByTestId("custom-question").getByRole("radio").nth(1).check();
  await dialog.getByRole("button", { name: /Náhled/ }).click();
  await dialog.getByRole("radio").nth(1).check();
  await dialog.getByRole("button", { name: "Odevzdat odpovědi" }).click();
  await expect(dialog.getByTestId("preview-score")).toContainText("1 / 1");
  await dialog.getByRole("button", { name: "Zveřejnit kvíz" }).click();
  await expect(page.getByText("Kvíz je v katalogu!")).toBeVisible();

  await search(page, title);
  await expectCount(page, 1);
  const card = cards(page).first();
  await expect(card).toContainText("Kvíz o:");
  const locale = page.getByRole("banner").getByTestId("locale-switch");
  await locale.getByRole("button", { name: "EN" }).click();
  await expect(card).toContainText("Quiz about:");
  await locale.getByRole("button", { name: "CZ" }).click();

  const playLink = card.getByRole("link", { name: /Hrát kvíz/ });
  const href = await playLink.getAttribute("href");
  expect(href).toMatch(/^\/hrat\//);

  await card.getByTestId("share-quiz").click();
  await expect(page.getByText("Odkaz zkopírován")).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("/hrat/");

  const other = await firefox.launch();
  try {
    const otherContext = await other.newContext({ locale: "cs-CZ" });
    await stubExternalSites(otherContext, baseURL!);
    const otherPage = await otherContext.newPage();
    await otherPage.goto(new URL(href!, baseURL).toString());
    await otherPage.locator("label").filter({ hasText: "4" }).click();
    await otherPage.getByRole("button", { name: "Odevzdat odpovědi" }).click();
    await expect(otherPage.getByTestId("play-score")).toContainText("1 / 1");
    await expect(otherPage.getByText("Správně:")).toBeVisible();
  } finally {
    await other.close();
  }
});

test("filtry de/ko/sv/es najdou importované kvízy", async ({ page, request }) => {
  const { quizzes } = await (await request.get("/api/quizzes")).json();
  const counts: Record<string, number> = { de: 0, ko: 0, sv: 0, es: 0 };
  for (const q of quizzes as { language: string }[]) {
    if (q.language in counts) counts[q.language] += 1;
  }
  expect(counts.de).toBeGreaterThanOrEqual(3);
  expect(counts.ko).toBeGreaterThanOrEqual(3);
  expect(counts.sv).toBeGreaterThanOrEqual(3);
  expect(counts.es).toBeGreaterThanOrEqual(3);

  for (const [code, label] of [
    ["de", "Němčina"],
    ["ko", "Korejština"],
    ["sv", "Švédština"],
    ["es", "Španělština"],
  ] as const) {
    await page.goto("/");
    await toggleCatalogLanguage(page, label);
    await expect(cards(page).first()).toHaveAttribute("data-language", code);
    expect(await cards(page).count()).toBeGreaterThanOrEqual(3);
  }
});

test("přidání odkazu s prázdným popisem doplní šablony a přepne CZ/EN", async ({ page }) => {
  const tag = uniqueSuffix();
  await page.goto("/");
  await openAddLink(page);
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel(/Název/).fill(`Bez popisu ${tag}`);
  await dialog.getByLabel(/Přímý odkaz/).fill(`https://example.com/empty-desc-${tag}`);
  await dialog.getByText("Textový", { exact: true }).click();
  await dialog.getByText("Znalostní", { exact: true }).click();
  await pickLanguage(dialog, "ces", /Čeština/);
  await dialog.getByLabel(/Krátký popis/).fill("   ");
  await dialog.getByRole("button", { name: "Uložit kvíz" }).click();
  await expect(page.getByText("Kvíz je v katalogu!")).toBeVisible();

  await search(page, `Bez popisu ${tag}`);
  const card = cards(page).first();
  await expect(card).toContainText(`Kvíz o: Bez popisu ${tag}`);
  await page.getByRole("banner").getByTestId("locale-switch").getByRole("button", { name: "EN" }).click();
  await expect(card).toContainText(`Quiz about: Bez popisu ${tag}`);
});
