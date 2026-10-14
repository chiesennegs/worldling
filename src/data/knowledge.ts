import { alphabetGraphemes } from "./alphabets";
import {
  subdivisionCollections,
  subdivisionCollectionByCountry,
} from "./subdivision-collections";
import type {
  Entity,
  Script,
  Grapheme,
  Relationship,
  Word,
  QuizDefinition,
  WritingSystem,
  Provenance,
  Country,
} from "./schema";
import countryData from "./countries.json";
export const countries = countryData as unknown as Country[];
const history: Provenance = {
  source: "Encyclopædia Britannica, Alphabet (historical overview)",
  sourceURL:
    "https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Alphabet",
  confidence: "high",
  notes:
    "Broad ancestry only; dates are approximate and transmission may involve regional variants.",
};
const unicode: Provenance = {
  source: "The Unicode Standard — script chapters and character charts",
  sourceURL: "https://www.unicode.org/standard/standard.html",
  confidence: "high",
};
const early: Provenance = {
  source:
    "The Metropolitan Museum of Art — Alphabet Origins: From Kipling to Sinai",
  sourceURL:
    "https://www.metmuseum.org/exhibitions/listings/2014/assyria-to-iberia/blog/posts/alphabet",
  confidence: "medium",
  notes: "Early alphabetic origins and exact dating remain debated.",
};
const rawScripts: [
  string,
  string,
  Script["kind"],
  Script["direction"],
  string,
  number,
  string,
  string[],
  string,
][] = [
  [
    "proto-sinaitic",
    "Proto-Sinaitic",
    "abjad",
    "rtl",
    "c. 1800–1500 BCE",
    -1800,
    "𐤀",
    ["early-semitic"],
    "Early alphabetic inscriptions associated with the Sinai and Egypt. The dates, direction, and readings vary; the sample is a later Phoenician descendant, not a reconstructed early glyph.",
  ],
  [
    "phoenician",
    "Phoenician",
    "abjad",
    "rtl",
    "c. 1050 BCE",
    -1050,
    "𐤀𐤁𐤂",
    ["phn"],
    "A consonantal script of the eastern Mediterranean, influential in the histories of Greek and Aramaic writing.",
  ],
  [
    "aramaic",
    "Aramaic",
    "abjad",
    "rtl",
    "c. 800 BCE",
    -800,
    "𐡀𐡁𐡂",
    ["arc"],
    "A family of consonantal writing traditions used across the ancient Near East.",
  ],
  [
    "greek",
    "Greek",
    "alphabet",
    "ltr",
    "c. 800 BCE",
    -800,
    "Αβγ",
    ["ell"],
    "Adapted from Phoenician, Greek made systematic use of letters for vowels. Ancient regional forms differed.",
  ],
  [
    "etruscan",
    "Etruscan",
    "alphabet",
    "rtl",
    "c. 700 BCE",
    -700,
    "𐌀𐌁𐌂",
    ["ett"],
    "An Old Italic writing tradition adapted from a western Greek alphabet.",
  ],
  [
    "latin",
    "Latin",
    "alphabet",
    "ltr",
    "c. 700 BCE",
    -700,
    "Aa Bb",
    ["eng", "por", "fra", "spa", "ita"],
    "Developed in ancient Italy through Etruscan transmission of Greek writing. Today it is adapted by many languages.",
  ],
  [
    "hebrew",
    "Hebrew",
    "abjad",
    "rtl",
    "c. 300 BCE",
    -300,
    "אבג",
    ["heb"],
    "The square Hebrew script developed from Aramaic. Vowel points can supplement its consonantal letters.",
  ],
  [
    "nabataean",
    "Nabataean",
    "abjad",
    "rtl",
    "c. 200 BCE",
    -200,
    "𐢀𐢁",
    ["xna"],
    "An Aramaic-derived writing tradition whose later cursive forms contributed to the emergence of Arabic script.",
  ],
  [
    "arabic",
    "Arabic",
    "abjad",
    "rtl",
    "c. 400 CE",
    400,
    "العربية",
    ["ara", "fas", "urd"],
    "A connected script descended through Nabataean. Letters have contextual forms; it is used for several languages.",
  ],
  [
    "cyrillic",
    "Cyrillic",
    "alphabet",
    "ltr",
    "c. 900 CE",
    900,
    "Аа Бб Вв",
    ["rus", "ukr", "bul", "srp", "mkd", "bel"],
    "Developed in the First Bulgarian Empire, chiefly from Greek with additional letters for Slavic sounds. Different languages use different Cyrillic alphabets; this collection starts with the 33-letter modern Russian alphabet.",
  ],
  [
    "devanagari",
    "Devanagari",
    "abugida",
    "ltr",
    "c. 1000 CE",
    1000,
    "देवनागरी",
    ["hin", "mar", "nep"],
    "Consonant signs carry an inherent vowel that can be changed with dependent vowel signs.",
  ],
  [
    "hiragana",
    "Hiragana",
    "syllabary",
    "ltr",
    "c. 800 CE",
    800,
    "あいう",
    ["jpn"],
    "A Japanese moraic syllabary developed from cursive forms of Chinese characters.",
  ],
  [
    "han",
    "Han",
    "logographic",
    "ltr",
    "Ancient to present",
    -1200,
    "山字",
    ["zho", "jpn"],
    "Characters generally represent morphemes and include phonetic components; Chinese writing is often described as morphosyllabic.",
  ],
];
export const scripts: Script[] = rawScripts.map(
  ([
    id,
    name,
    kind,
    direction,
    period,
    year,
    sample,
    languageIds,
    description,
  ]) => ({
    id,
    type: "script",
    name,
    kind,
    direction,
    period,
    year,
    sample,
    languageIds,
    description,
    provenance:
      id === "proto-sinaitic"
        ? [early]
        : ["devanagari", "hiragana", "han"].includes(id)
          ? [
              unicode,
              {
                source: "Unicode core specification — script structure",
                sourceURL:
                  id === "devanagari"
                    ? "https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/"
                    : "https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-18/",
                confidence: "high",
              },
            ]
          : [unicode, history, early],
  }),
);
export const languages: Entity[] = [
  ...new Map(
    countries.flatMap((c) =>
      Object.entries(c.languages).map(([id, name]) => [
        id,
        { id, type: "language" as const, name },
      ]),
    ),
  ).values(),
  { id: "mar", type: "language", name: "Marathi" },
  { id: "phn", type: "language", name: "Phoenician" },
  { id: "ett", type: "language", name: "Etruscan" },
  { id: "xna", type: "language", name: "Nabataean Aramaic" },
  {
    id: "early-semitic",
    type: "language",
    name: "Early Northwest Semitic (reconstructed)",
  },
];
export const writingSystems: WritingSystem[] = scripts.flatMap((s) =>
  s.languageIds.map((l) => ({
    id: `ws-${l}-${s.id}`,
    type: "writing-system" as const,
    name: `${languages.find((x) => x.id === l)?.name || l} · ${s.name}`,
    kind: s.kind,
    scriptId: s.id,
    languageIds: [l],
  })),
);
const letterRows: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
][] = [
  ["latin-a", "A", "A", "latin", "a", "/eɪ/", "eng", 1],
  ["latin-b", "B", "B", "latin", "b", "/biː/", "eng", 2],
  ["latin-c", "C", "C", "latin", "c", "/siː/", "eng", 3],
  ["greek-alpha", "Alpha", "Α", "greek", "a", "/a/", "ell", 1],
  ["greek-beta", "Beta", "Β", "greek", "v", "/v/", "ell", 2],
  ["greek-gamma", "Gamma", "Γ", "greek", "g", "/ɣ/, /ʝ/", "ell", 3],
  [
    "phoenician-aleph",
    "Aleph",
    "𐤀",
    "phoenician",
    "ʾ",
    "/ʔ/ (reconstructed)",
    "phn",
    1,
  ],
  [
    "phoenician-bet",
    "Bet",
    "𐤁",
    "phoenician",
    "b",
    "/b/ (reconstructed)",
    "phn",
    2,
  ],
  [
    "phoenician-gimel",
    "Gimel",
    "𐤂",
    "phoenician",
    "g",
    "/ɡ/ (reconstructed)",
    "phn",
    3,
  ],
  ["aramaic-aleph", "Aleph", "𐡀", "aramaic", "ʾ", "/ʔ/ (historical)", "arc", 1],
  ["hebrew-alef", "Alef", "א", "hebrew", "ʾ", "/ʔ/ or silent", "heb", 1],
  ["hebrew-bet", "Bet", "ב", "hebrew", "b / v", "/b/, /v/", "heb", 2],
  ["etruscan-a", "A", "𐌀", "etruscan", "a", "/a/ (reconstructed)", "ett", 1],
  [
    "nabataean-alaph",
    "Alaph",
    "𐢀",
    "nabataean",
    "ʾ",
    "/ʔ/ (historical)",
    "xna",
    1,
  ],
  [
    "arabic-alif",
    "Alif",
    "ا",
    "arabic",
    "ā",
    "/aː/; carrier for hamza",
    "ara",
    1,
  ],
  ["arabic-ba", "Bāʾ", "ب", "arabic", "b", "/b/", "ara", 2],
  ["arabic-sin", "Sīn", "س", "arabic", "s", "/s/", "ara", 12],
  ["arabic-lam", "Lām", "ل", "arabic", "l", "/l/", "ara", 23],
  ["arabic-mim", "Mīm", "م", "arabic", "m", "/m/", "ara", 24],
  ["devanagari-ka", "Ka", "क", "devanagari", "ka", "/kə/", "hin", 1],
  ["hiragana-a", "A", "あ", "hiragana", "a", "/a/", "jpn", 1],
  ["han-mountain", "Mountain", "山", "han", "shān", "/ʂan˥/", "zho", 1],
];
export const graphemes: Grapheme[] = letterRows.map(
  ([id, name, symbol, scriptId, transliteration, ipa, language, order]) => ({
    id,
    type: "grapheme",
    name,
    symbol,
    scriptId,
    transliteration,
    order,
    sounds: [
      {
        ipa,
        language,
        context:
          scriptId === "latin"
            ? "English letter name; letter sounds depend on word and language."
            : "Representative value; pronunciation depends on language, period, and context.",
        speechText: symbol,
      },
    ],
    forms:
      scriptId === "latin"
        ? { uppercase: symbol, lowercase: symbol.toLowerCase() }
        : scriptId === "greek"
          ? { uppercase: symbol, lowercase: symbol.toLowerCase() }
          : { isolated: symbol },
    provenance: [unicode],
  }),
);
for (const letter of alphabetGraphemes()) {
  const existing = graphemes.find((g) => g.id === letter.id);
  if (existing)
    Object.assign(existing, letter, {
      forms: { ...letter.forms, ...existing.forms },
    });
  else graphemes.push(letter);
}
Object.assign(graphemes.find((g) => g.id === "greek-sigma")!.forms, {
  final: "ς",
});
for (const [id, final] of [
  ["kaf", "ך"],
  ["mem", "ם"],
  ["nun", "ן"],
  ["pe", "ף"],
  ["tsadi", "ץ"],
])
  graphemes.find((g) => g.id === `hebrew-${id}`)!.forms.final = final;
