import type { Grapheme, Provenance, LetterMeaning } from "./schema";
import { historicalFamilies } from "./historical-correspondence";
export type ComparisonMode = "historical" | "sound" | "roman";
export const defaultComparisonMode: ComparisonMode = "historical";
export const alphabetSource: Provenance = {
  source: "ALA-LC romanization tables; Unicode script chapters",
  sourceURL: "https://www.loc.gov/catdir/cpso/roman",
  confidence: "high",
  notes:
    "Comparison uses simplified educational romanization and broad representative sound values, not a complete ALA-LC transliteration algorithm. Values depend on language and context.",
};
export interface AlphabetLetter {
  symbol: string;
  slug: string;
  name: string;
  roman: string;
  sounds: string[];
  ipa: string;
  meaning?: LetterMeaning;
}
export interface Alphabet {
  id: string;
  label: string;
  language: string;
  notes: string;
  letters: AlphabetLetter[];
}
// symbol | stable slug | name | educational romanization | sound-row keys | representative IPA
function letters(rows: string): AlphabetLetter[] {
  return rows
    .split("\n")
    .filter(Boolean)
    .map((row) => {
      const [symbol, slug, name, roman, sounds, ipa] = row.split("|");
      return {
        symbol,
        slug,
        name,
        roman,
        sounds: sounds ? sounds.split(",") : [],
        ipa,
      };
    });
}
export const alphabets: Alphabet[] = [
  {
    id: "latin",
    label: "Latin",
    language: "eng",
    notes:
      "Basic 26-letter Latin alphabet. Sound comparison uses conventional Latin values, not English letter names; values vary across languages.",
    letters: letters(`A|a|A|a|a|/a/
B|b|B|b|b|/b/
C|c|C|c|k|/k/
D|d|D|d|d|/d/
E|e|E|e|e|/e/
F|f|F|f|f|/f/
G|g|G|g|g|/ɡ/
H|h|H|h|h|/h/
I|i|I|i|i,j|/i/, /j/
J|j|J|j|j|/j/ in some Latin-script languages
K|k|K|k|k|/k/
L|l|L|l|l|/l/
M|m|M|m|m|/m/
N|n|N|n|n|/n/
O|o|O|o|o|/o/
P|p|P|p|p|/p/
Q|q|Q|q|k|/k/ before /w/ in Latin
R|r|R|r|r|/r/
S|s|S|s|s|/s/
T|t|T|t|t|/t/
U|u|U|u|u|/u/
V|v|V|v|v|/v/ in many modern languages
W|w|W|w|w|/w/ in English
X|x|X|x|ks|/ks/
Y|y|Y|y|y|/y/ in Classical Latin loans
Z|z|Z|z|z|/z/ in many languages`),
  },
  {
    id: "greek",
    label: "Greek",
    language: "ell",
    notes:
      "24 modern Greek letters. Romanization keeps distinctions such as ē/ō; modern β is v. Vowels and consonants also participate in digraphs.",
    letters: letters(`Α|alpha|Alpha|a|a|/a/
Β|beta|Beta|v|v|/v/
Γ|gamma|Gamma|g|gh|/ɣ/, /ʝ/
Δ|delta|Delta|d|dh|/ð/
Ε|epsilon|Epsilon|e|e|/e/
Ζ|zeta|Zeta|z|z|/z/
Η|eta|Eta|ē|i|/i/
Θ|theta|Theta|th|th|/θ/
Ι|iota|Iota|i|i|/i/
Κ|kappa|Kappa|k|k|/k/, /c/
Λ|lambda|Lambda|l|l|/l/
Μ|mu|Mu|m|m|/m/
Ν|nu|Nu|n|n|/n/
Ξ|xi|Xi|x|ks|/ks/
Ο|omicron|Omicron|o|o|/o/
Π|pi|Pi|p|p|/p/
Ρ|rho|Rho|r|r|/r/
Σ|sigma|Sigma|s|s|/s/
Τ|tau|Tau|t|t|/t/
Υ|upsilon|Upsilon|y|i|/i/ alone; digraph values differ
Φ|phi|Phi|ph|f|/f/
Χ|chi|Chi|ch|kh|/x/, /ç/
Ψ|psi|Psi|ps|ps|/ps/
Ω|omega|Omega|ō|o|/o/`),
  },
  {
    id: "cyrillic",
    label: "Cyrillic",
    language: "rus",
    notes:
      "Modern Russian alphabet: 33 letters. Cyrillic alphabets differ by language. Consonants can be palatalized; unstressed vowels change. The hard and soft signs have no standalone sound.",
    letters: letters(`А|a|A|a|a|/a/
Б|be|Be|b|b|/b/
В|ve|Ve|v|v|/v/
Г|ge|Ge|g|g|/ɡ/
Д|de|De|d|d|/d/
Е|ye|Ye|e|ye,e|/je/ or /e/ after a palatalized consonant
Ё|yo|Yo|ë|yo,o|/jo/ or /o/ after a palatalized consonant
Ж|zhe|Zhe|zh|zh|/ʐ/
З|ze|Ze|z|z|/z/
И|i|I|i|i|/i/
Й|short-i|Short I|ĭ|j|/j/
К|ka|Ka|k|k|/k/
Л|el|El|l|l|/l/, /lʲ/
М|em|Em|m|m|/m/
Н|en|En|n|n|/n/
О|o|O|o|o|/o/ when stressed
П|pe|Pe|p|p|/p/
Р|er|Er|r|r|/r/
С|es|Es|s|s|/s/
Т|te|Te|t|t|/t/
У|u|U|u|u|/u/
Ф|ef|Ef|f|f|/f/
Х|kha|Kha|kh|kh|/x/
Ц|tse|Tse|ts|ts|/ts/
Ч|che|Che|ch|ch|/tɕ/
Ш|sha|Sha|sh|sh|/ʂ/
Щ|shcha|Shcha|shch|shch|/ɕː/
Ъ|hard-sign|Hard sign|ʺ||No standalone sound; separates before iotated vowels
Ы|y|Y|y|barred-i|/ɨ/
Ь|soft-sign|Soft sign|ʹ||No standalone sound; marks palatalization or separation
Э|e|E|ė|e|/e/
Ю|yu|Yu|yu|yu,u|/ju/ or /u/ after a palatalized consonant
Я|ya|Ya|ya|ya,a|/ja/ or /a/ after a palatalized consonant`),
  },
  {
    id: "arabic",
    label: "Arabic",
    language: "ara",
    notes:
      "28 basic Arabic letters, Modern Standard Arabic values. Alif often marks long ā; hamza is a separate sign. Short-vowel marks and contextual forms are not separate alphabet letters here.",
    letters: letters(`ا|alif|Alif|ā|long-a|/aː/; carrier for hamza
ب|ba|Bāʾ|b|b|/b/
ت|ta|Tāʾ|t|t|/t/
ث|tha|Thāʾ|th|th|/θ/
ج|jim|Jīm|j|dzh|/dʒ/ in MSA; dialects vary
ح|ha-pharyngeal|Ḥāʾ|ḥ|pharyngeal-h|/ħ/
خ|kha|Khāʾ|kh|kh|/x/ ~ /χ/
د|dal|Dāl|d|d|/d/
ذ|dhal|Dhāl|dh|dh|/ð/
ر|ra|Rāʾ|r|r|/r/
ز|zay|Zāy|z|z|/z/
س|sin|Sīn|s|s|/s/
ش|shin|Shīn|sh|sh|/ʃ/
ص|sad|Ṣād|ṣ|emphatic-s|/sˤ/
ض|dad|Ḍād|ḍ|emphatic-d|/dˤ/
ط|ta-emphatic|Ṭāʾ|ṭ|emphatic-t|/tˤ/
ظ|za-emphatic|Ẓāʾ|ẓ|emphatic-dh|/ðˤ/
ع|ayn|ʿAyn|ʿ|ayn|/ʕ/
غ|ghayn|Ghayn|gh|gh|/ɣ/ ~ /ʁ/
ف|fa|Fāʾ|f|f|/f/
ق|qaf|Qāf|q|q|/q/
ك|kaf|Kāf|k|k|/k/
ل|lam|Lām|l|l|/l/
م|mim|Mīm|m|m|/m/
ن|nun|Nūn|n|n|/n/
ه|ha|Hāʾ|h|h|/h/
و|waw|Wāw|w|w,long-u|/w/ or /uː/
ي|ya|Yāʾ|y|j,long-i|/j/ or /iː/`),
  },
  {
    id: "hebrew",
    label: "Hebrew",
    language: "heb",
    notes:
      "22 letters, representative Modern Hebrew values. Dagesh and shin/sin dots distinguish readings. Vowel points and five final forms do not add alphabet letters.",
    letters: letters(`א|alef|Alef|ʾ|glottal|/ʔ/ or silent
ב|bet|Bet|b|b,v|/b/ with dagesh; /v/ without
ג|gimel|Gimel|g|g|/ɡ/
ד|dalet|Dalet|d|d|/d/
ה|he|He|h|h|/h/ or silent
ו|vav|Vav|v|v,o,u|/v/, or a vowel marker
ז|zayin|Zayin|z|z|/z/
ח|het|Het|ḥ|kh|/χ/ in much Modern Hebrew
ט|tet|Tet|ṭ|t|/t/
י|yod|Yod|y|j,i|/j/, or a vowel marker
כ|kaf|Kaf|k|k,kh|/k/ with dagesh; /χ/ without
ל|lamed|Lamed|l|l|/l/
מ|mem|Mem|m|m|/m/
נ|nun|Nun|n|n|/n/
ס|samekh|Samekh|s|s|/s/
ע|ayin|Ayin|ʿ|ayn,glottal|/ʕ/ in some traditions; /ʔ/ or silent in many modern speakers
פ|pe|Pe|p|p,f|/p/ with dagesh; /f/ without
צ|tsadi|Tsadi|ts|ts|/ts/
ק|qof|Qof|q|k|/k/ in much Modern Hebrew
ר|resh|Resh|r|r|/ʁ/ or /r/, depending on speaker
ש|shin|Shin / Sin|sh|sh,s|/ʃ/ with shin dot; /s/ with sin dot
ת|tav|Tav|t|t|/t/ in Modern Hebrew`),
  },
];
// Optional historical column: values are reconstructed, unlike the modern columns.
alphabets.push({
  id: "phoenician",
  label: "Phoenician",
  language: "phn",
  notes:
    "22-letter historical abjad. Sound values are approximate reconstructions; they are not modern pronunciations.",
  letters: letters(`𐤀|aleph|Aleph|ʾ|glottal|/ʔ/ reconstructed
𐤁|bet|Bet|b|b|/b/ reconstructed
𐤂|gimel|Gimel|g|g|/ɡ/ reconstructed
𐤃|dalet|Dalet|d|d|/d/ reconstructed
𐤄|he|He|h|h|/h/ reconstructed
𐤅|waw|Waw|w|w|/w/ reconstructed
𐤆|zayin|Zayin|z|z|/z/ reconstructed
𐤇|het|Het|ḥ|pharyngeal-h|/ħ/ reconstructed
𐤈|tet|Tet|ṭ|emphatic-t|/tˤ/ reconstructed
𐤉|yod|Yod|y|j|/j/ reconstructed
𐤊|kaf|Kaf|k|k|/k/ reconstructed
𐤋|lamed|Lamed|l|l|/l/ reconstructed
𐤌|mem|Mem|m|m|/m/ reconstructed
𐤍|nun|Nun|n|n|/n/ reconstructed
𐤎|samekh|Samekh|s|s|/s/ reconstructed
𐤏|ayin|Ayin|ʿ|ayn|/ʕ/ reconstructed
𐤐|pe|Pe|p|p|/p/ reconstructed
𐤑|tsade|Tsade|ṣ|emphatic-s|/sˤ/ approximate reconstruction
𐤒|qof|Qof|q|q|/q/ reconstructed
𐤓|resh|Resh|r|r|/r/ reconstructed
𐤔|shin|Shin|sh|sh|/ʃ/ reconstructed
𐤕|taw|Taw|t|t|/t/ reconstructed`),
});
export const meaningSources: Provenance[] = [
  {
    source: "Gesenius’ Hebrew Grammar — traditional Semitic letter names",
    sourceURL: "https://biblicalhebrew.org/hebrew-consonants-forms-names.aspx",
    confidence: "medium",
    notes:
      "Traditional name explanations, not certain reconstructions of the original pictures. Disputed entries are explicitly labeled as proposed and have individual research notes.",
  },
  {
    source: "Smyth, A Greek Grammar for Colleges — letter names",
    sourceURL:
      "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0007%3Apart%3D1%3Achapter%3D1%3Asection%3D1",
    confidence: "high",
  },
];
const letterOriginSources: Record<string, Provenance> = Object.fromEntries(
  [
    ["he", "He_(letter)"],
    ["tet", "Teth"],
    ["tsadi", "Tsade"],
    ["qof", "Qoph"],
  ].map(([slug, page]) => [
    slug,
    {
      source: `Comparative letter-origin reference — ${page.replaceAll("_", " ")}`,
      sourceURL: `https://en.wikipedia.org/wiki/${page}#Origins`,
      confidence: "low" as const,
      disputed: true,
      notes:
        "Summarizes competing interpretations of the early letter and its name; no certain original meaning is established.",
    },
  ]),
);
meaningSources.push(...Object.values(letterOriginSources));
const proposedSemiticMeanings: Record<
  string,
  { text: string; note: string; reference: string }
