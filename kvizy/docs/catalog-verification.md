# Ověření počátečního katalogu

Stav k 13. 11. 2026. Celkem 58 kvízů: 31 česky, 27 anglicky. Zdroj dat: `data/seed-quizzes.json` (pole `verification`).

Odkazy hledali a ověřovali čtyři subagenti (CZ osobnostní/preferenční, CZ znalostní/obrázkové/logické, EN obrázkové/znalostní, EN osobnostní/preferenční/logické). Hlavní konverzace výsledky sjednotila, odstranila duplicity (stejná normalizovaná URL nebo stejný kvíz na dvou webech: vyřazen Sporcle „Countries of the World“, ponechán JetPunk) a všechny odkazy znovu zkontrolovala přes curl a u blokovaných v headless Chromiu.

| Jazyk | Formát | Typy | Téma | Kvíz | Výsledek ověření |
|---|---|---|---|---|---|
| cs | text | personality | psychologie | [Barevná typologie: Která barva vystihuje tvou povahu?](https://refresher.cz/133826-KVIZ-Jaky-jsi-typ-osobnosti-podle-barevne-typologie) | ověřeno: HTTP 200 (curl) |
| cs | text | personality | filmy | [Jaká jsi princezna z Disney pohádek?](https://refresher.cz/139017-Kviz-Jaka-jsi-princezna-z-Disney-pohadek) | ověřeno: HTTP 200 (curl) |
| cs | text | personality | filmy | [Kdo jsi z Karlíka a továrny na čokoládu?](https://refresher.cz/149706-KVIZ-Kdo-jsi-z-Karlika-a-tovarny-na-cokoladu) | ověřeno: HTTP 200 (curl) |
| cs | text | personality | filmy | [Které postavě z českých vánočních filmů a pohádek se podobáš?](https://refresher.cz/127682-KVIZ-Ktere-postave-z-ceskych-vanocnich-filmu-a-pohadek-se-podobas) | ověřeno: HTTP 200 (curl) |
| cs | text | personality |  | [Jsi víc mileniál, nebo gen Z?](https://refresher.cz/146613-KVIZ-Jsi-vic-milenial-nebo-gen-Z-Zjisti-to-v-nasem-testu) | ověřeno: HTTP 200 (curl) |
| cs | mixed | preference, personality | jídlo | [Odpověz na otázky a my ti řekneme, který drink piješ](https://refresher.cz/101102-KVIZ-Odpovez-na-otazky-a-my-ti-rekneme-ktery-drink-pijes-nejradeji) | ověřeno: HTTP 200 (curl) |
| cs | text | personality | psychologie | [TEST osobnosti: Levá vs. pravá hemisféra](https://refresher.cz/143973-KVIZ-Jak-funguje-tva-mysl-Odpovez-na-otazky-a-zjisti-zda-ma-ve-tvem-zivote-prevahu-logika-nebo-kreativita) | ověřeno: HTTP 200 (curl) |
| cs | text | personality | seriály | [Osobnostní test: Která postava ze Hry o trůny jste právě vy?](https://www.marianne.cz/zabava/osobnostni-test-ktera-postava-ze-hry-o-truny-jste-prave-vy-prichazi-novy-serial-rytir-sedmi) | ověřeno: HTTP 200 (curl) |
| cs | text | personality | knihy | [Kterou postavou z Harryho Pottera jsi?](https://www.svetkouzel.com/harry-potter-kviz/kterou-postavou-z-harryho-pottera-jsi/) | ověřeno: HTTP 200 (curl) |
| cs | text | personality | seriály | [Test osobnosti: Jaký seriálový svět vystihuje vaši povahu?](https://mojepsychologie.zeny.cz/relax/testy-a-kvizy/osobnostni-test-do-jakeho-serialoveho-sveta-podvedome-patrite-3414) | ověřeno: HTTP 200 (curl) |
| cs | text | personality | seriály | [Test: Komu ze seriálu Comeback se nejvíce podobáš?](https://www.hryprodivky.cz/test/komu-ze-serialu-comeback-se-nejvice-podobas) | ověřeno: HTTP 200 (curl) |
| cs | text | personality, preference | jídlo | [Věštění ze šálku: Jaká káva vystihuje vaši osobnost?](https://tchiboblog.cz/kviz-jaka-kava-vas-vystihuje/) | ověřeno: HTTP 200 (curl) |
| cs | text | personality | psychologie | [Test: Jaký ze 4 typů osobnosti vás nejlépe vystihuje](https://www.svetzeny.cz/zabava/testy-kvizy/test-jaky-ze-4-typu-osobnosti-vas-nejlepe-vystihuje) | ověřeno: HTTP 200 (curl) |
| cs | text | preference |  | [Co bys radši? – kvíz pro kamarády](https://vivatok.com/co-bys-radsi/) | ověřeno: HTTP 200 (curl) |
| cs | text | personality | vztahy | [Test: Jaký typ kluka se k tobě hodí?](https://www.hrydnes.cz/test/jaky-typ-kluka-se-k-tobe-hodi) | ověřeno: HTTP 200 (curl) |
| cs | text | personality | psychologie | [TEST: Jaký je Váš typ osobnosti](https://www.pronaladu.cz/test-jaky-je-vas-typ-osobnosti/) | ověřeno: HTTP 200 (curl) |
| cs | text | preference |  | [Co bys raději? (Every Random)](https://everyrandom.com/cs/co-bys-radeji) | ověřeno: HTTP 200 (curl) |
| cs | image | knowledge | filmy | [Poznejte ty nejslavnější filmy jen podle fotek](https://netflixer.cz/kvizy/81874-kviz-poznejte-ty-nejslavnejsi-filmy-jen-podle-fotek-vsechny-uhodnout-jen-opravdovi-znalci/) | ověřeno: HTTP 200 (curl) |
| cs | image | knowledge | filmy | [Poznáte kultovní snímky podle obrázku?](https://www.marianne.cz/zabava/kviz-poznate-kultovni-snimky-podle-obrazku-plny-pocet-bodu-ziska-jen-opravdovy-filmovy) | ověřeno: HTTP 200 (curl) |
| cs | image | knowledge | zeměpis | [Lehký kvíz vlajek – Nejznámější vlajky](https://flags-quiz.com/cs/easy-flags-quiz/) | ověřeno: HTTP 200 (curl) |
| cs | image | knowledge | zvířata | [Velký zvířecí kvíz: Dokážete podle fotky poznat, o jakého tvora se jedná?](https://www.svetzeny.cz/zabava/testy-kvizy/velky-zvireci-kviz) | ověřeno: HTTP 200 (curl) |
| cs | image | knowledge | zvířata | [Asie není jen o pandách. Poznáte všechna zvířata na fotografiích?](https://asianstyle.cz/kultura/117103-kviz-asie-neni-jen-o-pandach-poznate-vsechna-zvirata-na-fotografiich/) | ověřeno: HTTP 200 (curl) |
| cs | image | knowledge | zvířata | [Poznávačka ptáků online – kvíz podle fotografií](https://birding.cz/poznavacka-ptaku) | ověřeno: HTTP 200 (curl) |
| cs | mixed | knowledge | jídlo | [40 jídel, 40 filmů: Poznáte snímek podle toho, co mají hrdinové na talíři?](https://recepty.idnes.cz/40-jidel-40-filmu-poznate-snimek-podle-toho-co-maji-hrdinove-na-taliri.Q261015_140106_receptyh_zuva) | ověřeno: HTTP 200 (curl) |
| cs | text | knowledge | hudba | [Kvíz o české populární hudbě](https://kviz.kvizky.cz/kviz/kviz-o-ceske-popularni-hudbe-65) | ověřeno: HTTP 200 (curl) |
| cs | text | knowledge | historie | [Dějepisný kvíz: Poznáte, co bylo dřív?](https://kviz.kvizky.cz/kviz/dejepisny-kviz-poznate-co-bylo-driv-61) | ověřeno: HTTP 200 (curl) |
| cs | text | knowledge | sport | [Vyznáte se ve všech sportech na olympiádě?](https://www.seznamzpravy.cz/clanek/sport-olympiada-kviz-vyznate-se-ve-vsech-sportech-na-olympiade-zkuste-nas-test-255080) | ověřeno: HTTP 200 (curl) |
| cs | text | logic |  | [Jak jste na tom s logickým uvažováním? 11 úloh](https://www.svetzeny.cz/zabava-kultura/testy-a-kvizy/kviz-jak-jste-na-tom-s-logickym-uvazovanim-11-uloh-proveri-usudek-poradi-v-cili-i-skryte-vzorce-7b023) | ověřeno: HTTP 200 (curl) |
| cs | text | logic |  | [Otestujte si logické myšlení. Uhádnete správně všechny hádanky?](https://www.svetzeny.cz/zabava/testy-kvizy/kviz-otestujte-si-logicke-mysleni-uhadnete-spravne-vsechny-hadanky-umi-jen-10) | ověřeno: HTTP 200 (curl) |
| cs | text | logic |  | [Logický test: 12 logických hádanek s řešením](https://prismatest.net/cs/trivia/logic-test/) | ověřeno: HTTP 200 (curl) |
| cs | text | logic |  | [Rodinné vztahy – logický test](https://testi.cz/testy/logika/rodinne-vztahy/) | ověřeno: HTTP 200 (curl) |
| en | image | knowledge | filmy | [Framed](https://framed.wtf/) | ověřeno: HTTP 200 (curl) |
| en | image | knowledge | hry | [GuessThe.Game](https://guessthe.game/) | ověřeno: HTTP 200 (curl) |
| en | image | knowledge | seriály | [Episode](https://episode.wtf/) | ověřeno: HTTP 200 (curl) |
| en | image | knowledge | zeměpis | [Worldle - Guess the Country](https://worldle.teuteuf.fr/) | ověřeno: HTTP 200 (curl) |
| en | image | knowledge | zeměpis | [WhereTaken](https://wheretaken.teuteuf.fr/) | ověřeno: HTTP 200 (curl) |
| en | image | knowledge | vlajky | [Flagle - The Daily Flag Guessing Game](https://www.flagle.io/) | ověřeno: HTTP 200 (curl) |
| en | image | knowledge | zeměpis | [Globle](https://globle-game.com/) | ověřeno: HTTP 200 (curl) |
| en | image | knowledge | vlajky | [World: Flags - Flag Quiz Game - Seterra](https://www.geoguessr.com/fl/2007) | ověřeno: HTTP 200 (curl) |
| en | image | knowledge | památky | [Landmarks Picture Quiz #1](https://www.jetpunk.com/quizzes/landmarks-quiz-1) | ověřeno: prohlížeč HTTP 200, titulek „Landmarks Picture Quiz #1“ (curl blokován ochranou proti botům) |
| en | image | knowledge | filmy | [Guess the Movie!! w/ Pictures](https://www.sporcle.com/games/nickc4861/guess-the-movie-pictures) | ověřeno: prohlížeč HTTP 200, titulek „Guess the Movie!! w/ Pictures Quiz - By nickc4861“ (curl blokován ochranou proti botům) |
| en | image | knowledge | loga | [Corporate Logos](https://www.sporcle.com/games/g/corplogos) | ověřeno: prohlížeč HTTP 200, titulek „Corporate Logos Quiz“ (curl blokován ochranou proti botům) |
| en | mixed | knowledge | zeměpis | [Countries of the World Quiz](https://www.jetpunk.com/quizzes/how-many-countries-can-you-name) | ověřeno sběračem přes WebFetch; Cloudflare blokuje headless prohlížeč, reálný prohlížeč projde kontrolou |
| en | text | knowledge | všeobecné znalosti | [General Knowledge Quiz #1](https://www.jetpunk.com/quizzes/general-knowledge-quiz-1) | ověřeno sběračem přes WebFetch; Cloudflare blokuje headless prohlížeč, reálný prohlížeč projde kontrolou |
| en | text | personality | psychologie | [Free Personality Test (16Personalities)](https://www.16personalities.com/free-personality-test) | ověřeno: HTTP 200 (curl) |
| en | text | personality | seriály | [Statistical "Which Character" Personality Quiz](https://openpsychometrics.org/tests/characters/) | ověřeno: HTTP 200 (curl) |
| en | mixed | personality | seriály | [Which “Friends” Character Are You?](https://www.buzzfeed.com/jenlewis/which-friends-character-are-you) | ověřeno: HTTP 200 (curl) |
| en | mixed | personality | seriály | [Which Character From “The Office” Are You?](https://www.buzzfeed.com/laurengarafano/which-office-character-are-you) | ověřeno: HTTP 200 (curl) |
| en | text | personality | filmy | [Hogwarts House Test](https://www.idrlabs.com/hogwarts-house/test.php) | ověřeno: HTTP 200 (curl) |
| en | text | preference |  | [Either - A game of preference](https://either.io/) | ověřeno: HTTP 200 (curl) |
| en | text | preference |  | [Rrrather: Would you rather](https://www.rrrather.com/) | ověřeno: prohlížeč HTTP 200, titulek „rrrather: Would you rather... just answer or debate? - Home “ (curl blokován ochranou proti botům) |
| en | text | preference |  | [This or That Game](https://thisorthatgames.com/) | ověřeno: HTTP 200 (curl) |
| en | image | preference | jídlo | [It’s Time To Decide Whether These Sweet Or Savoury Foods Reign Supreme](https://www.buzzfeed.com/elizabeth_cotton/sweet-savoury-food-quiz) | ověřeno: prohlížeč HTTP 200, titulek „Would You Rather Eat These Sweet Or Savoury Foods“ (curl blokován ochranou proti botům) |
| en | text | logic |  | [Blood Donation - Zebra Puzzle](https://www.brainzilla.com/logic/zebra/blood-donation/) | ověřeno: HTTP 200 (curl) |
| en | text | logic |  | [Einstein's Riddle](https://www.brainzilla.com/logic/zebra/einsteins-riddle/) | ověřeno: HTTP 200 (curl) |
| en | text | logic |  | [Can You Get 11 of These Basic Brain Teasers?](https://play.howstuffworks.com/quiz/can-you-get-11-of-these-basic-brain-teasers) | ověřeno: prohlížeč HTTP 202, titulek „Can You Get 11 of These Basic Brain Teasers? / HowStuffWorks“ (curl blokován ochranou proti botům) |
| en | text | logic |  | [Test Your Mental Mettle With These Ridiculous Riddles](https://play.howstuffworks.com/quiz/test-your-mental-mettle-with-these-ridiculous-riddles) | ověřeno: prohlížeč HTTP 200, titulek „Test Your Mental Mettle With These Ridiculous Riddles / HowS“ (curl blokován ochranou proti botům) |
| en | text | logic |  | [Can You Pass This Incredibly Difficult Logic Test?](https://play.howstuffworks.com/quiz/can-you-pass-this-incredibly-difficult-logic-test) | ověřeno: prohlížeč HTTP 200, titulek „Can You Pass This Incredibly Difficult Logic Test? / HowStuf“ (curl blokován ochranou proti botům) |
