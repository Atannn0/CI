# WhichQuiz

Webová aplikace (CZ/EN): katalog kvízů z různých webů i vlastních kvízů. Next.js 16 + TypeScript + Tailwind + shadcn/ui, sdílená databáze Postgres (na Vercelu Neon, lokálně PGlite v paměti).

```bash
npm install
npx playwright install chromium firefox
npm run dev        # http://localhost:4387
npm run check      # lint, typecheck, unit testy, E2E testy
```

Podrobnosti pro agenty i lidi jsou v [`../AGENTS.md`](../AGENTS.md). Plán je v [`docs/plan.md`](docs/plan.md), protokol ověření počátečního katalogu v [`docs/catalog-verification.md`](docs/catalog-verification.md).

## Nasazení na Vercel (Hobby) s databází Neon

Repozitář je připravený: `vercel.json` (region Frankfurt, build jen při změně v `kvizy/`), migrace a 63 kvízů se do databáze nahrají samy při buildu. Jediná ruční proměnná je volitelný `KVIZY_ADMIN_TOKEN` pro správu hlášení (viz níže).

1. **Import projektu**
   1. Přihlas se na [vercel.com](https://vercel.com) přes GitHub (plán Hobby).
   2. **Add New… → Project**. V seznamu **Import Git Repository** najdi `Atannn0/CI` a klikni **Import**. Pokud tam není, klikni **Adjust GitHub App Permissions** (nebo **Install**), povol Vercelu přístup k repozitáři `CI` a vrať se.
   3. Na obrazovce **Configure Project** u **Root Directory** klikni **Edit**, vyber složku `kvizy` a potvrď **Continue**. **Framework Preset** se přepne na **Next.js**.
   4. **Build and Output Settings** ani **Environment Variables** neměň. Klikni **Deploy**.
   5. První build doběhne (v logu `migrate: nothing to do (no DATABASE_URL)`), ale web zatím ukáže „Katalog se teď nepodařilo načíst“, protože chybí databáze. To je v pořádku.
2. **Databáze Neon přes Storage**
   1. V projektu otevři záložku **Storage** → **Create Database** (nebo **Connect Database**) → v sekci **Marketplace Database Providers** vyber **Neon** → **Continue**.
   2. Při instalaci zvol **Create New Neon Account** (pokud se Vercel zeptá), region **Europe (Frankfurt) – aws-eu-central-1**, plán **Free**, jméno databáze třeba `kvizy`. Volitelné služby (Auth, Realtime) nech vypnuté. Potvrď **Create** / **Continue**.
   3. V dialogu **Connect Project** vyber projekt `kvizy`, nech zaškrtnutá prostředí **Development, Preview, Production**, **Create database branch for deployment** nech nezaškrtnuté, **Custom Prefix** nech prázdný. Klikni **Connect**.
   4. Kontrola: **Settings → Environment Variables** teď obsahuje `DATABASE_URL` a `DATABASE_URL_UNPOOLED` (a další `PG*`/`POSTGRES_*`). Nic dalšího nepřidávej.
3. **Redeploy**
   1. Záložka **Deployments** → u posledního nasazení menu **⋯** → **Redeploy** → **Redeploy**. (Skript ignorovaného buildu redeploy stejného commitu vždy postaví; zaškrtávátko **Use project's Ignore Build Step** může zůstat.)
   2. V **Build Logs** musí být `migrate: applied 001_create_quizzes.sql` … `migrate: applied 004_seed_requested_tests.sql` (u existující databáze jen migrace, které ještě neproběhly).

### Ověření živého webu
- Otevři produkční adresu z **Domains** (např. `https://kvizy-….vercel.app`): domovská stránka ukáže „Všechny kvízy 63 kvízů“.
- `https://<doména>/api/quizzes` vrátí JSON s 63 kvízy (31 `cs`, 32 `en`).
- Přidej testovací kvíz (**Přidat do katalogu → Přidat odkaz**), obnov stránku a otevři web v jiném prohlížeči nebo na mobilu: kvíz najdeš hledáním.
- Klikni na **Otevřít kvíz**: otevře se nová záložka a po obnovení je kvíz v sekci **Populární kvízy**.
- Zkus přidat stejný odkaz znovu: formulář ho odmítne.
- Po dalším automatickém commitu vaultu se v **Deployments** objeví nasazení ve stavu **Canceled** s hláškou `No changes in kvizy/ …: skipping the build.`
- Data v Neonu: **Storage → kvizy → Open in Neon** → **SQL Editor** → `select count(*) from quizzes;`

### Správa hlášení (jen pro správce)
Návštěvníci mohou na kartě kliknout na **Nahlásit kvíz**. Hlášení (ID kvízu, důvod, poznámka, čas) se uloží do tabulky `quiz_reports`; kvíz se tím neskryje ani nesmaže. Obsah hlášení vidí jen správce:

1. Vygeneruj tajný klíč (aspoň 24 znaků), např. `openssl rand -base64 32`.
2. Ve Vercelu **Settings → Environment Variables → Add**: Key `KVIZY_ADMIN_TOKEN`, Value = klíč, prostředí **Production** (případně i **Preview**), **Sensitive** zapnuté → **Save**.
3. **Deployments → ⋯ → Redeploy** (proměnná se projeví až v novém nasazení).
4. Otevři `https://<doména>/spravce`, vlož klíč a klikni **Zobrazit hlášení**. Nebo: `curl -H "Authorization: Bearer <klíč>" https://<doména>/api/admin/reports`.

Bez proměnné (nebo s klíčem kratším než 24 znaků) je `/api/admin/reports` zavřený a vrací 404; se špatným klíčem 401. Pokusy jsou omezené na 20 za minutu z jedné IP.

### Env proměnné Neon jako Sensitive (checklist pro Ondru)

**Citlivé označení Neon env má na starosti Mac worker** — cloud agent hesla nerotuje a Marketplace vazby nepřepisuje, ať nevznikne konflikt. Níže je copy-paste checklist, pokud to děláš ručně.

Cloud agent **nemá** přihlášení do Vercel CLI/API z této VM — Mac / prohlížeč stačí, self-hosted runner není nutný.

Varování „looks like a secret, but its value is visible…“ znamená, že členové projektu vidí hodnotu v Settings — **ne** že connection string teče do prohlížeče návštěvníků.

**Označit Sensitive bez rotace hesla (preferované, pokud credentials neunikly):**

1. Otevři [vercel.com](https://vercel.com) → projekt s Root Directory `kvizy` → **Settings → Environment Variables**.
2. Projdi všechny DB proměnné od Neon Marketplace, typicky:
   - `DATABASE_URL`
   - `DATABASE_URL_UNPOOLED`
   - `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_DATABASE`, `POSTGRES_PASSWORD`
   - `PGHOST`, `PGHOST_UNPOOLED`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`
3. U každé: prostředí **Production**, **Preview** i **Development**.
4. Pokud UI u Marketplace položky nabízí **Sensitive** / **Encrypt**: zapni a ulož.
5. Pokud Marketplace položku **nejde** přepnout:
   1. Otevři Neon (**Storage → Open in Neon** / Neon Console) a zkopíruj aktuální connection stringy (pooled + direct) — heslo neměň.
   2. Ve Vercelu **Add** nové proměnné se **stejnými názvy** `DATABASE_URL` a `DATABASE_URL_UNPOOLED`, vlož hodnoty, zapni **Sensitive**, zaškrtni Production + Preview + Development → Save.
   3. Stejně pro ostatní `POSTGRES_*` / `PG*` které Vercel stále hlásí, nebo po ověření smazání duplicit nech jen citlivé connection stringy, které aplikace opravdu čte (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`; kód umí i legacy `POSTGRES_URL` / `POSTGRES_URL_NON_POOLING`).
   4. Staré ne-Sensitive duplicity odstraň až po úspěšném redeployi.
6. **Deployments → ⋯ → Redeploy** Production (a ověř homepage + `/api/quizzes`).
7. Znovu otevři Environment Variables: u Sensitive hodnot by se heslo **nemělo** znovu zobrazit jako plaintext.

**Kdy rotovat heslo v Neon:** jen když string unikl (chat, screenshot, cizí přístup k projektu). Jinak stačí Sensitive. Rotace = nové heslo v Neon → aktualizovat Sensitive env → Redeploy → staré heslo přestane platit.

**`KVIZY_ADMIN_TOKEN`** už má být Sensitive (viz výše); pokud není, označ stejně.

### Poznámky
- Plán Hobby má limit 100 nasazení denně a zrušené (ignorované) buildy se do něj počítají. Pokud Obsidian Git pushuje velmi často, nastav v Obsidianu **Settings → Obsidian Git → Auto commit-and-sync interval** aspoň na 15 minut.
- Preview musí mít vlastní Neon branch + `KVIZY_PREVIEW_DB_READY=1` (viz `docs/preview-database.md`). Bez toho Preview build/runtime failne dřív než migrace. Preview URL jsou dál chráněná Vercel přihlášením.
- Bez `DATABASE_URL` na Vercelu aplikace záměrně selže s chybovou stránkou, místo aby tiše ukládala data do dočasné paměti.
- Stránka soukromí: `/soukromi` (a anglická cesta `/privacy`; text přepínačem CZ/EN).
- Oddělení Preview DB: `docs/preview-database.md` (`KVIZY_PREVIEW_DB_READY=1` jen pro Preview).
- Rate limity zápisů/médií jsou **per serverless instance** (in-memory). Sdílený Redis/Upstash v projektu zatím není — pro globální anti-spam by bylo potřeba ho doplnit.
