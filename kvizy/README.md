# Kvízy pro partu

Česká webová aplikace: katalog online kvízů, ve kterém parta rychle najde kvíz podle nálady. Next.js 16 + TypeScript + Tailwind + shadcn/ui, sdílená databáze Postgres (lokálně PGlite v paměti).

```bash
npm install
npx playwright install chromium firefox
npm run dev        # http://localhost:4387
npm run check      # lint, typecheck, unit testy, E2E testy
```

Podrobnosti pro agenty i lidi jsou v [`../AGENTS.md`](../AGENTS.md). Plán je v [`docs/plan.md`](docs/plan.md), protokol ověření počátečního katalogu v [`docs/catalog-verification.md`](docs/catalog-verification.md).
