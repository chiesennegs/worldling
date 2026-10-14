import type { Provenance } from "./schema";
import type { Subdivision } from "./subdivision-types";
export type { Subdivision } from "./subdivision-types";
export const stateSource: Provenance = {
  source: "U.S. Department of State — State Capitals (archived mirror)",
  sourceURL: "https://countrystudies.us/united-states/geography-24.htm",
  confidence: "high",
  notes:
    "50 states. Washington, D.C. is the federal district, not a state. Territories are not included in this state collection.",
};
const rows = `AL|Alabama|Montgomery
AK|Alaska|Juneau
AZ|Arizona|Phoenix
AR|Arkansas|Little Rock
CA|California|Sacramento
CO|Colorado|Denver
CT|Connecticut|Hartford
DE|Delaware|Dover
FL|Florida|Tallahassee
GA|Georgia|Atlanta
HI|Hawaii|Honolulu
ID|Idaho|Boise
IL|Illinois|Springfield
IN|Indiana|Indianapolis
IA|Iowa|Des Moines
KS|Kansas|Topeka
KY|Kentucky|Frankfort
LA|Louisiana|Baton Rouge
ME|Maine|Augusta
MD|Maryland|Annapolis
MA|Massachusetts|Boston
MI|Michigan|Lansing
MN|Minnesota|Saint Paul
MS|Mississippi|Jackson
MO|Missouri|Jefferson City
MT|Montana|Helena
NE|Nebraska|Lincoln
NV|Nevada|Carson City
NH|New Hampshire|Concord
NJ|New Jersey|Trenton
NM|New Mexico|Santa Fe
NY|New York|Albany
NC|North Carolina|Raleigh
ND|North Dakota|Bismarck
OH|Ohio|Columbus
OK|Oklahoma|Oklahoma City
OR|Oregon|Salem
PA|Pennsylvania|Harrisburg
RI|Rhode Island|Providence
SC|South Carolina|Columbia
SD|South Dakota|Pierre
TN|Tennessee|Nashville
TX|Texas|Austin
UT|Utah|Salt Lake City
VT|Vermont|Montpelier
VA|Virginia|Richmond
WA|Washington|Olympia
WV|West Virginia|Charleston
WI|Wisconsin|Madison
WY|Wyoming|Cheyenne`;
export const usStates: Subdivision[] = rows.split("\n").map((row) => {
  const [code, name, capital] = row.split("|");
  return {
    id: `subdivision-USA-${name}`,
    type: "subdivision",
    countryCode: "USA",
    kind: "state",
    code: `US-${code}`,
    name,
    capital,
    capitalId: `capital-US-${code}`,
    provenance: [stateSource],
  };
});