Object.assign(graphemes.find((g) => g.id === "arabic-ba")!.forms, {
  initial: "بـ",
  medial: "ـبـ",
  final: "ـب",
});
Object.assign(graphemes.find((g) => g.id === "arabic-sin")!.forms, {
  initial: "سـ",
  medial: "ـسـ",
  final: "ـس",
});
Object.assign(graphemes.find((g) => g.id === "arabic-lam")!.forms, {
  initial: "لـ",
  medial: "ـلـ",
  final: "ـل",
});
Object.assign(graphemes.find((g) => g.id === "arabic-mim")!.forms, {
  initial: "مـ",
  medial: "ـمـ",
  final: "ـم",
});
Object.assign(graphemes.find((g) => g.id === "arabic-alif")!.forms, {
  final: "ـا",
});
graphemes.find((g) => g.id === "phoenician-aleph")!.origin =
  "The historical letter name is associated with a Semitic word for “ox”; the earlier pictorial interpretation is a reconstruction. The letter itself does not ordinarily mean “ox”.";
export const words: Word[] = [
  {
    id: "word-salam",
    type: "word",
    name: "Salām",
    languageId: "ara",
    scriptId: "arabic",
    text: "سلام",
    symbol: "سلام",
    translation: "peace",
    transliteration: "salām",
    pronunciation: {
      ipa: "/sa.laːm/",
      language: "ara",
      dialect: "Modern Standard Arabic",
      speechText: "سلام",
    },
    description:
      "The lām and alif form a ligature. Glyph shaping is not a one-to-one mapping from graphemes to visible shapes.",
    provenance: [
      {
        source: "Wiktionary — سلام",
        sourceURL: "https://en.wiktionary.org/wiki/سلام#Arabic",
        confidence: "high",
      },
    ],
    segments: [
      {
        graphemeId: "arabic-sin",
        contextual: "سـ",
        isolated: "س",
        name: "Sīn",
        sound: "/s/",
      },
      {
        graphemeId: "arabic-lam",
        contextual: "ـلـ",
        isolated: "ل",
        name: "Lām",
        sound: "/l/",
      },
      {
        graphemeId: "arabic-alif",
        contextual: "ـا",
        isolated: "ا",
        name: "Alif",
        sound: "/aː/",
      },
      {
        graphemeId: "arabic-mim",
        contextual: "م",
        isolated: "م",
        name: "Mīm",
        sound: "/m/",
      },
    ],
  },
];
export const entities: Entity[] = [
  ...scripts,
  ...languages,
  ...writingSystems,
  ...graphemes,
  ...words,
];
export const relationships: Relationship[] = [];
function link(
  from: string,
  to: string,
  type: Relationship["type"],
  provenance?: Provenance,
  notes?: string,
) {
  relationships.push({ from, to, type, provenance, notes });
}
for (const c of countries) {
  const id = `country-${c.cca3}`;
  entities.push({
    id,
    type: "country",
    name: c.name,
    symbol: c.flag,
    description: c.subregion,
  });
  entities.push({
    id: `flag-${c.cca3}`,
    type: "flag",
    name: `Flag of ${c.name}`,
    symbol: c.flag,
  });
  link(`flag-${c.cca3}`, id, "FLAG_OF");
  for (const cap of c.capital) {
    const cid = `capital-${c.cca3}-${cap}`;
    entities.push({ id: cid, type: "capital", name: cap });
    link(id, cid, "HAS_CAPITAL");
  }
  for (const l of Object.keys(c.languages)) link(l, id, "SPOKEN_IN");
}
for (const s of scripts)
  for (const l of s.languageIds) {
    link(l, s.id, "USES_SCRIPT");
    link(s.id, l, "USED_BY_LANGUAGE");
  }
