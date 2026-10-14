# Worldling

[Live on GitHub Pages](https://chiesennegs.github.io/worldling/) · [Public source repository](https://github.com/chiesennegs/worldling)


A local-first, interconnected atlas of places, languages, writing systems, and letters. React + TypeScript + Vite; no backend or account. Bundled map geometry, local progress, global graph search, and an installable offline production build.

## Run

```sh
npm install
npm run dev
npm test
npm run build
npm run test:pwa
npm run preview
```

Development: http://127.0.0.1:5173. Production preview: http://127.0.0.1:4173. Service workers need HTTPS or localhost. Offline installation is available in the production build, not the Vite development server. Open production once online and allow the service worker to finish caching before disconnecting. All local assets are precached, including geometry and licenses; no external fonts or runtime APIs are required. Audio depends on an installed system voice. Browser support for SVG manifest icons and install prompts varies.

## Architecture

- `src/data/schema.ts`: extensible entity, writing-system, script, grapheme/form, contextual word, relationship, pronunciation, provenance, quiz, and progress contracts.
- `src/data/knowledge.ts`: representative curated writing collection, country-derived entities, and typed edges. Language → writing system → script → grapheme → optional forms remains distinct; graph edges also cross-link country/language/script. Forms are optional, not universal. All supported writing-system categories include `mixed` even where no curated mixed-system example is present.
- `src/data/countries.json`: bundled country metadata, separate from UI.
- `src/data/graph.ts`: graph lookup/traversal, search, relation-driven quiz generation, and immutable local progress updates. Quizzes are configured as prompt type + relation + optional reverse direction. Alternate capitals are valid graph answers; a question displays one of them and excludes same-country alternatives from distractors.
- `src/audio.ts`: pluggable browser speech and recorded-asset provider interfaces, with language/dialect metadata and optional playback rates. The default uses installed local voices.
- `src/Map.tsx`: accessible SVG atlas using d3-geo’s Natural Earth projection. Country paths are keyboard-operable; directory provides small-island access. Zoom/pan/reset and region filters are local.
- `src/App.tsx`: application shell, navigation, search, and local user state. `src/screens/` contains individual routed screens; `src/components/ui.tsx` shares display components. Hash routing supports static hosting without rewrite rules.
- `scripts/service-worker.mjs`: production build generates a content-versioned precache for every output asset. Activation removes only older Worldling caches. Deploy the whole `dist/` directory atomically.

### Screens

`#/` atlas home; `#/world` map/country/flag directory; `#/country/:ISO3`; `#/language/:id`; `#/writing`; `#/script/:id`; `#/letter/:id`; `#/genealogy`; `#/word`; `#/learn`; `#/quiz/:id`; `#/progress`; `#/saved`.

### Included vertical slice

250 country/territory records, 177 map features, curated scripts spanning alphabet/abjad/abugida/syllabary/logographic categories, historical script and letter chains, optional contextual forms, Arabic سلام decomposition, eleven relation-driven quiz types, saved discoveries, and local mastery/accuracy/answer streaks. Search includes entity types and related countries for language queries. Ancestry, phonetic similarity, and visual similarity are distinct edges and labels.

Progress and bookmarks use namespaced localStorage keys; it is adequate for this small MVP and is an equivalent local persistence layer, rather than IndexedDB. Storage failure gives an explicit session-only notice. `Progress.topics` reserves `due` for a future spaced-repetition scheduler; no scheduling is claimed yet. Progress belongs to this browser/origin, not across devices.

## Data sources and licensing

- **Natural Earth 1:110m Admin 0 countries**: public domain. [Terms](https://www.naturalearthdata.com/about/terms-of-use/). Downloaded from [official repository](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson); reduced properties only, coordinates retained. Natural Earth includes disputed/de facto boundaries. This is a cartographic snapshot, not a political statement. Some tiny states have no 110m polygon; they remain in the directory, and map quizzes exclude them. Flags use Unicode regional indicator emoji, whose appearance depends on the operating system.
- **mledoze/countries**: [repository](https://github.com/mledoze/countries), **Open Database License 1.0 (ODbL)**. The bundled reduced metadata is an adapted database under ODbL; license is included in `public/data/COUNTRIES-LICENSE` and copied to the production output. Preserve attribution, license, and ODbL database share-alike obligations when redistributing. This does not impose ODbL on application code. Fields reflect the upstream snapshot; capital/status/language changes require a data refresh. `independent` count follows the source and is not a universal definition of sovereign states.
- Historical broad ancestry: [Britannica’s Alphabet overview (1911, public-domain text)](https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Alphabet). Modern references: [Unicode Standard](https://www.unicode.org/standard/standard.html) for script/character distinctions, [Phoenician chart](https://www.unicode.org/charts/PDF/U10900.pdf), [Arabic chart](https://www.unicode.org/charts/PDF/U0600.pdf). Charts are referenced, not redistributed. Dataset descriptions are original summaries. Historical dates are approximate; early alphabetic origins carry medium confidence and an uncertainty note. Proto-Sinaitic is an uncertain early tradition, not a standardized glyph repertoire: the script card explicitly labels its displayed symbol as a later Phoenician descendant.
- Arabic word: [Wiktionary سلام](https://en.wiktionary.org/wiki/سلام#Arabic), used as a reference for the short lexical facts “peace,” salām, and pronunciation, not copied prose.
- All 50 U.S. states include capital entities, country/subdivision/capital graph links, searchable detail pages, a filtered and sortable directory, and two state-capital quizzes. D.C. and territories are excluded from the 50-state collection. Other countries still have only representative subdivision names; subdivision geometry is deferred.

Retrieved 2026-10-07. `scripts/prepare-data.mjs` documents the transform from upstream files placed at `/tmp/worldling-world.geojson` and `/tmp/worldling-countries.json`. The app itself never fetches upstream services.

## Validation

`npm test` checks unique entity IDs, edge referential integrity, sourced acyclic ancestry, Arabic’s Nabataean intermediate, semantic separation of relation types, valid distinct quiz options, immutable progress and streak reset, country coverage, and connected search. `npm run build` runs strict TypeScript, Vite production compilation, and precache generation.

## Extending and deferred work

Add data and relationships to `knowledge.ts`, not page conditionals. Add relation-driven quiz definitions to `quizzes`. New contextual words provide a script/language ID plus grapheme segments, contextual renderings, isolated forms, and pronunciations. The word UI consumes segment data generically; current editorial explanation is specific to its Arabic sample. True font-level glyph segmentation of ligatures is deferred: Unicode shaping is preserved in the joined view, with colored grapheme spans; separated contextual forms use teaching extension strokes, not extracted glyph outlines.

Defer: exhaustive language/script coverage, complete script genealogy, subdivisions beyond the 50 U.S. states and subdivision geometry, curated recorded audio assets/providers, synchronized audio highlighting, slow per-letter highlighting, handwriting/tracing recognition, animated glyph morphing, downloadable handwriting/historical facsimiles, word assembly games, full transliteration standards, and spaced repetition. Ancient pronunciations are representative reconstructions; modern letters may have many values. System audio is offered only when a matching installed language voice exists, never as authoritative historical pronunciation.

The web UI is responsive, uses semantic buttons/inputs, keyboard focus outlines, reduced-motion support, and visible relation labels. A future audit should review screen-reader map navigation at scale, professional linguistic sources for every expanded dataset, production offline behavior across target browsers, and broader mobile touch gestures.

Offline cache behavior is also tested with `npm run test:pwa` after a production build. This simulates service-worker installation, offline app and geometry responses, fallback navigation, and cleanup of Worldling caches without deleting other caches. It does not replace device/browser installation testing.

Additional historical reference: [The Metropolitan Museum of Art, Alphabet Origins](https://www.metmuseum.org/exhibitions/listings/2014/assyria-to-iberia/blog/posts/alphabet), documenting the early Sinai connection and Phoenician → Greek → Etruscan → Roman transmission.

## Added exploration features (2026-10-08)

- `#/compare`: selectable script columns, defaulting to Latin, Greek, Cyrillic, Arabic, and Hebrew; Phoenician is optional. Sound mode groups broad representative values, including explicitly marked approximate matches. Romanization mode aligns simplified educational romanizations exactly. Neither mode asserts ancestry or universal equivalence. Missing single-letter matches stay empty; contextual readings can place one letter in several sound rows. The table scrolls independently with fixed headers and a fixed row-label column. Glyphs open the same grapheme details used elsewhere.
- `src/data/alphabets.ts` supplies complete basic Latin (26), modern Greek (24), modern Russian Cyrillic (33), basic Arabic (28), Hebrew (22), and Phoenician (22) letter collections. Cyrillic is a script, not one universal alphabet: the current repertoire is explicitly Russian; other language variants remain future additions. Existing grapheme IDs and contextual forms are preserved. Latin sound comparison uses conventional Latin values plus explicitly described later letter values; it is not an English pronunciation chart. Simplified romanization is not a complete word transliteration algorithm.
- Cyrillic appears in the writing collection, script genealogy, language/country links, search, and letter/quiz pools. Its Greek ancestry is sourced to [Unicode chapter 7](https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-7/). Romanization references are the Library of Congress [Russian](https://www.loc.gov/catdir/cpso/romanization/russian.pdf), [Greek](https://www.loc.gov/catdir/cpso/romanization/greek.pdf), [Arabic](https://www.loc.gov/catdir/cpso/romanization/arabic.pdf), and [Hebrew](https://www.loc.gov/catdir/cpso/romanization/hebrew.pdf) tables; the educational labels intentionally simplify several ALA-LC diacritics and contextual rules. Broad sound values are teaching summaries, not a claim that these romanization tables specify IPA. [Cornell Russian alphabet materials](https://russian.cornell.edu/russian.web/courses/305/RussianAlphabet_page4.pdf) and the [Hebrew letter reference](https://www.internationalphoneticalphabet.org/hebrew-alphabet/) provide additional pronunciation context (the latter is not affiliated with the International Phonetic Association).
- `#/states` is available through World & places → States. `src/data/us-states.ts` holds state records and their capital links; the United States country page embeds the same directory. `#/place/:id` handles subdivision and capital details with parent links. State-capital quiz definitions use the generic engine. Reverse-capital quizzes now declare an answer type so country and state pools stay separate.
- State/capital facts were cross-checked against [U.S. Department of State, State Capitals (archived mirror)](https://countrystudies.us/united-states/geography-24.htm), public-domain U.S. government facts. The dataset is an original structured transcription; state abbreviations use standard USPS codes. State capital names are not necessarily the largest cities.
- All six map markers now have country-name hover/focus text, accessible labels, native titles, and keyboard activation. Polygon hover/focus uses the same country-name readout; drag suppression prevents a pan ending on a marker from opening a country.

Validation covers comparison letter counts and references, Cyrillic ancestry, sound/shape separation, sign-only rows, empty selections, all 50 state-capital graph links, unique codes/capital IDs, search inclusion, and country/state quiz isolation. Browser QA exercised script selection, romanization mode, Cyrillic letter detail, Japan marker hover, state filtering, California → Sacramento navigation, and state-capital quiz generation. Desktop and mobile layouts were inspected.

### Alphabet sorting and letter-name meanings (2026-10-09)

Compare Alphabets now supports ascending and descending native letter order for every selected alphabet, using its column’s “Sort letters” control or the Sort by menu. Correspondence rows stay intact; a row with several letters uses the earliest letter in that alphabet, ties retain correspondence order, and missing cells stay last in both directions. Choose “Correspondence order” to restore the default. Removing the sorted alphabet restores that order as well.

Documented letter-name meanings appear beside glyphs in Compare Alphabets, script letter grids, and letter details. Writing Systems also includes examples linking to letter details. These are meanings of names, not semantic meanings conveyed by alphabetic letters. Traditional Hebrew/Phoenician explanations are sourced to [Gesenius’ Hebrew Grammar](https://biblicalhebrew.org/hebrew-consonants-forms-names.aspx); four descriptive Greek names are sourced to [Smyth’s Greek Grammar](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0007%3Apart%3D1%3Achapter%3D1%3Asection%3D1). Disputed names carry proposed labels and source notes, and meanings are not automatically copied to descendant letters (Latin A is not labeled “ox”).

### Historical correspondence default (2026-10-09)

Compare Alphabets opens in Historical correspondence mode. Curated families follow Phoenician order, followed by Greek additions and individually labeled unassigned letters. The Aleph row aligns Latin A, Greek Alpha, Cyrillic A, Arabic Alif, Hebrew Alef, and optional Phoenician Aleph. Later modifications can share a cell (Latin C/G, I/J, or U/V/W); some families branch or involve more than one precursor, which row notes explain. This chart does not add direct ancestry edges to the graph or imply borrowing between every pair of cells. All letters appear once; unassigned letters remain separate rather than being matched by sound or shape. Sound and romanization modes remain available, and alphabet sorting works in all three modes. Sources: the comparative chart in [History of the alphabet](https://en.wikipedia.org/wiki/History_of_the_alphabet#Letter_names_and_order) and [Unicode’s Greek/Cyrillic chapter](https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-7/).

### Hebrew meaning research (2026-10-11)

All 22 Hebrew letters now have a letter-name explanation. He, Tet, Tsadi and Qof were previously blank because their etymologies are disputed. Their short labels now read “Proposed meaning (uncertain)”: window/opening, coiling/snake, fishhook and eye of a needle respectively. Letter details distinguish traditional proposals from alternative early pictorial interpretations and later religious/name associations, and include individual source links. Corresponding Phoenician entries receive the same qualified explanations. This does not change historical alignment or imply that the letters convey these meanings when used to spell words.

Research combines the traditional explanations and explicit doubts in [Gesenius’ Hebrew Grammar](https://biblicalhebrew.org/hebrew-consonants-forms-names.aspx) with comparative references for [He](<https://en.wikipedia.org/wiki/He_(letter)#Origins>), [Tet](https://en.wikipedia.org/wiki/Teth#Origins), [Tsadi](https://en.wikipedia.org/wiki/Tsade#Origins), and [Qof](https://en.wikipedia.org/wiki/Qoph#Origins). The short labels are selected traditional proposals, not claims of scholarly consensus. Notes preserve alternatives: jubilation for early He; bottle/spinning-wheel interpretations and the later “good” association for Tet; a plant origin and the later Tsadik name for Tsadi; nape, monkey and bow explanations for Qof.

### Atlas labels (2026-10-11)

Removed the permanent Lebanon callout rectangle while retaining its interactive country marker. Ocean names now use projected geographic anchors inside the same SVG transform as the countries, so they move and scale during zoom and pan. Country names appear from 2× zoom; they remain a readable size while their anchors follow the map. Labels use the largest projected landmass for multipart countries, omit tiny areas and offscreen names, prioritize larger countries when names overlap, and respect the region filter. Label text does not intercept country clicks or hover. Country names remain hidden during map quizzes. The low-resolution map still cannot show every small island or territory.

## Atlas labels, country profiles, and curation tracking

The Atlas has no featured-country circle markers. Labels start at 2× zoom; at 4× and above, collision-tested displaced labels use short leader lines. Zoom extends to 16×. Countries and territories omitted from the coarse Natural Earth geometry receive clickable geographic label anchors, not fabricated boundaries. Pan/zoom and region filtering apply to all labels.

Country pages include dated population and religious-affiliation figures, government descriptions, establishment/independence milestones, and Wikipedia links. Fields are imported from the public-domain CIA World Factbook mirror at [factbook/factbook.json](https://github.com/factbook/factbook.json), retrieved 2026-10-11. This is an archived reference, not current live data. Preserve source estimate years and notes; absent fields show “Not yet curated.” Reimport with `python3 scripts/import-demographics.py /path/to/extracted/factbook.json-master`.

Use [CURATION_BACKLOG.md](CURATION_BACKLOG.md) for known editorial and deferred-feature work, and [CURATION_COVERAGE.md](CURATION_COVERAGE.md) for specific missing records. Regenerate the latter with `npm run curation:report` after data changes. Automatic coverage detects missing fields/connections, not factual completeness; representative collections and imported profiles still require review.

## Print and handwritten letter forms

A shared Both / Print / Handwritten selector defaults to Both, persists locally, and applies to letter grids, comparisons, details and contextual forms, related/search/saved links, script samples, genealogy, quizzes, and every word-lab stage. The same grapheme IDs, Unicode text, sounds, sort order, and historical correspondences are retained.

Bundled SIL Open Font License fonts provide representative forms for Latin and Russian Cyrillic (Marck Script), Greek (Mynerve), Hebrew (Gveret Levin), Arabic Ruqʿah (Aref Ruqaa), Devanagari (Kalam), Japanese hiragana (Klee One), and Chinese grass script (Liu Jian Mao Cao). Hebrew handwriting need not join; printed Arabic already joins, so its contextual forms remain distinct from handwriting style. These are font renderings, not historical facsimiles or a universal handwriting standard. Historical scripts without a curated handwritten renderer keep their existing print glyphs. Licenses and provenance are bundled in `public/fonts`; all fonts are cached offline. Font outlines are preserved in WOFF2 compression. Regenerate using `python3 scripts/fetch-handwriting-fonts.py` (requires fontTools with Brotli support).

## GitHub Pages deployment

The public repository is `chiesennegs/worldling`. Pushes to `main` run `.github/workflows/pages.yml`: install locked dependencies, run data tests, build for `/worldling/`, test offline behavior under that path, and deploy `dist` to GitHub Pages. The workflow can also be run manually. Deployment actions are pinned to verified commits. Build artifacts and local QA screenshots are excluded from Git.

Local development keeps `/` as its base path. To reproduce the Pages build:

```sh
WORLDLING_BASE_PATH=/worldling/ npm run build
WORLDLING_BASE_PATH=/worldling/ npm run test:pwa
npm run preview
```

Open the preview at `/worldling/`. The manifest, map, fonts, and service worker all resolve inside that deployment path. Cache cleanup is scoped to this project so other Pages apps on the same origin retain their caches. Routes use URL fragments, so country and letter links do not require server rewrites. Fonts, map data, and other bundled third-party content retain their included licenses and provenance.
