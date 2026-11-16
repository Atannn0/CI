# Oddělení Preview databáze od produkce

## Proč

Preview nasazení (PR větve) dříve sdílela stejný Neon jako Production. Migrace jsou aditivní, ale zápisy z Preview (testovací kvízy, média) šly do produkčních dat.

Od migrace hardeningu platí: **Preview build selže dřív, než spustí migrace**, dokud není nastavené `KVIZY_PREVIEW_DB_READY=1` (jen pro Preview).

## Ruční kroky (Neon + Vercel)

1. V Neon Console → projekt kvizy → **Branches** → **Create branch** (např. `preview` z `main` / production).
2. Zkopíruj connection stringy větve `preview` (pooled + direct / unpooled).
3. Vercel → projekt → **Settings → Environment Variables**:
   - Pro prostředí **Preview only** nastav (nebo přepiš):
     - `DATABASE_URL` = pooled URL větve `preview`
     - `DATABASE_URL_UNPOOLED` = direct URL větve `preview`
     - `KVIZY_PREVIEW_DB_READY` = `1`
   - Typ: **Sensitive** (Encrypted) — viz README checklist; **Mac worker** má na starosti označení Sensitive, nereplikuj konfliktní změny hesla.
   - Production hodnoty **neměň** v tomto kroku.
4. Production zůstává na produkční větvi Neon **bez** `KVIZY_PREVIEW_DB_READY` (proměnná jen Preview).
5. **Redeploy** posledního Preview (nebo push nový commit na PR).
6. Ověř: Preview build log ukáže `migrate: applied …` nebo `up to date`; Preview URL načte katalog z testovací větve.
7. Volitelně naplň Preview seedem (`npm run import:quizzes` jen proti Preview URL lokálně — nikdy proti Production).

## Least-privilege role (doporučení, ruční SQL v Neon)

Aplikace dnes používá jedno connection string (typicky role s právy i na DDL kvůli migracím). Ideál:

1. Role `kvizy_migrator` — DDL + DML, jen pro build (`DATABASE_URL_UNPOOLED` / migrate).
2. Role `kvizy_app` — jen DML na tabulkách aplikace, pro runtime `DATABASE_URL`.

To vyžaduje vytvořit role v Neon SQL Editor a oddělit env. Kód zatím čte stejné `DATABASE_URL*` jako dřív; oddělení rolí je provozní krok po Preview branchi.

## Co kód vynucuje

| Místo | Chování |
|---|---|
| `scripts/migrate.mjs` | `VERCEL_ENV=preview` a chybí `KVIZY_PREVIEW_DB_READY=1` → exit 1 před migracemi |
| `src/lib/db.ts` + `preview-db.ts` | stejná kontrola při prvním DB přístupu na Preview |

Lokální vývoj a Production kontrolu nepřepínají.
