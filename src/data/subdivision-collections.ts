import { usStates, stateSource, type Subdivision } from "./us-states";
import {
  canadaSubdivisions,
  japanSubdivisions,
  brazilSubdivisions,
  canadaSources,
  japanSources,
  brazilSources,
} from "./international-subdivisions";
import type { Provenance } from "./schema";

export interface SubdivisionCollection {
  countryCode: string;
  countryName: string;
  divisionLabel: string;
  divisionPlural: string;
  description: string;
  capitalColumnLabel?: string;
  entries: Subdivision[];
  sources: Provenance[];
  practiceQuizId?: string;
}

/** Add a country's complete collection here to expose it throughout Places.
 * Mixed collections can use "Province / territory" and per-entry kind values.
 * Existing subdivision IDs must remain stable to preserve saved places.
 */
export const subdivisionCollections: SubdivisionCollection[] = [
  {
    countryCode: "USA",
    countryName: "United States",
    divisionLabel: "State",
    divisionPlural: "states",
    description:
      "All 50 states and their capitals. Washington, D.C. is the federal district and is not included among the states. U.S. territories are also excluded.",
    entries: usStates,
    sources: [stateSource],
    practiceQuizId: "state-capitals",
  },
  {
    countryCode: "CAN",
    countryName: "Canada",
    divisionLabel: "Province / territory",
    divisionPlural: "provinces and territories",
    description:
      "All 10 provinces and 3 territories, with their capitals. Provinces and territories are distinct forms of first-level government; the Type column preserves that distinction.",
    entries: canadaSubdivisions,
    sources: canadaSources,
    practiceQuizId: "canada-subdivision-capitals",
  },
  {
    countryCode: "JPN",
    countryName: "Japan",
    divisionLabel: "Prefecture",
    divisionPlural: "prefectures",
    capitalColumnLabel: "Capital / government seat",
    description:
      "All 47 prefectures, with their capitals or government seats. Local types are retained: Tokyo (to), Hokkaido (do), Osaka and Kyoto (fu), and the 43 ken. Tokyo's metropolitan government is in Shinjuku, a special ward.",
    entries: japanSubdivisions,
    sources: japanSources,
    practiceQuizId: "japan-subdivision-capitals",
  },
  {
    countryCode: "BRA",
    countryName: "Brazil",
    divisionLabel: "State / federal district",
    divisionPlural: "states and federal district",
    capitalColumnLabel: "Capital / government seat",
    description:
      "All 26 states and the Federal District, with their capitals or government seats. Distrito Federal is a separate federative unit, not a state; Brasília is its government seat and Brazil's national capital. Portuguese names retain their accents.",
    entries: brazilSubdivisions,
    sources: brazilSources,
    practiceQuizId: "brazil-subdivision-capitals",
  },
];
export const subdivisionCollectionByCountry = new Map(
  subdivisionCollections.map((collection) => [
    collection.countryCode,
    collection,
  ]),
);
export function collectionForPlace(id: string) {
  const collection = subdivisionCollections.find((c) =>
    c.entries.some((s) => s.id === id || s.capitalId === id),
  );
  return {
    collection,
    subdivision: collection?.entries.find(
      (s) => s.id === id || s.capitalId === id,
    ),
  };
}
