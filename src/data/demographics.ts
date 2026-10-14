import data from "./demographics.json";
export interface CountryProfile {
  population?: string;
  populationNote?: string;
  establishment?: string;
  government?: string;
  religion?: string;
  sourceURL?: string;
  retrieved?: string;
  wikipediaTitle: string;
}
export const demographics = data as Record<string, CountryProfile>;
export function wikipediaURL(code: string) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(demographics[code].wikipediaTitle.replaceAll(" ", "_"))}`;
}
