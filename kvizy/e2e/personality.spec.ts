import { expect, firefox, test } from "@playwright/test";
import { cards, expectCount, openCreateQuiz, pickLanguage, search, stubExternalSites, uniqueSuffix } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await stubExternalSites(context, baseURL!);
});

test("osobnostní kvíz Jaké zvíře jsi? se skóruje podle vah a remízy", async ({ page, baseURL }) => {
  const tag = uniqueSuffix();
  const title = `Jaké zvíře jsi? ${tag}`;

  await page.goto("/");
  await openCreateQuiz(page);
  const dialog = page.getByRole("dialog");
  await dialog.getByText("Osobnostní", { exact: true }).click();
  await dialog.getByLabel("Název *").fill(title);
  await pickLanguage(dialog, "ces", /Čeština/);

  const outcomes = dialog.getByTestId("outcome-card");
  await outcomes.nth(0).getByLabel(/Název výsledku/).fill("Liška");
  await outcomes.nth(0).getByLabel(/Popis výsledku/).fill("Chytrá a rychlá.");
  await outcomes.nth(1).getByLabel(/Název výsledku/).fill("Sova");
  await outcomes.nth(1).getByLabel(/Popis výsledku/).fill("Moudrá a klidná.");
  await dialog.getByRole("button", { name: "Přidat výsledek" }).click();
  await outcomes.nth(2).getByLabel(/Název výsledku/).fill("Vydra");
  await outcomes.nth(2).getByLabel(/Popis výsledku/).fill("Hrava a společenská.");

  const question = dialog.getByTestId("custom-question").first();
  await question.getByLabel("Text otázky").fill("Večer raději…");
  await question.getByPlaceholder("Možnost 1").fill("Plánuji");
  await question.getByPlaceholder("Možnost 2").fill("Improvizuji");
  await question.getByRole("button", { name: "Přidat možnost" }).click();
  await question.getByPlaceholder("Možnost 3").fill("Hraju si");

  const optionBlocks = question.getByTestId("custom-option");
  await optionBlocks.nth(0).locator("select").selectOption({ label: "Liška" });
  await optionBlocks.nth(0).getByRole("spinbutton").fill("2");
  await optionBlocks.nth(1).locator("select").selectOption({ label: "Sova" });
  await optionBlocks.nth(1).getByRole("spinbutton").fill("5");
  await optionBlocks.nth(2).locator("select").selectOption({ label: "Vydra" });
  await optionBlocks.nth(2).getByRole("spinbutton").fill("1");

  await dialog.getByRole("button", { name: /Náhled/ }).click();
  await dialog.getByText("Improvizuji", { exact: true }).click();
  await dialog.getByRole("button", { name: "Odevzdat odpovědi" }).click();
  await expect(dialog.getByTestId("preview-personality")).toContainText("Sova");
  await dialog.getByRole("button", { name: "Zveřejnit kvíz" }).click();
  await expect(page.getByText("Kvíz je v katalogu!")).toBeVisible();

  await search(page, title);
  await expectCount(page, 1);
  const href = await cards(page).first().getByRole("link", { name: /Hrát kvíz/ }).getAttribute("href");
  expect(href).toMatch(/^\/hrat\//);

  const other = await firefox.launch();
  try {
    const ctx = await other.newContext({ locale: "cs-CZ" });
    await stubExternalSites(ctx, baseURL!);
    const otherPage = await ctx.newPage();
    await otherPage.goto(new URL(href!, baseURL).toString());
    await otherPage.getByText("Improvizuji", { exact: true }).click();
    await otherPage.getByRole("button", { name: "Odevzdat odpovědi" }).click();
    await expect(otherPage.getByTestId("play-personality")).toContainText("Sova");
  } finally {
    await other.close();
  }
});

test("odebrání použitého výsledku vyžaduje nové přiřazení", async ({ page }) => {
  await page.goto("/");
  await openCreateQuiz(page);
  const dialog = page.getByRole("dialog");
  await dialog.getByText("Osobnostní", { exact: true }).click();
  await dialog.getByLabel("Název *").fill(`Orphan ${uniqueSuffix()}`);
  await pickLanguage(dialog, "ces", /Čeština/);
  const outcomes = dialog.getByTestId("outcome-card");
  await outcomes.nth(0).getByLabel(/Název výsledku/).fill("A");
  await outcomes.nth(0).getByLabel(/Popis výsledku/).fill("aa");
  await outcomes.nth(1).getByLabel(/Název výsledku/).fill("B");
  await outcomes.nth(1).getByLabel(/Popis výsledku/).fill("bb");
  await dialog.getByRole("button", { name: "Přidat výsledek" }).click();
  await outcomes.nth(2).getByLabel(/Název výsledku/).fill("C");
  await outcomes.nth(2).getByLabel(/Popis výsledku/).fill("cc");
  const question = dialog.getByTestId("custom-question").first();
  await question.getByLabel("Text otázky").fill("Q?");
  await question.getByPlaceholder("Možnost 1").fill("x");
  await question.getByPlaceholder("Možnost 2").fill("y");
  await question.getByTestId("custom-option").nth(0).locator("select").selectOption({ label: "A" });
  await question.getByTestId("custom-option").nth(1).locator("select").selectOption({ label: "B" });
  await outcomes.nth(0).getByRole("button", { name: "Odebrat výsledek" }).click();
  await expect(dialog.getByText(/odebraný výsledek/i)).toBeVisible();
  await dialog.getByRole("button", { name: /Náhled/ }).click();
  await expect(dialog.getByText(/přiřaď každou odpověď|platnému výsledku/i)).toBeVisible();
});
