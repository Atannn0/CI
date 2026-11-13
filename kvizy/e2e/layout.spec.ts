import { expect, test, type Page } from "@playwright/test";
import { filterButton, stubExternalSites } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await stubExternalSites(context, baseURL!);
});

const filters = (page: Page) => page.getByRole("region", { name: "Filtry" });

async function boxes(page: Page) {
  const chips = filters(page).getByTestId("filter-chip");
  return Promise.all((await chips.all()).map(async (chip) => (await chip.boundingBox())!));
}

async function groupBoxes(page: Page) {
  const groups = await filters(page).getByTestId("filter-group").all();
  return Promise.all(
    groups.map(async (group) => ({
      group: (await group.boundingBox())!,
      title: (await group.locator("p").first().boundingBox())!,
      chips: await Promise.all((await group.getByTestId("filter-chip").all()).map(async (c) => (await c.boundingBox())!)),
    })),
  );
}

test.describe("počítač", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("hlavička má ilustraci a nemá dlaždici Obrázkové kvízy", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("hero-illustration")).toBeVisible();
    await expect(page.getByRole("button", { name: /Obrázkové kvízy/ })).toHaveCount(0);
    await expect(filterButton(page, "Obrázkový")).toBeVisible();
  });

  test("skupiny filtrů začínají na stejné horní hraně a tlačítka mají stejnou výšku", async ({ page }) => {
    await page.goto("/");
    const groups = await groupBoxes(page);
    expect(groups).toHaveLength(3);
    for (const g of groups) {
      expect(Math.abs(g.title.y - groups[0].title.y)).toBeLessThanOrEqual(1);
      expect(Math.abs(g.chips[0].y - groups[0].chips[0].y)).toBeLessThanOrEqual(1);
    }
    const heights = new Set((await boxes(page)).map((b) => Math.round(b.height)));
    expect([...heights]).toHaveLength(1);

    const [, types] = groups;
    for (const chip of types.chips) {
      if (chip.y > types.chips[0].y + 1) expect(Math.abs(chip.x - types.chips[0].x)).toBeLessThanOrEqual(1);
    }
  });

  test("aktivní stav nemění rozměry tlačítek ani neposouvá okolní filtry", async ({ page }) => {
    await page.goto("/");
    const before = await boxes(page);
    for (const name of ["Obrázkový", "Logický a hádankový", "Osobnostní", "Čeština", "Angličtina"]) {
      await filterButton(page, name).click();
      await expect(filterButton(page, name)).toHaveAttribute("aria-pressed", "true");
    }
    const after = await boxes(page);
    expect(after).toHaveLength(before.length);
    after.forEach((box, i) => {
      for (const key of ["x", "y", "width", "height"] as const) expect(Math.abs(box[key] - before[i][key])).toBeLessThan(0.5);
    });
  });
});

test.describe("mobil", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("skupiny filtrů jsou pod sebou, zalomená volba začíná pod první volbou skupiny a ilustrace je skrytá", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("hero-illustration")).toBeHidden();
    const groups = await groupBoxes(page);
    for (let i = 1; i < groups.length; i++) {
      expect(groups[i].group.y).toBeGreaterThanOrEqual(groups[i - 1].group.y + groups[i - 1].group.height);
      expect(Math.abs(groups[i].group.x - groups[0].group.x)).toBeLessThanOrEqual(1);
    }
    for (const g of groups) {
      for (const chip of g.chips) {
        if (chip.y > g.chips[0].y + 1) {
          const rowStart = g.chips.filter((c) => Math.abs(c.y - chip.y) <= 1).sort((a, b) => a.x - b.x)[0];
          expect(Math.abs(rowStart.x - g.chips[0].x)).toBeLessThanOrEqual(1);
        }
        expect(chip.x + chip.width).toBeLessThanOrEqual(390);
      }
    }
    const heights = new Set((await boxes(page)).map((b) => Math.round(b.height)));
    expect([...heights]).toHaveLength(1);
  });
});
