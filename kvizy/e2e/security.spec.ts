import { expect, test } from "@playwright/test";
import { cards, search, stubExternalSites, uniqueSuffix } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await stubExternalSites(context, baseURL!);
});

const validBody = (tag: string) => ({
  title: `Bezpečný kvíz ${tag}`,
  url: `https://example.com/security-${tag}`,
  format: "text",
  language: "cs",
  types: ["knowledge"],
  description: "Ověření zápisu.",
  topic: "test",
});

test("API přijme platný kvíz a odmítne javascript: URL i pokus nastavit kliknutí", async ({ request }) => {
  const tag = uniqueSuffix();
  const created = await request.post("/api/quizzes", { data: { ...validBody(tag), clicks: 999_999, id: 1 } });
  expect(created.status()).toBe(201);
  const quiz = (await created.json()).quiz;
  expect(quiz.clicks).toBe(0);
  expect(quiz.title).toBe(`Bezpečný kvíz ${tag}`);

  const bad = await request.post("/api/quizzes", {
    data: { ...validBody(`${tag}-js`), url: "javascript:alert(1)" },
  });
  expect(bad.status()).toBe(422);
  expect((await bad.json()).fields.url).toBeTruthy();
});

test("API odmítne duplicitní URL a nepovolené zápisy (PUT/PATCH/DELETE)", async ({ request }) => {
  const tag = uniqueSuffix();
  const body = validBody(tag);
  expect((await request.post("/api/quizzes", { data: body })).status()).toBe(201);
  expect((await request.post("/api/quizzes", { data: { ...body, title: "Jiný název" } })).status()).toBe(409);

  for (const method of ["put", "patch", "delete"] as const) {
    expect((await request[method]("/api/quizzes", { data: body })).status()).toBe(405);
    expect((await request[method]("/api/quizzes/1/click", { data: { clicks: 0 } })).status()).toBe(405);
  }
  expect((await request.get("/api/quizzes/1/click")).status()).toBe(405);
});

test("vložený HTML v názvu a popisu se vykreslí jako text, ne jako DOM", async ({ page, request }) => {
  const tag = uniqueSuffix();
  const title = `<img src=x onerror=alert(1)> XSS ${tag}`;
  const description = `<script>document.body.dataset.pwned='1'</script> popis`;
  const created = await request.post("/api/quizzes", {
    data: { ...validBody(tag), title, description, topic: `<b>téma</b>` },
  });
  expect(created.status()).toBe(201);

  await page.goto("/");
  await search(page, tag);
  const card = cards(page).first();
  await expect(card.getByRole("heading")).toHaveText(title);
  await expect(card.locator("img[src='x']")).toHaveCount(0);
  await expect(card.locator("script")).toHaveCount(0);
  await expect(card.locator("b")).toHaveCount(0);
  await expect(card).toContainText(description);
  await expect(card).toContainText("<b>téma</b>");
  expect(await page.evaluate(() => document.body.dataset.pwned)).toBeUndefined();

  const open = card.getByRole("link", { name: /Otevřít kvíz/ });
  await expect(open).toHaveAttribute("target", "_blank");
  await expect(open).toHaveAttribute("rel", "noopener noreferrer");
});

test("opakované přidávání kvízů narazí na rate limit", async ({ request }) => {
  const tag = uniqueSuffix();
  let limited = false;
  // Isolated IP so earlier suite creates do not consume this window; E2E create limit is 80.
  const headers = { "x-forwarded-for": `198.51.100.${(Date.now() % 200) + 1}` };
  for (let i = 0; i < 100; i++) {
    const res = await request.post("/api/quizzes", {
      headers,
      data: validBody(`${tag}-${i}`),
    });
    if (res.status() === 429) {
      limited = true;
      break;
    }
    expect([201, 409]).toContain(res.status());
  }
  expect(limited).toBe(true);
});
