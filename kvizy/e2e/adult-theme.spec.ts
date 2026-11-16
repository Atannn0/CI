import { expect, test } from "@playwright/test";
import { cards, expectCount, search, stubExternalSites, toggleCatalogLanguage, uniqueSuffix } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await stubExternalSites(context, baseURL!);
});

test("tmavý režim se přepne a přetrvá po obnovení", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("kvizy:theme", "light"));
  await page.reload();
  const toggle = page.getByTestId("theme-toggle");
  await expect(toggle).toBeVisible();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByTestId("theme-toggle").click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("18+ kvíz je skrytý, po zapnutí se objeví s odznakem a jde filtrovat", async ({ page, request }) => {
  const tag = uniqueSuffix();
  const title = `Adult quiz ${tag}`;
  const created = await request.post("/api/quizzes", {
    data: {
      title,
      url: `https://example.com/adult-${tag}`,
      format: "text",
      language: "cs",
      types: ["knowledge"],
      isAdult: true,
    },
  });
  expect(created.status()).toBe(201);
  const quiz = (await created.json()).quiz as { isAdult: boolean };
  expect(quiz.isAdult).toBe(true);

  await page.goto("/");
  await search(page, title);
  await expectCount(page, 0);

  await page.getByTestId("show-adult").click();
  await expect(page.getByTestId("show-adult")).toHaveAttribute("aria-checked", "true");
  await expectCount(page, 1);
  const card = cards(page).first();
  await expect(card).toHaveAttribute("data-adult", "true");
  await expect(card.getByTestId("adult-badge")).toHaveText("18+");

  await toggleCatalogLanguage(page, "Čeština");
  await expect(cards(page).first()).toHaveAttribute("data-language", "cs");
  await expect(card.getByTestId("adult-badge")).toBeVisible();
});

test("sdílení vlastní i externí kvíz kopíruje odkaz a má ikonu kopírování", async ({ page, context, request }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const tag = uniqueSuffix();
  const url = `https://example.com/copy-ext-${tag}`;
  const created = await request.post("/api/quizzes", {
    data: {
      title: `Copy me ${tag}`,
      url,
      format: "text",
      language: "cs",
      types: ["knowledge"],
    },
  });
  expect(created.status()).toBe(201);

  await page.goto("/");
  await search(page, `Copy me ${tag}`);
  const share = cards(page).first().getByTestId("share-quiz");
  await expect(share).toHaveAttribute("title", "Zkopírovat odkaz");
  await share.click();
  await expect(page.getByText("Odkaz zkopírován")).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(url);
});
