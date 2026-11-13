import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 4388);
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL,
    locale: "cs-CZ",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // A fresh production server. By default it uses the in-memory PGlite database seeded by the
    // migrations; set E2E_DATABASE_URL to run the same suite against a real (empty) Postgres.
    command: `npm run build && npx next start --port ${PORT} --hostname 127.0.0.1`,
    url: baseURL,
    timeout: 240_000,
    reuseExistingServer: false,
    env: {
      DATABASE_URL: process.env.E2E_DATABASE_URL ?? "",
      DATABASE_URL_UNPOOLED: process.env.E2E_DATABASE_URL ?? "",
      POSTGRES_URL: "",
      POSTGRES_URL_NON_POOLING: "",
    },
  },
});
