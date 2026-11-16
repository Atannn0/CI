import { expect, test, type APIRequestContext } from "@playwright/test";
import { stubExternalSites, uniqueSuffix } from "./helpers";
import { MEDIA_LIMITS } from "../src/lib/media";

test.beforeEach(async ({ context, baseURL }) => {
  await stubExternalSites(context, baseURL!);
});

function tinyPng(): Buffer {
  // 1x1 PNG
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
}

async function uploadPng(request: APIRequestContext) {
  return request.post("/api/media", {
    multipart: {
      file: { name: "dot.png", mimeType: "image/png", buffer: tinyPng() },
    },
  });
}

test("draft média bez tokenu jsou 404; s tokenem OK; po publish veřejné", async ({ request }) => {
  const tag = uniqueSuffix();
  const upload = await uploadPng(request);
  expect(upload.status()).toBe(201);
  const body = (await upload.json()) as { id: number; accessToken: string; url: string };
  expect(body.accessToken).toBeTruthy();
  expect(body.url).toContain(`access=`);

  const denied = await request.get(`/api/media/${body.id}`);
  expect(denied.status()).toBe(404);

  const allowed = await request.get(`/api/media/${body.id}?access=${encodeURIComponent(body.accessToken)}`);
  expect(allowed.status()).toBe(200);
  expect(allowed.headers()["content-type"]).toContain("image/png");
  expect(allowed.headers()["cache-control"]).toMatch(/private/);

  const created = await request.post("/api/custom-quizzes", {
    data: {
      title: `Media privacy ${tag}`,
      language: "cs",
      format: "image",
      mode: "knowledge",
      description: null,
      isAdult: false,
      outcomes: [],
      questions: [
        {
          prompt: "Co vidíš?",
          image: { mediaId: body.id, alt: "tečka", accessToken: body.accessToken },
          options: [
            { label: "A", isCorrect: true, outcomeKey: null, weight: null, image: null },
            { label: "B", isCorrect: false, outcomeKey: null, weight: null, image: null },
          ],
        },
      ],
    },
  });
  expect(created.status()).toBe(201);
  const quiz = (await created.json()).quiz as { slug: string };

  const publicGet = await request.get(`/api/media/${body.id}`);
  expect(publicGet.status()).toBe(200);
  expect(publicGet.headers()["cache-control"]).toMatch(/public/);

  const play = await request.get(`/api/custom-quizzes/${quiz.slug}`);
  expect(play.status()).toBe(200);
  const payload = await play.json();
  expect(JSON.stringify(payload)).not.toMatch(/isCorrect|is_correct/);
  expect(payload.questions[0].options[0]).not.toHaveProperty("isCorrect");
});

test("cizí access token nepřipojí cizí draft při publish", async ({ request }) => {
  const a = await uploadPng(request);
  const b = await uploadPng(request);
  const mediaA = await a.json();
  const mediaB = await b.json();
  const stolen = await request.post("/api/custom-quizzes", {
    data: {
      title: `Steal ${uniqueSuffix()}`,
      language: "cs",
      format: "image",
      mode: "knowledge",
      description: null,
      isAdult: false,
      outcomes: [],
      questions: [
        {
          prompt: "x",
          image: { mediaId: mediaA.id, alt: "x", accessToken: mediaB.accessToken },
          options: [
            { label: "A", isCorrect: true, outcomeKey: null, weight: null, image: null },
            { label: "B", isCorrect: false, outcomeKey: null, weight: null, image: null },
          ],
        },
      ],
    },
  });
  expect(stolen.status()).toBe(422);
});

test("neplatný a příliš velký soubor se odmítne", async ({ request }) => {
  const invalid = await request.post("/api/media", {
    multipart: {
      file: { name: "x.txt", mimeType: "text/plain", buffer: Buffer.from("not-an-image") },
    },
  });
  expect(invalid.status()).toBe(422);
  expect((await invalid.json()).error).toBe("invalid_type");

  const oversized = await request.post("/api/media", {
    multipart: {
      file: {
        name: "big.png",
        mimeType: "image/png",
        buffer: Buffer.alloc(MEDIA_LIMITS.maxBytes + 1, 1),
      },
    },
  });
  expect([413, 422]).toContain(oversized.status());
});
