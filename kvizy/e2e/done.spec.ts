import { expect, test, type Page } from "@playwright/test";
import { cards, doneCheckbox, expectCount, filterButton, hideDoneSwitch, search, stubExternalSites, uniqueSuffix } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await stubExternalSites(context, baseURL!);
});

function cardById(page: Page, id: number) {
  return cards(page).and(page.locator(`[data-quiz-id="${id}"]`));
}

async function totalCount(page: Page) {
  return Number((await page.getByTestId("result-count").textContent())!.match(/\d+/)![0]);
}

test("Označit jako hotový přetrvá po obnovení stránky a jde kdykoli odškrtnout", async ({ page }) => {
  await page.goto("/");
  const first = cards(page).first();
  const id = Number(await first.getAttribute("data-quiz-id"));
  await expect(doneCheckbox(first)).not.toBeChecked();

  await doneCheckbox(first).check();
  await expect(cardById(page, id)).toHaveAttribute("data-done", "true");
  expect(await page.evaluate(() => localStorage.getItem("kvizy:done"))).toBe(JSON.stringify([id]));

  await page.reload();
  await expect(doneCheckbox(cardById(page, id))).toBeChecked();
  await expect(hideDoneSwitch(page)).toContainText("(1)");

  await doneCheckbox(cardById(page, id)).uncheck();
  await page.reload();
  await expect(doneCheckbox(cardById(page, id))).not.toBeChecked();
  expect(await page.evaluate(() => localStorage.getItem("kvizy:done"))).toBe("[]");
});

test("Otevřít kvíz stav hotového nemění", async ({ page, context }) => {
  await page.goto("/");
  const list = cards(page).and(page.locator('[data-collection="false"]'));
  const open = list.nth(0);
  const doneCard = list.nth(1);
  const doneId = Number(await doneCard.getAttribute("data-quiz-id"));
  const openId = Number(await open.getAttribute("data-quiz-id"));
  await doneCheckbox(doneCard).check();

  for (const id of [openId, doneId]) {
    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      cardById(page, id).getByRole("link", { name: /Otevřít kvíz/ }).click(),
    ]);
    await popup.close();
  }
  await expect(doneCheckbox(cardById(page, openId))).not.toBeChecked();
  await expect(doneCheckbox(cardById(page, doneId))).toBeChecked();
  await page.reload();
  await expect(doneCheckbox(cardById(page, openId))).not.toBeChecked();
  await expect(doneCheckbox(cardById(page, doneId))).toBeChecked();
});

test("Skrýt hotové jde kombinovat s hledáním i filtry", async ({ page, request }) => {
  const tag = uniqueSuffix();
  const created = await request.post("/api/quizzes", {
    data: { title: `Hotový kvíz ${tag}`, url: `https://example.com/hotovy-${tag}`, format: "text", language: "en", types: ["logic"] },
  });
  expect(created.status()).toBe(201);
  const ownId = (await created.json()).quiz.id as number;

  await page.goto("/");
  await filterButton(page, "Angličtina").click();
  const enTotal = await totalCount(page);
  const otherId = Number(await cards(page).and(page.locator(`:not([data-quiz-id="${ownId}"])`)).first().getAttribute("data-quiz-id"));
  for (const id of [ownId, otherId]) await doneCheckbox(cardById(page, id)).check();

  await hideDoneSwitch(page).click();
  await expect(hideDoneSwitch(page)).toHaveAttribute("aria-checked", "true");
  await expectCount(page, enTotal - 2);
  for (const id of [ownId, otherId]) await expect(cardById(page, id)).toHaveCount(0);
  for (const card of await cards(page).all()) await expect(card).toHaveAttribute("data-language", "en");

  await search(page, `hotovy kviz ${tag}`);
  await expectCount(page, 0);
  await expect(page.getByTestId("empty-message")).toContainText("máš hotové");
  await page.getByRole("button", { name: "Zobrazit hotové" }).click();
  await expect(hideDoneSwitch(page)).toHaveAttribute("aria-checked", "false");
  await expectCount(page, 1);
  await expect(doneCheckbox(cardById(page, ownId))).toBeChecked();

  await search(page, "");
  await doneCheckbox(cardById(page, otherId)).uncheck();
  await hideDoneSwitch(page).click();
  await expectCount(page, enTotal - 1);
  await expect(cardById(page, otherId)).toHaveCount(1);

  await filterButton(page, "Logický a hádankový").click();
  const logicVisible = await totalCount(page);
  await hideDoneSwitch(page).click();
  await expectCount(page, logicVisible + 1);
  await hideDoneSwitch(page).click();

  await page.getByRole("button", { name: "Vymazat hledání a filtry" }).first().click();
  await expect(hideDoneSwitch(page)).toHaveAttribute("aria-checked", "true");
  await expect(cardById(page, ownId)).toHaveCount(0);
});