for (const ws of writingSystems) {
  link(ws.id, ws.scriptId, "USES_SCRIPT");
  for (const l of ws.languageIds) link(l, ws.id, "USES_WRITING_SYSTEM");
}
for (const g of graphemes) {
  entities.push({ id: `name-${g.id}`, type: "name", name: g.name });
  entities.push({ id: `sound-${g.id}`, type: "sound", name: g.sounds[0].ipa });
  link(g.id, `name-${g.id}`, "HAS_NAME");
  link(g.id, `sound-${g.id}`, "HAS_SOUND");
  link(g.id, g.scriptId, "BELONGS_TO_SCRIPT");
}
for (const [child, parent] of [
  ["phoenician", "proto-sinaitic"],
  ["aramaic", "phoenician"],
  ["greek", "phoenician"],
  ["cyrillic", "greek"],
  ["etruscan", "greek"],
  ["latin", "etruscan"],
  ["hebrew", "aramaic"],
  ["nabataean", "aramaic"],
  ["arabic", "nabataean"],
])
  link(
    child,
    parent,
    "DERIVED_FROM",
    parent === "proto-sinaitic" ? early : history,
  );
for (const [child, parent] of [
  ["greek-alpha", "phoenician-aleph"],
  ["etruscan-a", "greek-alpha"],
  ["latin-a", "etruscan-a"],
  ["aramaic-aleph", "phoenician-aleph"],
  ["hebrew-alef", "aramaic-aleph"],
  ["nabataean-alaph", "aramaic-aleph"],
  ["arabic-alif", "nabataean-alaph"],
  ["greek-beta", "phoenician-bet"],
  ["greek-gamma", "phoenician-gimel"],
])
  link(child, parent, "DESCENDED_FROM_GLYPH", history);
