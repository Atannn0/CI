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
    // A fresh production server with the in-memory PGlite database, seeded by the migrations.
    command: `npm run build && npx next start --port ${PORT} --hostname 127.0.0.1`,
    url: baseURL,
    timeout: 240_000,
    reuseExistingServer: false,
    env: { DATABASE_URL: "" },
  },
});
