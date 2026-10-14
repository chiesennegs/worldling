export type EntityType =
  | "country"
  | "capital"
  | "language"
  | "writing-system"
  | "script"
  | "grapheme"
  | "name"
  | "sound"
  | "word"
  | "flag"
  | "subdivision";
export interface Provenance {
  source: string;
  sourceURL: string;
  confidence?: "high" | "medium" | "low";
  notes?: string;
  disputed?: boolean;
}
export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  description?: string;
  symbol?: string;
  provenance?: Provenance[];
}
export type SystemKind =
  "alphabet" | "abjad" | "abugida" | "syllabary" | "logographic" | "mixed";
export interface WritingSystem extends Entity {
  type: "writing-system";
  kind: SystemKind;
  scriptId: string;
  languageIds: string[];
}
export interface Script extends Entity {
  type: "script";
  kind: SystemKind;
  direction: "ltr" | "rtl";
  period: string;
  year: number;
  sample: string;
  languageIds: string[];
}
export interface Pronunciation {
  ipa: string;
  language: string;
  dialect?: string;
  context?: string;
  audio?: { normal?: string; slow?: string };
  speechText?: string;
}
export interface LetterMeaning {
  references?: Provenance[];
  text: string;
  note: string;
  provenance: Provenance;
}
export interface Grapheme extends Entity {
  type: "grapheme";
  scriptId: string;
  order: number;
  transliteration: string;
  sounds: Pronunciation[];
  forms: Partial<
    Record<
      | "uppercase"
      | "lowercase"
      | "printed"
      | "handwritten"
      | "cursive"
      | "historical"
      | "isolated"
      | "initial"
      | "medial"
      | "final",
      string
    >
  >;
  numericValue?: number;
  origin?: string;
  meaning?: LetterMeaning;
}
export type RelationType =
  | "HAS_CAPITAL"
  | "FLAG_OF"
  | "USED_BY_LANGUAGE"
  | "USES_WRITING_SYSTEM"
  | "USES_SCRIPT"
  | "SPOKEN_IN"
  | "BELONGS_TO_SCRIPT"
  | "HAS_NAME"
  | "HAS_SOUND"
  | "DERIVED_FROM"
  | "DESCENDED_FROM_GLYPH"
  | "TRANSLITERATES_TO"
  | "PHONETICALLY_SIMILAR_TO"
  | "VISUALLY_SIMILAR_TO"
  | "CONTEXTUAL_FORM_OF"
  | "HISTORICAL_FORM_OF"
  | "HAS_SUBDIVISION";
export interface Relationship {
  from: string;
  to: string;
  type: RelationType;
  provenance?: Provenance;
  notes?: string;
}
export interface Word extends Entity {
  type: "word";
  languageId: string;
  scriptId: string;
  text: string;
  translation: string;
  transliteration: string;
  pronunciation: Pronunciation;
  segments: {
    graphemeId: string;
    contextual: string;
    isolated: string;
    name: string;
    sound: string;
  }[];
}
export interface Country {
  cca2: string;
  cca3: string;
  name: string;
  capital: string[];
  region: string;
  subregion: string;
  latlng: number[];
  languages: Record<string, string>;
  borders: string[];
  flag: string;
  independent: boolean;
}
export interface QuizDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  promptType: EntityType;
  answerType?: EntityType;
  relation: RelationType;
  reverse?: boolean;
  map?: boolean;
}
export interface Progress {
  attempts: number;
  correct: number;
  streak: number;
  bestStreak: number;
  topics: Record<
    string,
    { attempts: number; correct: number; lastSeen: number; due?: number }
  >;
}
