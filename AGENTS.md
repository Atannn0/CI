# AGENTS.md

## Projekt
Kořen repozitáře je Obsidian vault s poznámkami z kurzu MAS (synchronizuje ho plugin Obsidian Git). Jediná aplikace ve vaultu je **Kvízy pro partu** ve složce `kvizy/`: česká webová aplikace, ve které parta přátel rychle najde online kvíz podle nálady. Je to katalog odkazů; kvízy se otevírají na původních webech v nové záložce. Hotovo znamená: hledání bez diakritiky, tři filtry (formát, typ, jazyk), přidání kvízu bez účtu do sdílené databáze, popularita podle kliknutí na **Otevřít kvíz** a všechny kontroly níže zelené.

## Instalace, spuštění, testy
Všechny příkazy se spouštějí ve složce `kvizy/` (Node 22+).
- Instalace: `npm install && npx playwright install chromium firefox`
- Spuštění (vývoj): `npm run dev` → http://localhost:4387 (bez `DATABASE_URL` běží PGlite v paměti, katalog se naplní z migrací)
- Unit testy: `npm test`
- E2E testy: `npm run test:e2e` (sestaví aplikaci a spustí ji na portu 4388 s čistou databází; Firefox slouží jako „jiný prohlížeč“)
- Vše před commitem: `npm run check` (lint, typecheck, unit, E2E)
- E2E proti skutečnému Postgresu: `E2E_DATABASE_URL=postgres://… npm run test:e2e` (prázdná databáze; migrace se aplikují samy)
- Produkční build: `npm run build` (po buildu `scripts/migrate.mjs` aplikuje migrace, pokud je nastavené `DATABASE_URL`)

## Nasazení (Vercel + Neon)
- Produkce běží na Vercelu (Hobby) jako projekt s Root Directory `kvizy`; databáze je Neon Postgres připojený přes Vercel Storage. Integrace sama nastaví `DATABASE_URL` (pooled) a `DATABASE_URL_UNPOOLED` (přímé); ručně se nenastavuje nic.
- Migrace a počáteční katalog se aplikují idempotentně při buildu (`scripts/migrate.mjs`) a pojistně i při prvním dotazu každé instance (`src/lib/db.ts`); obojí sdílí `src/lib/migrate-core.mjs` s transakčním advisory lockem.
- `kvizy/vercel.json`: region `fra1`, `ignoreCommand` → `scripts/vercel-ignore-build.sh` staví jen při změně v `kvizy/` (porovnává s posledním úspěšným nasazením). Commity vaultu se zruší, ale i zrušené buildy se počítají do limitu 100 nasazení denně.
- Na Vercelu bez `DATABASE_URL` aplikace záměrně selže s chybovou stránkou místo tichého použití PGlite.
- Postup klikání ve Vercelu je v `kvizy/README.md`.

## Mapa projektu
- `kvizy/src/app/` stránka (`page.tsx`) a API: `api/quizzes` (GET seznam, POST přidání), `api/quizzes/[id]/click` (POST započte otevření)
- `kvizy/src/components/` UI: `catalog.tsx` (hledání, filtry, populární, výsledky), `quiz-card.tsx`, `add-quiz-dialog.tsx`, `ui/` (shadcn/ui)
- `kvizy/src/lib/` logika: `quiz.ts` (typy, štítky, validace, normalizace URL a textu), `filter.ts` (hledání a filtry), `db.ts` (Postgres/PGlite), `migrate-core.mjs` (migrace pro build i runtime), `guard.ts` (same-origin a rate limit pro zápisy), `quizzes-repo.ts` (SQL dotazy)
- `kvizy/migrations/` schéma a počáteční katalog (`002_seed_quizzes.sql` je generovaný)
- `kvizy/data/seed-quizzes.json` ověřený katalog včetně výsledků ověření; `npm run seed:sql` z něj vygeneruje migraci 002
- `kvizy/e2e/` Playwright testy, `kvizy/docs/` plán a protokol ověření odkazů, `kvizy/vercel.json` a `kvizy/scripts/` (migrace, generátor seedu, ignored build step)
- Ostatní složky (`00 Index/` … `99 Sources/`) jsou poznámky vaultu, ne součást aplikace.

## Pravidla
- Soubory aplikace patří jen do `kvizy/`; do kořene vaultu nic dalšího nepřidávej.
- Migrace jsou jen aditivní. Publikovanou migraci neupravuj, přidej novou (`003_…sql`). Nové kvízy do počátečního katalogu přidávej novou migrací, ne přegenerováním 002.
- `DATABASE_URL` nikdy nevypisuj, necommituj a nevytvářej s ní `.env`. Lokálně spouštěj bez ní (`env -u DATABASE_URL npm run dev`).
- Kvíz v katalogu musí mít přímý odkaz na jeden konkrétní kvíz (ne na seznam), jeden formát, jeden jazyk a aspoň jeden typ. Typ „Logický a hádankový“ je jedna hodnota (`logic`).
- Hledání a ověřování nových odkazů deleguj subagentům s jasným rozsahem; každý vrací název, přímý odkaz, jazyk, formát, typ a výsledek ověření. Výsledky sjednoť a deduplikuj v hlavní konverzaci.
- Při zkracování kontextu zachovej seznam upravených souborů a testovací příkaz (`npm run check`).

## Ověření
Změna je hotová, když `npm run check` projde. E2E pokrývá: hledání bez diakritiky, odmítnutí zápisu z cizího webu, kombinaci všech tří filtrů, nulový výsledek, otevření odkazu v nové záložce s počítáním kliknutí, validaci formuláře, odmítnutí duplicity a přidání kvízu v Chromiu s dohledáním ve Firefoxu.
