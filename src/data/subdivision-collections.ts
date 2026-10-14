import { usStates, stateSource, type Subdivision } from "./us-states";
import type { Provenance } from "./schema";

export interface SubdivisionCollection {
  countryCode: string;
  countryName: string;
  divisionLabel: string;
  divisionPlural: string;
  description: string;
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
