import type { Entity } from "./schema";

/** Shared level, country-specific terminology; types do not imply equal powers. */
export interface Subdivision extends Entity {
  type: "subdivision";
  countryCode: string;
  kind: "state" | "province" | "territory" | "prefecture" | "federal district";
  localType?: string;
  code: string;
  capitalId: string;
  capital: string;
  capitalLabel?: string;
  capitalNote?: string;
}
