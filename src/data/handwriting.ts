export type LetterDisplayMode = "both" | "print" | "handwritten";
export const defaultLetterDisplayMode: LetterDisplayMode = "both";
export const handwritingStyles: Record<
  string,
  { family: string; label: string; note: string; sourceURL: string }
> = {
  latin: {
    family: "Marck Script",
    label: "Handwritten",
    note: "Representative Latin handwriting; individual letters may be unjoined.",
    sourceURL: "https://github.com/google/fonts/tree/main/ofl/marckscript",
  },
  cyrillic: {
    family: "Marck Script",
    label: "Cursive",
    note: "Representative Russian cursive letterforms; handwriting varies by language and writer.",
    sourceURL: "https://github.com/google/fonts/tree/main/ofl/marckscript",
  },
  greek: {
    family: "Mynerve",
    label: "Handwritten",
    note: "Representative modern Greek handwriting.",
    sourceURL: "https://github.com/google/fonts/tree/main/ofl/mynerve",
  },
  hebrew: {
    family: "Gveret Levin",
    label: "Handwritten",
    note: "Modern Hebrew handwriting; letters are generally not joined.",
    sourceURL: "https://github.com/google/fonts/tree/main/ofl/gveretlevin",
  },
  arabic: {
    family: "Aref Ruqaa",
    label: "Ruqʿah",
    note: "Ruqʿah-style rendering. Printed Arabic also joins; contextual forms and handwriting style are separate distinctions.",
    sourceURL: "https://github.com/google/fonts/tree/main/ofl/arefruqaa",
  },
  devanagari: {
    family: "Kalam",
    label: "Handwritten",
    note: "Representative pen-written Devanagari.",
    sourceURL: "https://github.com/google/fonts/tree/main/ofl/kalam",
  },
  hiragana: {
    family: "Klee One",
    label: "Handwritten",
    note: "Modern pencil/pen handwriting, not historical kuzushiji.",
    sourceURL: "https://github.com/google/fonts/tree/main/ofl/kleeone",
  },
  han: {
    family: "Liu Jian Mao Cao",
    label: "Grass script",
    note: "Chinese grass-script calligraphy; a representative cursive style rather than a stroke-order lesson.",
    sourceURL: "https://github.com/google/fonts/tree/main/ofl/liujianmaocao",
  },
};
export function letterVariants(
  scriptId: string | undefined,
  mode: LetterDisplayMode,
) {
  const handwriting = scriptId ? handwritingStyles[scriptId] : undefined;
  if (!handwriting || mode === "print") return ["print"] as const;
  return mode === "handwritten"
    ? (["handwritten"] as const)
    : (["print", "handwritten"] as const);
}