> = {
  he: {
    text: "Window / opening",
    note: "Uncertain. Gesenius gives an opening or lattice window with question marks. Research on the early h-sign also connects it with a person expressing jubilation. A proposed name explanation is not a proven original picture.",
    reference: "he",
  },
  tet: {
    text: "Coiling / snake",
    note: "Uncertain. Traditional proposals include a winding or coiled snake, and a leather bottle. Other proposals include a spinning wheel. The association with ‘good’ (tov) also appears in Jewish interpretive tradition; it is not an established etymology.",
    reference: "tet",
  },
  tsadi: {
    text: "Fishhook",
    note: "Uncertain. Gesenius marks ‘fishhook’ as conjectural; a plant is another proposed pictorial origin. The later name Tsadik is associated with ‘righteous person’, but does not establish the original meaning of Tsadi.",
    reference: "tsadi",
  },
  tsade: {
    text: "Fishhook",
    note: "Uncertain. The traditional fishhook explanation is conjectural; a plant is another proposed origin. The original meaning of the early letter name remains unresolved.",
    reference: "tsadi",
  },
  qof: {
    text: "Eye of a needle",
    note: "Uncertain. Proposed explanations include a needle’s eye, the back of the head or nape, and an older monkey interpretation. Gesenius also records a bow proposal. The name and the original picture are not securely explained.",
    reference: "qof",
  },
};
export function letterMeaningLabel(meaning: LetterMeaning) {
  return meaning.provenance.disputed
    ? "Proposed meaning (uncertain)"
    : "Meaning";
}
const semiticMeanings: Record<string, string> = {
  aleph: "Ox",
  alef: "Ox",
  bet: "House",
  gimel: "Camel",
  dalet: "Door",
  waw: "Hook / nail",
  vav: "Hook / nail",
  zayin: "Weapon",
  het: "Fence / barrier",
  yod: "Hand",
  kaf: "Palm / bent hand",
  lamed: "Ox goad",
  mem: "Water",
  nun: "Fish",
  samekh: "Support / prop",
  ayin: "Eye",
  pe: "Mouth",
  resh: "Head",
  shin: "Tooth",
  taw: "Mark / sign",
  tav: "Mark / sign",
};
const greekMeanings: Record<string, string> = {
  epsilon: "Simple e",
  upsilon: "Simple u",
  omicron: "Small o",
  omega: "Large o",
};
for (const alphabet of alphabets) {
  for (const letter of alphabet.letters) {
    const semitic = ["hebrew", "phoenician"].includes(alphabet.id);
    const text = semitic
      ? semiticMeanings[letter.slug]
      : alphabet.id === "greek"
        ? greekMeanings[letter.slug]
        : undefined;
    const proposed = semitic ? proposedSemiticMeanings[letter.slug] : undefined;
    if (proposed)
      letter.meaning = {
        text: proposed.text,
        note: proposed.note,
        provenance: {
          ...meaningSources[0],
          confidence: "low",
          disputed: true,
          notes: proposed.note,
        },
        references: [letterOriginSources[proposed.reference]],
      };
    else if (text)
      letter.meaning = {
        text,
        note: semitic
          ? "Traditional Semitic letter-name meaning; the letter represents a sound. Original pictorial interpretations can be disputed."
          : "Literal description in the Greek letter name, used to distinguish letters.",
        provenance: meaningSources[semitic ? 0 : 1],
      };
  }
}
export function alphabetGraphemes(): Grapheme[] {
  return alphabets.flatMap((a) =>
    a.letters.map((l, i) => ({
      id: `${a.id}-${l.slug}`,
      type: "grapheme" as const,
      name: l.name,
      symbol: l.symbol,
      scriptId: a.id,
      order: i + 1,
      transliteration: l.roman,
      meaning: l.meaning,
      sounds: [
        {
          ipa: l.ipa,
          language: a.language,
          context: a.notes,
          speechText: l.symbol,
        },
      ],
      forms: ["latin", "greek", "cyrillic"].includes(a.id)
        ? { uppercase: l.symbol, lowercase: l.symbol.toLowerCase() }
        : { isolated: l.symbol },
      provenance:
        a.id === "phoenician"
          ? [
              {
                source: "Unicode — Phoenician",
                sourceURL: "https://www.unicode.org/charts/PDF/U10900.pdf",
                confidence: "medium",
                notes: a.notes,
              },
            ]
          : [alphabetSource],
    })),
  );
}
export const soundLabels: Record<string, string> = {
  a: "a · /a/",
  b: "b · /b/",
  v: "v · /v/",
  g: "g · /ɡ/",
  d: "d · /d/",
  e: "e · /e/",
  f: "f · /f/",
  h: "h · /h/",
  i: "i · /i/",
  j: "y / j · /j/",
  k: "k · /k/",
  l: "l · /l/",
  m: "m · /m/",
  n: "n · /n/",
  o: "o · /o/",
  p: "p · /p/",
  q: "q · /q/",
  r: "r · rhotics",
  s: "s · /s/",
  t: "t · /t/",
  u: "u · /u/",
  w: "w · /w/",
  y: "ü · /y/",
  z: "z · /z/",
  zh: "zh · /ʐ/",
  sh: "sh · /ʃ ~ ʂ/",
  shch: "shch · /ɕː/",
  ch: "ch · /tɕ/",
  ts: "ts · /ts/",
  th: "th · /θ/",
  dh: "dh · /ð/",
  gh: "gh · /ɣ ~ ʁ/",
  kh: "kh · /x ~ χ/",
  ks: "ks · /ks/",
  ps: "ps · /ps/",
  dzh: "j · /dʒ/",
  ye: "ye · /je/",
  yo: "yo · /jo/",
  yu: "yu · /ju/",
  ya: "ya · /ja/",
  "barred-i": "y · /ɨ/",
  "long-a": "ā · /aː/",
  "long-i": "ī · /iː/",
  "long-u": "ū · /uː/",
  "pharyngeal-h": "ḥ · /ħ/",
  ayn: "ʿ · /ʕ/",
  glottal: "ʾ · /ʔ/",
  "emphatic-s": "ṣ · /sˤ/",
  "emphatic-d": "ḍ · /dˤ/",
  "emphatic-t": "ṭ · /tˤ/",
  "emphatic-dh": "ẓ · /ðˤ/",
  none: "No standalone sound",
};
export interface ComparisonSort {
  alphabetId: string;
  direction: "asc" | "desc";
}
export function comparisonRows(
  selected: string[],
  mode: ComparisonMode,
  sort?: ComparisonSort,
) {
  const columns = alphabets.filter((a) => selected.includes(a.id));
  const keys = new Set(
    columns.flatMap((a) =>
      a.letters.flatMap((l) =>
        mode === "roman" ? [l.roman] : l.sounds.length ? l.sounds : ["none"],
      ),
    ),
  );
  const valueRows = [...keys]
    .sort((a, b) =>
      mode === "sound"
        ? Object.keys(soundLabels).indexOf(a) -
          Object.keys(soundLabels).indexOf(b)
        : a.localeCompare(b, "en"),
    )
    .map((key) => ({
      key,
      label: mode === "sound" ? soundLabels[key] || key : key,
      cells: columns.map((a) => ({
        alphabet: a,
        letters: a.letters.filter((l) =>
          mode === "roman"
            ? l.roman === key
            : (l.sounds.length ? l.sounds : ["none"]).includes(key),
        ),
      })),
    }));
  const historicalRows = historicalFamilies
    .map((family) => ({
      key: family.key,
      label: family.label,
      note: family.note,
      cells: columns.map((alphabet) => ({
        alphabet,
        letters: alphabet.letters.filter((letter) =>
          family.members[alphabet.id]?.includes(letter.slug),
        ),
      })),
    }))
    .filter((row) => row.cells.some((cell) => cell.letters.length));
  const unassignedRows = columns.flatMap((alphabet) =>
    alphabet.letters
      .filter(
        (letter) =>
          !historicalFamilies.some((family) =>
            family.members[alphabet.id]?.includes(letter.slug),
          ),
      )
      .map((letter) => ({
        key: `unassigned-${alphabet.id}-${letter.slug}`,
        label: `${alphabet.label} · ${letter.name}`,
        note: "No historical correspondence assigned in this reference.",
        cells: columns.map((column) => ({
          alphabet: column,
          letters: column.id === alphabet.id ? [letter] : [],
        })),
      })),
  );
  const rows =
    mode === "historical"
      ? [...historicalRows, ...unassignedRows]
      : valueRows.map((row) => ({
          ...row,
          note: undefined as string | undefined,
        }));
  const alphabet = columns.find((a) => a.id === sort?.alphabetId);
  if (!alphabet || !sort) return rows;
  const column = columns.indexOf(alphabet);
  const rank = (row: (typeof rows)[number]) =>
    Math.min(
      ...row.cells[column].letters.map((letter) =>
        alphabet.letters.indexOf(letter),
      ),
    );
  return rows.sort((a, b) => {
    const aRank = rank(a),
      bRank = rank(b);
    // Missing cells stay last in both directions; ties keep correspondence order.
    if (!Number.isFinite(aRank)) return Number.isFinite(bRank) ? 1 : 0;
    if (!Number.isFinite(bRank)) return -1;
    return (aRank - bRank) * (sort.direction === "asc" ? 1 : -1);
  });
}
