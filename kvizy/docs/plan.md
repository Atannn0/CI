# Plán: Kvízy pro partu

Plán vznikl v režimu plánování před prací, která zasahuje do více rolí (výzkum odkazů, backend, frontend, ověření).

## Role a rozdělení práce

| Role | Kdo | Výstup |
|---|---|---|
| Koordinátor | hlavní konverzace | plán, sjednocení a deduplikace výsledků, integrace, ověření |
| Sběrač CZ-A | subagent | české osobnostní a preferenční kvízy |
| Sběrač CZ-B | subagent | české znalostní, obrázkové, logické a hádankové kvízy |
| Sběrač EN-A | subagent | anglické obrázkové a znalostní kvízy |
| Sběrač EN-B | subagent | anglické osobnostní, preferenční, logické a hádankové kvízy |
| Vývoj | hlavní konverzace | Next.js aplikace v `kvizy/` |
| Ověření | hlavní konverzace | Vitest (logika), Playwright (E2E ve dvou izolovaných prohlížečích) |

Každý sběrač vrací pro každý kvíz: název, přímý odkaz, jazyk, formát, typy, téma, krátký popis a výsledek ověření (HTTP stav, konečná URL, titulek stránky).

## Datový model

- `quizzes`: `id`, `title`, `url`, `url_key` (normalizovaná URL, unikátní), `description`, `language` (`cs` | `en`), `format` (`text` | `image` | `mixed`), `types` (pole: `personality`, `preference`, `knowledge`, `logic`), `topic`, `verified`, `is_collection` (odkaz na rozcestník testů, karta „Výběr testů“), `clicks`, `created_at`.
- `quiz_reports`: `id`, `quiz_id`, `reason` (`broken_link` | `wrong_category` | `inappropriate` | `duplicate` | `other`; u `other` povinná poznámka), `note`, `created_at`. Hlášení kvíz neskrývá ani nemaže.
- Označení „hotový“ je jen v prohlížeči: `localStorage` klíč `kvizy:done` = pole ID kvízů.
- Typ „logický a hádankový“ je jedna hodnota filtru (`logic`).

## Architektura

- Next.js (App Router) + TypeScript + Tailwind + shadcn/ui.
- Databáze: Postgres přes `DATABASE_URL` (publikovaná aplikace), lokálně PGlite v paměti; migrace v `kvizy/migrations/`.
- API: `GET /api/quizzes`, `POST /api/quizzes`, `POST /api/quizzes/[id]/click`, `POST /api/quizzes/[id]/report`, `GET /api/admin/reports` (jen s `Authorization: Bearer $KVIZY_ADMIN_TOKEN`, bez proměnné zavřené).
- Vyhledávání a filtrování na klientovi (katalog je malý), čistá funkce v `src/lib/filter.ts` testovaná Vitestem.
- Duplicita: normalizace URL (bez `www.`, koncového `/`, fragmentu, malá písmena v hostiteli) + unikátní index.

## Ověření (mapování na zadání)

1. Hledání bez diakritiky — unit + E2E.
2. Kombinace všech tří filtrů — unit + E2E.
3. Nulový počet výsledků — E2E (zpráva).
4. Otevření odkazu — E2E (nová záložka, `target=_blank`, započtení kliknutí).
5. Odmítnutí duplicity — API + E2E.
6. Přidání v jednom prohlížeči, dohledání v jiném — E2E se dvěma izolovanými kontexty prohlížeče.
7. Nahlášení kvízu (uložení, validace, Jiné s popisem, nový pokus po selhání, rate limit, přístup jen pro správce) — unit + E2E.
8. Označení hotového (přetrvá po obnovení, odškrtnutí, Otevřít kvíz stav nemění, Skrýt hotové s hledáním a filtry) — unit + E2E.
9. Zarovnání filtrů na počítači i mobilu (horní hrana, výška, aktivní stav bez posunu) — E2E.
10. Opakovaný import počátečního katalogu bez duplicit — unit (PGlite).
