import { expect, test } from "@playwright/test";
import { stubExternalSites } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await stubExternalSites(context, baseURL!);
});

test("patička vede na Soukromí; stránka má CZ/EN a klíčové sekce", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("footer-privacy").click();
  await expect(page).toHaveURL(/\/soukromi$/);
  await expect(page.getByRole("heading", { name: "Soukromí a zpracování údajů" })).toBeVisible();
  await expect(page.getByTestId("privacy-sections")).toContainText("Bez účtů");
  await expect(page.getByTestId("privacy-sections")).toContainText("localStorage");
  await expect(page.getByTestId("privacy-sections")).toContainText("Vercel");
  await expect(page.getByTestId("privacy-sections")).toContainText("Neon");
  await expect(page.getByTestId("privacy-sections")).toContainText("18+");
  await expect(page.getByTestId("privacy-sections")).toContainText("provozovatel služby");
  await expect(page.getByTestId("privacy-sections")).toContainText("24 měsíců");
  await expect(page.getByTestId("privacy-sections")).not.toContainText("DOPLNÍ");
  await expect(page.getByTestId("privacy-sections")).not.toContainText("Ondra");

  await page.getByTestId("locale-switch").getByRole("button", { name: "EN" }).click();
  await expect(page.getByRole("heading", { name: "Privacy and data processing" })).toBeVisible();
  await expect(page.getByTestId("privacy-sections")).toContainText("No accounts");
  await expect(page.getByTestId("privacy-sections")).toContainText("service operator");
  await expect(page.getByTestId("privacy-sections")).toContainText("24 months");
  await expect(page.getByTestId("privacy-sections")).not.toContainText("ONDRA TO FILL");

  await page.getByTestId("privacy-back").click();
  await expect(page).toHaveURL(/\/$/);
});

test("anglická cesta /privacy zobrazí stejný obsah", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /Soukromí|Privacy/ })).toBeVisible();
  await expect(page.getByTestId("privacy-sections")).toBeVisible();
});

test("dialog Nahlásit kvíz varuje před osobními údaji v poznámce", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("quiz-card").first().getByRole("button", { name: /Nahlásit kvíz|Report quiz/ }).click();
  await expect(page.getByTestId("report-note-privacy")).toContainText(/osobní údaje|personal data/i);
});