for (const [child, parent] of [
  ["a", "alpha"],
  ["ve", "beta"],
  ["ge", "gamma"],
  ["de", "delta"],
  ["ka", "kappa"],
  ["el", "lambda"],
  ["em", "mu"],
  ["en", "nu"],
  ["o", "omicron"],
  ["pe", "pi"],
  ["er", "rho"],
  ["es", "sigma"],
  ["te", "tau"],
  ["ef", "phi"],
  ["kha", "chi"],
])
  link(`cyrillic-${child}`, `greek-${parent}`, "DESCENDED_FROM_GLYPH", {
    source: "Unicode — Cyrillic and Greek",
    sourceURL:
      "https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-7/",
    confidence: "high",
  });
const cyrillicEdge = relationships.find(
  (r) => r.from === "cyrillic" && r.type === "DERIVED_FROM",
);
if (cyrillicEdge)
  cyrillicEdge.provenance = {
    source: "Unicode — Cyrillic",
    sourceURL:
      "https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-7/",
    confidence: "high",
  };
link(
  "latin-a",
  "greek-alpha",
  "VISUALLY_SIMILAR_TO",
  undefined,
  "Similar uppercase shapes do not imply identical pronunciation.",
);
link(
  "greek-alpha",
  "hiragana-a",
  "PHONETICALLY_SIMILAR_TO",
  undefined,
  "A representative /a/ value; no historical ancestry is asserted.",
);
export const subdivisions: Record<string, string[]> = {
  LBN: ["Beirut", "Mount Lebanon", "North Lebanon"],
  PRT: ["Lisbon", "Porto", "Faro"],
  ...Object.fromEntries(
    subdivisionCollections.map((c) => [
      c.countryCode,
      c.entries.map((s) => s.name),
    ]),
  ),
};
for (const [code, names] of Object.entries(subdivisions))
  for (const name of names) {
    const state = subdivisionCollectionByCountry
      .get(code)
      ?.entries.find((s) => s.name === name);
    const id = state?.id || `subdivision-${code}-${name}`;
    entities.push(state || { id, type: "subdivision", name });
    link(`country-${code}`, id, "HAS_SUBDIVISION", state?.provenance?.[0]);
    if (state) {
      entities.push({
        id: state.capitalId,
        type: "capital",
        name: state.capital,
        provenance: state.provenance,
        description: state.capitalNote,
      });
      link(id, state.capitalId, "HAS_CAPITAL", state.provenance?.[0]);
    }
  }
