import { expect, test } from "@playwright/test";
import { cards, pickLanguage, stubExternalSites, uniqueSuffix } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await stubExternalSites(context, baseURL!);
});

test("přepínač CZ/EN přeloží UI a zachová filtry i rozepsaný formulář", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("region", { name: "Filtry" }).getByRole("button", { name: "Obrázkový" }).click();
  await page.getByRole("button", { name: "Přidat kvíz" }).click();
  const dialog = page.getByRole("dialog");
  const draftTitle = `Draft ${uniqueSuffix()}`;
  await dialog.getByLabel(/Název/).fill(draftTitle);

  await dialog.getByTestId("locale-switch").getByRole("button", { name: "EN" }).click();
  await expect(dialog.getByRole("heading", { name: "Add quiz" })).toBeVisible();
  await expect(dialog.getByLabel(/Title/)).toHaveValue(draftTitle);
  await page.keyboard.press("Escape");

  await expect(page.getByRole("button", { name: "Add quiz" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find a quiz for your crew" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Filters" }).getByRole("button", { name: "Image" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.reload();
  await expect(page.getByRole("button", { name: "Add quiz" })).toBeVisible();
});

test("vlajka nahlášení otevře dialog kliknutím i klávesnicí", async ({ page }) => {
  await page.goto("/");
  const card = cards(page).first();
  const flag = card.getByTestId("report-quiz");
  await expect(flag).toHaveAttribute("aria-label", "Nahlásit kvíz");
  await expect(flag).not.toContainText("Nahlásit");
  await flag.click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Nahlásit kvíz" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await flag.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Nahlásit kvíz" })).toBeVisible();
});

test("přidání kvízu v němčině přes vyhledatelný seznam jazyků", async ({ page }) => {
  const tag = uniqueSuffix();
  await page.goto("/");
  await page.getByRole("button", { name: "Přidat kvíz" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel(/Název/).fill(`Německý kvíz ${tag}`);
  await dialog.getByLabel(/Přímý odkaz/).fill(`https://example.com/de-quiz-${tag}`);
  await dialog.getByText("Textový", { exact: true }).click();
  await dialog.getByText("Znalostní", { exact: true }).click();
  await pickLanguage(dialog, "nem", /Němčina/);
  await dialog.getByRole("button", { name: "Uložit kvíz" }).click();
  await expect(page.getByText("Kvíz je v katalogu!")).toBeVisible();

  await page.getByRole("region", { name: "Filtry" }).getByRole("button", { name: "Němčina" }).click();
  await expect(cards(page).first()).toHaveAttribute("data-language", "de");
});

test("locale switch layout na mobilu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByTestId("locale-switch")).toBeVisible();
  await page.getByTestId("locale-switch").getByRole("button", { name: "EN" }).click();
  await expect(page.getByRole("button", { name: "Add quiz" })).toBeVisible();
});
