export type UiLocale = "cs" | "en";

export const LOCALES: UiLocale[] = ["cs", "en"];
export const DEFAULT_LOCALE: UiLocale = "cs";
export const LOCALE_STORAGE_KEY = "kvizy:locale";

type Leaf = Record<UiLocale, string>;

const m = <T extends Record<string, Leaf>>(tree: T) => tree;

export const messages = m({
  brand: { cs: "Kvízovna", en: "Kvízovna" },
  addQuiz: { cs: "Přidat odkaz", en: "Add link" },
  createQuiz: { cs: "Vytvořit kvíz", en: "Create quiz" },
  addMenu: { cs: "Přidat do katalogu", en: "Add to catalog" },
  searchLabel: { cs: "Najdi kvíz pro svou partu", en: "Find a quiz for your crew" },
  searchPlaceholder: { cs: "Filmy, hádanky, jídlo…", en: "Movies, riddles, food…" },
  clearSearch: { cs: "Vymazat hledání", en: "Clear search" },
  heroLead: {
    cs: "Osobnostní testy, hádanky i poznávačky. Vyber podle nálady a otevři jedním kliknutím.",
    en: "Personality tests, riddles and trivia. Pick a mood and open it in one click.",
  },
  share: { cs: "Sdílet", en: "Share" },
  linkCopied: { cs: "Odkaz zkopírován", en: "Link copied" },
  linkCopyFailed: { cs: "Kopírování selhalo. Zkopíruj odkaz ručně:", en: "Copy failed. Copy the link manually:" },
  playQuiz: { cs: "Hrát kvíz", en: "Play quiz" },
  customBadge: { cs: "Vlastní kvíz", en: "Custom quiz" },
  filters: { cs: "Filtry", en: "Filters" },
  format: { cs: "Formát", en: "Format" },
  quizType: { cs: "Typ kvízu", en: "Quiz type" },
  language: { cs: "Jazyk", en: "Language" },
  popular: { cs: "Populární kvízy", en: "Popular quizzes" },
  popularEmpty: {
    cs: "Zatím nikdo nic neotevřel. Buďte první, kdo rozjede žebříček!",
    en: "Nobody has opened anything yet. Be the first to start the chart!",
  },
  results: { cs: "Výsledky", en: "Results" },
  allQuizzes: { cs: "Všechny kvízy", en: "All quizzes" },
  found: { cs: "Nalezeno", en: "Found" },
  clearFilters: { cs: "Vymazat hledání a filtry", en: "Clear search and filters" },
  emptyTitle: { cs: "Tady nic není.", en: "Nothing here." },
  emptyAllDone: {
    cs: "Všechny kvízy, které odpovídají hledání a filtrům, máš hotové.",
    en: "Every quiz matching the search and filters is marked done.",
  },
  emptyNoMatch: {
    cs: "Žádný kvíz neodpovídá hledání a filtrům. Zkus jiné slovo nebo uber filtry.",
    en: "No quiz matches the search and filters. Try another word or ease the filters.",
  },
  showDone: { cs: "Zobrazit hotové", en: "Show completed" },
  hideDone: { cs: "Skrýt hotové", en: "Hide completed" },
  footer: {
    cs: "Kvízy se otevírají na původních webech v nové záložce.",
    en: "Quizzes open on the original sites in a new tab.",
  },
  localeCs: { cs: "CZ", en: "CZ" },
  localeEn: { cs: "EN", en: "EN" },
  localeSwitch: { cs: "Jazyk rozhraní", en: "Interface language" },
  loading: { cs: "Načítám kvízy", en: "Loading quizzes" },

  formatImage: { cs: "Obrázkový", en: "Image" },
  formatText: { cs: "Textový", en: "Text" },
  formatMixed: { cs: "Kombinovaný", en: "Mixed" },
  typePersonality: { cs: "Osobnostní", en: "Personality" },
  typePreference: { cs: "Preferenční", en: "Preference" },
  typeKnowledge: { cs: "Znalostní", en: "Knowledge" },
  typeLogic: { cs: "Logický a hádankový", en: "Logic & riddles" },

  collectionBadge: { cs: "Výběr testů", en: "Test collection" },
  openQuiz: { cs: "Otevřít kvíz", en: "Open quiz" },
  browseTests: { cs: "Prohlédnout testy", en: "Browse tests" },
  openNewTab: { cs: "(otevře se v nové záložce)", en: "(opens in a new tab)" },
  markDone: { cs: "Označit jako hotový", en: "Mark as done" },
  openedTimes: { cs: "× otevřeno", en: "× opened" },
  reportQuiz: { cs: "Nahlásit kvíz", en: "Report quiz" },
  formatTitle: { cs: "Formát", en: "Format" },
  languageTitle: { cs: "Jazyk", en: "Language" },

  addTitle: { cs: "Přidat kvíz", en: "Add quiz" },
  addLead: { cs: "Bez registrace. Pole s hvězdičkou jsou povinná.", en: "No sign-up. Fields with a star are required." },
  fieldTitle: { cs: "Název *", en: "Title *" },
  fieldUrl: { cs: "Přímý odkaz *", en: "Direct link *" },
  fieldFormat: { cs: "Formát *", en: "Format *" },
  fieldTypes: { cs: "Typ kvízu * (alespoň jeden)", en: "Quiz type * (at least one)" },
  fieldLanguage: { cs: "Jazyk *", en: "Language *" },
  fieldTopic: { cs: "Téma (nepovinné)", en: "Topic (optional)" },
  fieldDescription: { cs: "Krátký popis (nepovinné)", en: "Short description (optional)" },
  titlePlaceholder: { cs: "Která seriálová postava jsi?", en: "Which TV character are you?" },
  topicPlaceholder: { cs: "filmy, hudba, jídlo…", en: "movies, music, food…" },
  descriptionPlaceholder: {
    cs: "O čem kvíz je a proč se hodí pro partu",
    en: "What the quiz is about and why it fits a group",
  },
  languageSearch: { cs: "Hledat jazyk…", en: "Search language…" },
  languageEmpty: { cs: "Žádný jazyk neodpovídá.", en: "No language matches." },
  cancel: { cs: "Zrušit", en: "Cancel" },
  saveQuiz: { cs: "Uložit kvíz", en: "Save quiz" },
  saving: { cs: "Ukládám…", en: "Saving…" },
  quizAdded: { cs: "Kvíz je v katalogu!", en: "Quiz is in the catalog!" },
  quizAddedDesc: { cs: "teď najde každý z party.", en: "everyone in the crew can find it now." },
  duplicateUrl: { cs: "Tento odkaz už v katalogu je jako", en: "This link is already in the catalog as" },
  saveFailed: { cs: "Uložení se nepovedlo. Zkus to znovu.", en: "Could not save. Try again." },
  saveFailedNet: {
    cs: "Uložení se nepovedlo. Zkontroluj připojení a zkus to znovu.",
    en: "Could not save. Check your connection and try again.",
  },

  errTitleRequired: { cs: "Vyplň název kvízu.", en: "Enter a quiz title." },
  errTitleTooLong: { cs: "Název může mít nejvýš {n} znaků.", en: "Title can be at most {n} characters." },
  errUrlRequired: { cs: "Vlož přímý odkaz na kvíz.", en: "Paste a direct quiz link." },
  errUrlTooLong: { cs: "Odkaz je příliš dlouhý.", en: "The link is too long." },
  errUrlInvalid: {
    cs: "Odkaz musí začínat http:// nebo https:// a vést na web.",
    en: "The link must start with http:// or https:// and point to a website.",
  },
  errFormat: { cs: "Vyber formát kvízu.", en: "Choose a quiz format." },
  errLanguage: { cs: "Vyber jazyk kvízu.", en: "Choose a quiz language." },
  errTypes: { cs: "Vyber alespoň jeden typ kvízu.", en: "Choose at least one quiz type." },
  errDescriptionTooLong: { cs: "Popis může mít nejvýš {n} znaků.", en: "Description can be at most {n} characters." },
  errTopicTooLong: { cs: "Téma může mít nejvýš {n} znaků.", en: "Topic can be at most {n} characters." },
  errCheckFields: { cs: "Zkontroluj zvýrazněná pole.", en: "Check the highlighted fields." },

  reportTitle: { cs: "Nahlásit kvíz", en: "Report quiz" },
  reportThanks: { cs: "Díky za hlášení", en: "Thanks for the report" },
  reportSaved: {
    cs: "Hlášení jsme uložili. Správce se na kvíz podívá; do té doby v katalogu zůstává.",
    en: "We saved the report. A moderator will review it; the quiz stays in the catalog for now.",
  },
  reportReason: { cs: "Důvod *", en: "Reason *" },
  reportNote: { cs: "Doplnění (nepovinné)", en: "Details (optional)" },
  reportNoteRequired: { cs: "Doplnění *", en: "Details *" },
  reportNotePlaceholder: {
    cs: "Co přesně nefunguje nebo nesedí?",
    en: "What exactly is wrong or mismatched?",
  },
  reportNotePlaceholderOther: { cs: "Stručně popiš, co je špatně", en: "Briefly describe what is wrong" },
  reportSend: { cs: "Odeslat hlášení", en: "Send report" },
  reportSending: { cs: "Odesílám…", en: "Sending…" },
  reportClose: { cs: "Zavřít", en: "Close" },
  reportFailed: { cs: "Hlášení se nepodařilo odeslat. Zkus to znovu.", en: "Could not send the report. Try again." },
  reportFailedNet: {
    cs: "Hlášení se nepodařilo odeslat. Zkontroluj připojení a zkus to znovu.",
    en: "Could not send the report. Check your connection and try again.",
  },
  reasonBroken: { cs: "Nefunkční odkaz", en: "Broken link" },
  reasonWrong: { cs: "Nesprávné zařazení", en: "Wrong category" },
  reasonBad: { cs: "Nevhodný obsah", en: "Inappropriate content" },
  reasonDup: { cs: "Duplicita", en: "Duplicate" },
  reasonOther: { cs: "Jiné", en: "Other" },
  errReason: { cs: "Vyber důvod hlášení.", en: "Choose a report reason." },
  errNoteOther: { cs: "U důvodu Jiné stručně popiš, co je špatně.", en: "For Other, briefly describe what is wrong." },
  errNoteTooLong: { cs: "Doplnění může mít nejvýš {n} znaků.", en: "Details can be at most {n} characters." },

  adminToken: { cs: "Přístupový klíč správce", en: "Admin access key" },
  adminShow: { cs: "Zobrazit hlášení", en: "Show reports" },
  adminLoading: { cs: "Načítám…", en: "Loading…" },
  adminEmpty: { cs: "Zatím žádná hlášení.", en: "No reports yet." },
  adminClosed: {
    cs: "Správa hlášení je vypnutá: na serveru není nastavený přístupový klíč.",
    en: "Report admin is off: no access key is set on the server.",
  },
  adminRate: { cs: "Příliš mnoho pokusů. Zkus to za minutu.", en: "Too many attempts. Try again in a minute." },
  adminDenied: { cs: "Neplatný přístupový klíč.", en: "Invalid access key." },
  adminLoadFailed: {
    cs: "Hlášení se nepodařilo načíst. Zkontroluj připojení.",
    en: "Could not load reports. Check your connection.",
  },
  adminTime: { cs: "Čas", en: "Time" },
  adminQuiz: { cs: "Kvíz", en: "Quiz" },
  adminReasonCol: { cs: "Důvod", en: "Reason" },
  adminNoteCol: { cs: "Doplnění", en: "Details" },
  adminLogin: { cs: "Přihlášení správce", en: "Admin sign-in" },

  createTitle: { cs: "Vytvořit kvíz", en: "Create a quiz" },
  createLead: {
    cs: "Znalostní nebo osobnostní kvíz přímo v Kvízovně. Bez registrace.",
    en: "A knowledge or personality quiz hosted in Kvízovna. No sign-up.",
  },
  quizMode: { cs: "Typ kvízu", en: "Quiz mode" },
  modeKnowledge: { cs: "Znalostní", en: "Knowledge" },
  modePersonality: { cs: "Osobnostní", en: "Personality" },
  fieldFormatCustom: { cs: "Formát zobrazení", en: "Display format" },
  outcomesHeading: { cs: "Možné výsledky", en: "Possible outcomes" },
  outcomesHelp: {
    cs: "Pořadí rozhoduje remízu: výš = výhra při stejném skóre. Přesouvej šipkami.",
    en: "Order breaks ties: higher wins on equal scores. Reorder with the arrows.",
  },
  addOutcome: { cs: "Přidat výsledek", en: "Add outcome" },
  removeOutcome: { cs: "Odebrat výsledek", en: "Remove outcome" },
  outcomeTitle: { cs: "Název výsledku *", en: "Outcome title *" },
  outcomeDescription: { cs: "Popis výsledku *", en: "Outcome description *" },
  moveUp: { cs: "Nahoru", en: "Move up" },
  moveDown: { cs: "Dolů", en: "Move down" },
  weightLabel: { cs: "Váha (1–5)", en: "Weight (1–5)" },
  mapsToOutcome: { cs: "Přiřadit k výsledku", en: "Maps to outcome" },
  orphanOutcome: {
    cs: "Tato odpověď odkazuje na odebraný výsledek — vyber nový.",
    en: "This answer points to a removed outcome — pick a new one.",
  },
  addQuestion: { cs: "Přidat otázku", en: "Add question" },
  removeQuestion: { cs: "Odebrat otázku", en: "Remove question" },
  addOption: { cs: "Přidat možnost", en: "Add option" },
  removeOption: { cs: "Odebrat", en: "Remove" },
  questionN: { cs: "Otázka {n}", en: "Question {n}" },
  promptLabel: { cs: "Text otázky", en: "Question text" },
  optionLabel: { cs: "Možnost", en: "Option" },
  correctLabel: { cs: "Správná", en: "Correct" },
  imageUpload: { cs: "Obrázek", en: "Image" },
  imageAlt: { cs: "Alternativní text *", en: "Alt text *" },
  imageHint: {
    cs: "JPEG, PNG, WebP nebo GIF, nejvýše 1 MB.",
    en: "JPEG, PNG, WebP or GIF, max 1 MB.",
  },
  imageReplace: { cs: "Vyměnit", en: "Replace" },
  imageRemove: { cs: "Odebrat obrázek", en: "Remove image" },
  preview: { cs: "Náhled a vyzkoušení", en: "Preview & try" },
  previewPlay: { cs: "Vyzkoušej kvíz", en: "Try the quiz" },
  publishQuiz: { cs: "Zveřejnit kvíz", en: "Publish quiz" },
  publishing: { cs: "Zveřejňuji…", en: "Publishing…" },
  backToEdit: { cs: "Zpět k úpravám", en: "Back to editing" },
  submitAnswers: { cs: "Odevzdat odpovědi", en: "Submit answers" },
  yourScore: { cs: "Tvůj výsledek: {score} / {total}", en: "Your score: {score} / {total}" },
  yourPersonality: { cs: "Tvůj výsledek:", en: "Your result:" },
  correctAnswer: { cs: "Správně:", en: "Correct:" },
  yourAnswer: { cs: "Tvoje odpověď:", en: "Your answer:" },
  playAgain: { cs: "Hrát znovu", en: "Play again" },
  backToCatalog: { cs: "Zpět do katalogu", en: "Back to catalog" },
  otherLanguage: { cs: "Jiný jazyk", en: "Other language" },
  otherLanguageSearch: { cs: "Hledat jazyk…", en: "Search languages…" },
  otherLanguageEmpty: { cs: "Žádný jazyk neodpovídá.", en: "No language matches." },
  errCustomMode: { cs: "Vyber typ kvízu.", en: "Choose a quiz mode." },
  errCustomQuestionsMin: { cs: "Přidej alespoň jednu otázku.", en: "Add at least one question." },
  errCustomQuestionsMax: { cs: "Maximum je 40 otázek.", en: "At most 40 questions." },
  errCustomOutcomesMin: { cs: "Přidej alespoň dva výsledky.", en: "Add at least two outcomes." },
  errCustomOutcomesMax: { cs: "Maximum je 12 výsledků.", en: "At most 12 outcomes." },
  errCustomOutcomeTitle: { cs: "Doplň název výsledku č. {n}.", en: "Fill in outcome title {n}." },
  errCustomOutcomeDesc: { cs: "Doplň popis výsledku č. {n}.", en: "Fill in outcome description {n}." },
  errCustomOutcomeDup: { cs: "Každý výsledek musí mít unikátní klíč.", en: "Each outcome needs a unique key." },
  errCustomPrompt: { cs: "Doplň text nebo obrázek otázky č. {n}.", en: "Add text or an image for question {n}." },
  errCustomPromptOrImage: {
    cs: "Otázka {n} potřebuje text nebo obrázek.",
    en: "Question {n} needs text or an image.",
  },
  errCustomOptionsCount: {
    cs: "Otázka {n} potřebuje 2–6 možností.",
    en: "Question {n} needs 2–6 options.",
  },
  errCustomOptionLabel: { cs: "Doplň text možnosti u otázky {n}.", en: "Fill in an option for question {n}." },
  errCustomOptionOrImage: {
    cs: "Možnost u otázky {n} potřebuje text nebo obrázek.",
    en: "An option on question {n} needs text or an image.",
  },
  errCustomOptionOutcome: {
    cs: "U otázky {n} přiřaď každou odpověď k platnému výsledku.",
    en: "On question {n}, map every answer to a valid outcome.",
  },
  errCustomOptionWeight: {
    cs: "U otázky {n} nastav váhu 1–5.",
    en: "On question {n}, set a weight from 1 to 5.",
  },
  errCustomOneCorrect: {
    cs: "U otázky {n} označ právě jednu správnou odpověď.",
    en: "Mark exactly one correct answer for question {n}.",
  },
  errCustomImage: { cs: "Neplatný obrázek.", en: "Invalid image." },
  errCustomImageAlt: { cs: "Doplň alternativní text obrázku.", en: "Add image alt text." },
  errCustomImageMissing: { cs: "Obrázek už v úložišti není.", en: "That image is no longer stored." },
});

export type MessageKey = keyof typeof messages;

export function t(key: MessageKey, locale: UiLocale, vars?: Record<string, string | number>): string {
  let text = messages[key][locale];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export function pluralQuizzes(count: number, locale: UiLocale): string {
  if (locale === "en") return count === 1 ? "1 quiz" : `${count} quizzes`;
  if (count === 1) return "1 kvíz";
  if (count >= 2 && count <= 4) return `${count} kvízy`;
  return `${count} kvízů`;
}
