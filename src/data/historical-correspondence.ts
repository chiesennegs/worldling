import type { Provenance } from "./schema";

export const historicalSources: Provenance[] = [
  {
    source: "History of the alphabet — comparative script chart",
    sourceURL:
      "https://en.wikipedia.org/wiki/History_of_the_alphabet#Letter_names_and_order",
    confidence: "medium",
    notes:
      "Curated historical families, including later modifications. Shared rows do not imply direct borrowing between every displayed script. Letters with no assigned correspondence remain separate.",
  },
  {
    source: "Unicode — Greek and Cyrillic development",
    sourceURL:
      "https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-7/",
    confidence: "high",
  },
];

export interface HistoricalFamily {
  key: string;
  label: string;
  note?: string;
  members: Record<string, string[]>;
}
// Phoenician-order families, followed by Greek additions. These are curated
// correspondences rather than new direct ancestry edges in the knowledge graph.
// Modern derivatives share a family; unassigned letters get individual rows.
function family(
  key: string,
  label: string,
  latin: string,
  greek: string,
  cyrillic: string,
  arabic: string,
  hebrew: string,
  note?: string,
): HistoricalFamily {
  return {
    key,
    label,
    note,
    members: Object.fromEntries(
      Object.entries({
        latin,
        greek,
        cyrillic,
        arabic,
        hebrew,
        phoenician: key,
      }).map(([script, slugs]) => [script, slugs ? slugs.split(",") : []]),
    ),
  };
}
export const historicalFamilies: HistoricalFamily[] = [
  family(
    "aleph",
    "Aleph family",
    "a",
    "alpha",
    "a",
    "alif",
    "alef",
    "Transmission through Greek / Etruscan and Aramaic / Nabataean branches.",
  ),
  family(
    "bet",
    "Bet family",
    "b",
    "beta",
    "be,ve",
    "ba",
    "bet",
    "Cyrillic Be and Ve are differentiated forms in this family.",
  ),
  family(
    "gimel",
    "Gimel family",
    "c,g",
    "gamma",
    "ge",
    "jim",
    "gimel",
    "Latin G was developed by modifying C.",
  ),
  family("dalet", "Dalet family", "d", "delta", "de", "dal,dhal", "dalet"),
  family(
    "he",
    "He family",
    "e",
    "epsilon",
    "ye,yo,e",
    "ha",
    "he",
    "Later Cyrillic variants of E share this family.",
  ),
  family(
    "waw",
    "Waw family",
    "f,u,v,w,y",
    "upsilon",
    "u",
    "waw",
    "vav",
    "Includes digamma and upsilon branches; Cyrillic U developed from the Greek ou digraph.",
  ),
  family("zayin", "Zayin family", "z", "zeta", "ze", "zay", "zayin"),
  family(
    "het",
    "Het family",
    "h",
    "eta",
    "i,short-i",
    "ha-pharyngeal,kha",
    "het",
    "Eta retained /h/ in western Greek; Cyrillic I and its later variant descend from eta.",
  ),
  family(
    "tet",
    "Tet family",
    "",
    "theta",
    "",
    "ta-emphatic,za-emphatic",
    "tet",
  ),
  family(
    "yod",
    "Yod family",
    "i,j",
    "iota",
    "",
    "ya",
    "yod",
    "Latin J developed as a variant of I.",
  ),
  family("kaf", "Kaf family", "k", "kappa", "ka", "kaf", "kaf"),
  family("lamed", "Lamed family", "l", "lambda", "el", "lam", "lamed"),
  family("mem", "Mem family", "m", "mu", "em", "mim", "mem"),
  family("nun", "Nun family", "n", "nu", "en", "nun", "nun"),
  family("samekh", "Samekh family", "", "xi", "", "", "samekh"),
  family(
    "ayin",
    "Ayin family",
    "o",
    "omicron,omega",
    "o",
    "ayn,ghayn",
    "ayin",
    "Greek omega developed as a modification of omicron.",
  ),
  family("pe", "Pe family", "p", "pi", "pe", "fa", "pe"),
  family("tsade", "Tsade family", "", "", "", "sad,dad", "tsadi"),
  family("qof", "Qof family", "q", "", "", "qaf", "qof"),
  family("resh", "Resh family", "r", "rho", "er", "ra", "resh"),
  family("shin", "Shin family", "s", "sigma", "es", "sin,shin", "shin"),
  family("taw", "Taw family", "t", "tau", "te", "ta,tha", "tav"),
  {
    key: "greek-phi",
    label: "Greek Phi family",
    members: { greek: ["phi"], cyrillic: ["ef"] },
    note: "Greek addition; no Phoenician correspondence assigned here.",
  },
  {
    key: "greek-chi",
    label: "Greek Chi family",
    members: { latin: ["x"], greek: ["chi"], cyrillic: ["kha"] },
    note: "Western Greek chi supplied Latin X; eastern Greek chi supplied Cyrillic Kha.",
  },
  {
    key: "greek-psi",
    label: "Greek Psi",
    members: { greek: ["psi"] },
    note: "Greek addition; no cross-script correspondence assigned here.",
  },
];
