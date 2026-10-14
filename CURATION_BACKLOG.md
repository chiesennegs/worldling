# Worldling curation backlog

Keep this editorial backlog alongside the generated [record inventory](CURATION_COVERAGE.md). Run `npm run curation:report` after changing data. Add new incomplete features here when introducing them; close an item only after sources, content, and its UI have been reviewed. This tracks known gaps; it cannot automatically discover missing facts in the real world.

## Content work

- [ ] Review every imported country demographic profile and Wikipedia article title. Preserve estimate/survey dates and population scope; replace outdated government descriptions with current sourced records. The Factbook archive is public domain, frozen, and does not supply live information.
- [ ] Fill missing demographic fields listed in the inventory. Do not combine West Bank and Gaza estimates into Palestine without a source using the same population definition. Dependencies and old states may lack a single establishment year; retain multiple milestones and applicability notes.
- [ ] Expand language → writing-system → script coverage. The inventory lists missing language and country connections. The country language index is not an exhaustive census of community languages.
- [ ] Complete script repertoires, genealogy, and intermediate/obsolete letters. Existing collections remain representative even when a script has some graphemes; comparative alphabets describe specific basic or modern alphabets.
- [ ] Research the ten unassigned historical correspondences. Review disputed Hebrew and Phoenician letter-name interpretations; absent meanings can be inapplicable and must not be invented.
- [ ] Expand dialect-specific, context-specific pronunciation and full transliteration standards. Existing romanization and IPA are educational approximations.
- [ ] Source recorded normal/slow pronunciation and expand handwriting/historical traditions beyond the bundled representative fonts. Eight modern scripts now have offline handwritten font renderings; historical forms and facsimiles remain pending. System speech is a fallback; no professional audio collection has been curated.
- [ ] Expand the single Arabic word example to sourced words in other writing systems, with segmentation and contextual-form explanations.
- [x] Add complete sourced first-level directories and capitals/government seats for Canada (10 provinces + 3 territories), Japan (47 prefectures), and Brazil (26 states + Federal District). Preserve local terminology and distinguish exceptional government seats.
- [ ] Replace the remaining representative subdivision lists with complete sourced records. U.S. coverage is the 50 states and capitals; D.C. and territories, other countries, subdivision demographics, and subdivision geometry remain unimplemented. Register complete collections with stable IDs and country-scoped quizzes.
- [ ] Review country metadata, capital status, boundaries, flags, and disputed/de facto geography. Coarse polygons omit small places; geographic label anchors do not provide their boundaries. Obtain higher-resolution geometry and verify anchors, including distant dependencies.

## Deferred interactions and assets

- [ ] Synchronized audio highlighting and slow letter-by-letter playback.
- [ ] Handwriting/tracing recognition, glyph morphing, downloadable historical facsimiles.
- [ ] Word assembly games and spaced repetition.
- [ ] True ligature-aware glyph segmentation; current joined text preserves shaping and separated teaching forms are not extracted glyph outlines.

## Maintenance

- [ ] Define update cadence, field-level verification dates, and editorial ownership for factual data.
- [ ] Review coverage and provenance whenever extending the graph; maintain distinct ancestry, sound, and shape relations.
