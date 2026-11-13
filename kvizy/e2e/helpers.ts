import { expect, type BrowserContext, type Page } from "@playwright/test";

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

export function uniqueSuffix() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