export const quizzes: QuizDefinition[] = [
  ...subdivisionCollections
    .filter((c) => c.countryCode !== "USA" && c.practiceQuizId)
    .map((c) => ({
      id: c.practiceQuizId!,
      name: `${c.countryName}: capitals & government seats`,
      description: `Connect ${c.countryName}'s ${c.divisionPlural} to their capitals or government seats.`,
      icon: "globe",
      promptType: "subdivision" as const,
      answerType: "capital" as const,
      relation: "HAS_CAPITAL" as const,
      subdivisionCountryCode: c.countryCode,
    })),
  {
    id: "state-capitals",
    subdivisionCountryCode: "USA",
    name: "U.S. states & their capitals",
    description: "Connect all 50 U.S. states to their capital cities.",
    icon: "globe",
    promptType: "subdivision",
    relation: "HAS_CAPITAL",
  },
  {
    id: "capital-states",
    subdivisionCountryCode: "USA",
    name: "U.S. capital to state",
    description: "Which U.S. state calls this city its capital?",
    icon: "globe",
    promptType: "capital",
    relation: "HAS_CAPITAL",
    reverse: true,
    answerType: "subdivision",
  },
  {
    id: "flags",
    name: "Flying colors",
    description: "A flag. Four places. Where does it belong?",
    icon: "flag",
    promptType: "flag",
    relation: "FLAG_OF",
  },
  {
    id: "capitals",
    name: "Capital connections",
    description: "Find the city at the heart of each country.",
    icon: "globe",
    promptType: "country",
    relation: "HAS_CAPITAL",
  },
  {
    id: "letters",
    name: "Meet the letters",
    description: "Put a name to a familiar—or unfamiliar—glyph.",
    icon: "type",
    promptType: "grapheme",
    relation: "HAS_NAME",
  },
  {
    id: "scripts",
    name: "Name that script",
    description: "Discover the writing behind the symbols.",
    icon: "type",
    promptType: "grapheme",
    relation: "BELONGS_TO_SCRIPT",
  },
  {
    id: "ancestors",
    name: "Back to the roots",
    description: "Follow a letter one step into its past.",
    icon: "history",
    promptType: "grapheme",
    relation: "DESCENDED_FROM_GLYPH",
  },
  {
    id: "map",
    name: "A place in the world",
    description: "Find a country on the atlas.",
    icon: "globe",
    promptType: "flag",
    relation: "FLAG_OF",
    map: true,
  },
  {
    id: "reverse-capitals",
    answerType: "country",
    name: "From city to country",
    description: "Which country calls this city its capital?",
    icon: "globe",
    promptType: "capital",
    relation: "HAS_CAPITAL",
    reverse: true,
  },
  {
    id: "reverse-flags",
    name: "Raise the flag",
    description: "Match a place with its national flag.",
    icon: "flag",
    promptType: "country",
    relation: "FLAG_OF",
    reverse: true,
  },
  {
    id: "sounds",
    name: "Sounds & symbols",
    description: "Explore representative phonetic values.",
    icon: "type",
    promptType: "grapheme",
    relation: "HAS_SOUND",
  },
];
