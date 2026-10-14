import fs from "node:fs";
const countries = JSON.parse(
  fs.readFileSync("/tmp/worldling-countries.json", "utf8"),
).map((c) => ({
  cca2: c.cca2,
  cca3: c.cca3,
  name: c.name.common,
  capital: c.capital,
  region: c.region,
  subregion: c.subregion,
  latlng: c.latlng,
  languages: c.languages,
  borders: c.borders,
  flag: c.flag,
  independent: c.independent === true,
}));
fs.writeFileSync("src/data/countries.json", JSON.stringify(countries));
const world = JSON.parse(
  fs.readFileSync("/tmp/worldling-world.geojson", "utf8"),
);
for (const f of world.features) {
  const p = f.properties;
  f.properties = {
    name: p.ADMIN,
    cca3: p.ADM0_A3,
    iso: p.ISO_A3,
    region: p.CONTINENT,
  };
}
fs.writeFileSync("public/data/world.json", JSON.stringify(world));
console.log(
  `${countries.length} country/territory records; ${world.features.length} map features`,
);

fs.writeFileSync(
  "src/data/map-codes.json",
  JSON.stringify([
    ...new Set(
      world.features.flatMap((f) => [f.properties.cca3, f.properties.iso]),
    ),
  ]),
);
