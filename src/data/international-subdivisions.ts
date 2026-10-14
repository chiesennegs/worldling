import type { Subdivision } from "./subdivision-types";
import type { Provenance } from "./schema";

export const canadaSources: Provenance[] = [
  {
    source: "Government of Canada — Discover Canada: Canada's Regions",
    sourceURL:
      "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/discover-canada/read-online/canadas-regions.html",
    confidence: "high",
    notes:
      "Province/territory and capital table. Only subdivision facts are transcribed; demographic estimates in the guide are not imported.",
  },
  {
    source: "Canada Revenue Agency — Provincial and territorial codes",
    sourceURL:
      "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/completing-slips-summaries/financial-slips-summaries/return-securities-transactions-t5008/provincial-territorial-codes.html",
    confidence: "high",
    notes: "Two-letter postal symbols; displayed with the CA- country prefix.",
  },
];
export const japanSources: Provenance[] = [
  {
    source: "Statistics Bureau of Japan — Administrative Map of Japan (2026)",
    sourceURL: "https://www.stat.go.jp/english/data/handbook/pdf/shjmap_a.pdf",
    confidence: "high",
    notes:
      "47 prefectures and their government-seat cities. English spellings omit macrons, following the bureau's map. JP-01–JP-47 use the national prefecture order.",
  },
  {
    source: "Tokyo Metropolitan Government — Government Buildings",
    sourceURL: "https://www.english.metro.tokyo.lg.jp/w/000-101-000543",
    confidence: "high",
    notes:
      "The metropolitan government is located in Shinjuku, a special ward of Tokyo; it is shown as a government seat, not a separate prefectural capital city.",
  },
  {
    source:
      "Cabinet Secretariat of Japan — Local Taxes: Local Government Structure",
    sourceURL: "https://www.cas.go.jp/jp/seisaku/hourei/data/jt.pdf",
    confidence: "high",
    notes:
      "Prefectural types: Tokyo-to, Hokkaido-do, Osaka-fu, Kyoto-fu, and 43 ken. All are shown at prefectural level, with local type labels retained.",
  },
];
export const brazilSources: Provenance[] = [
  {
    source: "IBGE Educa — Divisão Territorial",
    sourceURL:
      "https://educa.ibge.gov.br/jovens/conheca-o-brasil/territorio/19637-divisao-territorial.html",
    confidence: "high",
    notes:
      "26 states, their abbreviations and capitals, plus the Federal District. Portuguese place names retain diacritics. Brasília is the federal government seat, not a state capital.",
  },
];

function records(
  countryCode: string,
  prefix: string,
  rows: string,
  provenance: Provenance[],
): Subdivision[] {
  return rows.split("\n").map((row) => {
    const [code, name, capital, kind] = row.split("|");
    return {
      id: `subdivision-${countryCode}-${name}`,
      type: "subdivision",
      countryCode,
      kind: kind as Subdivision["kind"],
      name,
      code: `${prefix}-${code}`,
      capital,
      capitalId: `capital-${prefix}-${code}`,
      provenance,
    };
  });
}

export const canadaSubdivisions = records(
  "CAN",
  "CA",
  `AB|Alberta|Edmonton|province
BC|British Columbia|Victoria|province
MB|Manitoba|Winnipeg|province
NB|New Brunswick|Fredericton|province
NL|Newfoundland and Labrador|St. John's|province
NS|Nova Scotia|Halifax|province
NT|Northwest Territories|Yellowknife|territory
NU|Nunavut|Iqaluit|territory
ON|Ontario|Toronto|province
PE|Prince Edward Island|Charlottetown|province
QC|Quebec|Québec City|province
SK|Saskatchewan|Regina|province
YT|Yukon|Whitehorse|territory`,
  canadaSources,
);

