import { expect, type BrowserContext, type Locator, type Page } from "@playwright/test";

/** Answers every request that leaves the app with a stub page, so tests never depend on external quiz sites. */
export async function stubExternalSites(context: BrowserContext, baseURL: string) {
  const origin = new URL(baseURL).origin;
  await context.route(
    (url) => url.origin !== origin,
    (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<title>externí kvíz</title>ok" }),
  );
}

export function cards(page: Page) {
  return page.getByTestId("results-list").getByTestId("quiz-card");
}

export async function search(page: Page, text: string) {
  await page.getByLabel("Najdi kvíz pro svou partu").fill(text);
}

export function filterButton(page: Page, name: string) {
  return page.getByRole("region", { name: "Filtry" }).getByRole("button", { name, exact: true });
}

export async function expectCount(page: Page, count: number) {
  const forms = count === 1 ? "kvíz" : count >= 2 && count <= 4 ? "kvízy" : "kvízů";
  await expect(page.getByTestId("result-count")).toHaveText(`Nalezeno: ${count} ${forms}`);
}

/** Admin token of the E2E server only (set in playwright.config.ts). */
export const E2E_ADMIN_TOKEN = "e2e-admin-token-not-a-secret-0123456789";

export function hideDoneSwitch(page: Page) {
  return page.getByRole("switch", { name: /Skrýt hotové/ });
}

export function doneCheckbox(card: Locator) {
  return card.getByRole("checkbox", { name: "Označit jako hotový" });
}

export function uniqueSuffix() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Select a quiz language in the searchable add-quiz combobox. */
export async function pickLanguage(dialog: Locator, query: string, label: RegExp | string) {
  await dialog.getByTestId("language-combobox").click();
  await dialog.getByTestId("language-combobox-search").fill(query);
  await dialog.getByTestId("language-combobox-list").getByRole("button", { name: label }).click();
}

/** Open the catalog add menu and choose "Přidat odkaz" / "Add link". */
export async function openAddLink(page: Page) {
  await page.getByTestId("add-menu").click();
  await page.getByRole("menuitem", { name: /Přidat odkaz|Add link/ }).click();
}

/** Open the catalog add menu and choose "Vytvořit kvíz" / "Create quiz". */
export async function openCreateQuiz(page: Page) {
  await page.getByTestId("add-menu").click();
  await page.getByRole("menuitem", { name: /Vytvořit kvíz|Create quiz/ }).click();
}

/** Toggle a catalog language chip, using Other language when the chip is collapsed. */
export async function toggleCatalogLanguage(page: Page, label: string | RegExp) {
  const region = page.getByRole("region", { name: /Filtry|Filters/ });
  const chip = region.getByRole("button", { name: label, exact: typeof label === "string" });
  if ((await chip.count()) > 0) {
    await chip.click();
    return;
  }
  await page.getByTestId("other-language").click();
  const picker = page.getByRole("dialog");
  const query = typeof label === "string" ? label.slice(0, 4) : "lang";
  await picker.getByTestId("other-language-search").fill(query);
  await picker.getByTestId("other-language-list").getByRole("button", { name: label }).click();
  await picker.getByRole("button", { name: /Zrušit|Cancel/ }).click();
}