export const japanSubdivisions = records(
  "JPN",
  "JP",
  `01|Hokkaido|Sapporo|prefecture
02|Aomori|Aomori|prefecture
03|Iwate|Morioka|prefecture
04|Miyagi|Sendai|prefecture
05|Akita|Akita|prefecture
06|Yamagata|Yamagata|prefecture
07|Fukushima|Fukushima|prefecture
08|Ibaraki|Mito|prefecture
09|Tochigi|Utsunomiya|prefecture
10|Gunma|Maebashi|prefecture
11|Saitama|Saitama|prefecture
12|Chiba|Chiba|prefecture
13|Tokyo|Shinjuku|prefecture
14|Kanagawa|Yokohama|prefecture
15|Niigata|Niigata|prefecture
16|Toyama|Toyama|prefecture
17|Ishikawa|Kanazawa|prefecture
18|Fukui|Fukui|prefecture
19|Yamanashi|Kofu|prefecture
20|Nagano|Nagano|prefecture
21|Gifu|Gifu|prefecture
22|Shizuoka|Shizuoka|prefecture
23|Aichi|Nagoya|prefecture
24|Mie|Tsu|prefecture
25|Shiga|Otsu|prefecture
26|Kyoto|Kyoto|prefecture
27|Osaka|Osaka|prefecture
28|Hyogo|Kobe|prefecture
29|Nara|Nara|prefecture
30|Wakayama|Wakayama|prefecture
31|Tottori|Tottori|prefecture
32|Shimane|Matsue|prefecture
33|Okayama|Okayama|prefecture
34|Hiroshima|Hiroshima|prefecture
35|Yamaguchi|Yamaguchi|prefecture
36|Tokushima|Tokushima|prefecture
37|Kagawa|Takamatsu|prefecture
38|Ehime|Matsuyama|prefecture
39|Kochi|Kochi|prefecture
40|Fukuoka|Fukuoka|prefecture
41|Saga|Saga|prefecture
42|Nagasaki|Nagasaki|prefecture
43|Kumamoto|Kumamoto|prefecture
44|Oita|Oita|prefecture
45|Miyazaki|Miyazaki|prefecture
46|Kagoshima|Kagoshima|prefecture
47|Okinawa|Naha|prefecture`,
  japanSources,
).map((s) => ({
  ...s,
  localType:
    s.name === "Tokyo"
      ? "Metropolis (to)"
      : s.name === "Hokkaido"
        ? "Prefecture (do)"
        : ["Osaka", "Kyoto"].includes(s.name)
          ? "Urban prefecture (fu)"
          : "Prefecture (ken)",
  ...(s.name === "Tokyo"
    ? {
        capitalLabel: "Government seat",
        capitalNote:
          "Tokyo's metropolitan government is in Shinjuku, one of its 23 special wards. Shinjuku is the government seat, rather than a separate prefectural capital city.",
      }
    : {}),
}));

export const brazilSubdivisions = records(
  "BRA",
  "BR",
  `AC|Acre|Rio Branco|state
AL|Alagoas|Maceió|state
AP|Amapá|Macapá|state
AM|Amazonas|Manaus|state
BA|Bahia|Salvador|state
CE|Ceará|Fortaleza|state
DF|Distrito Federal|Brasília|federal district
ES|Espírito Santo|Vitória|state
GO|Goiás|Goiânia|state
MA|Maranhão|São Luís|state
MT|Mato Grosso|Cuiabá|state
MS|Mato Grosso do Sul|Campo Grande|state
MG|Minas Gerais|Belo Horizonte|state
PA|Pará|Belém|state
PB|Paraíba|João Pessoa|state
PR|Paraná|Curitiba|state
PE|Pernambuco|Recife|state
PI|Piauí|Teresina|state
RJ|Rio de Janeiro|Rio de Janeiro|state
RN|Rio Grande do Norte|Natal|state
RS|Rio Grande do Sul|Porto Alegre|state
RO|Rondônia|Porto Velho|state
RR|Roraima|Boa Vista|state
SC|Santa Catarina|Florianópolis|state
SP|São Paulo|São Paulo|state
SE|Sergipe|Aracaju|state
TO|Tocantins|Palmas|state`,
  brazilSources,
).map((s) => ({
  ...s,
  ...(s.kind === "federal district"
    ? {
        capitalLabel: "Government seat",
        capitalNote:
          "Brasília is Brazil's national capital and the government seat of the Federal District. The Federal District is a federative unit, not a state.",
      }
    : {}),
}));
