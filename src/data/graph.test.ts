import { test } from "node:test";
import assert from "node:assert/strict";
import {
  entities,
  relationships,
  quizzes,
  scripts,
  countries,
} from "./knowledge";
import {
  ancestors,
  entityById,
  makeQuestion,
  quizPairs,
  recordAttempt,
  emptyProgress,
  search,
} from "./graph";
test("all entities have unique ids and every edge resolves", () => {
  assert.equal(new Set(entities.map((e) => e.id)).size, entities.length);
  for (const r of relationships) {
    assert.ok(entityById.has(r.from), r.from);
    assert.ok(entityById.has(r.to), r.to);
  }
});
test("ancestry is acyclic, sourced, and Arabic passes through Nabataean", () => {
  function visit(id: string, path = new Set<string>()) {
    assert.ok(!path.has(id), `Ancestry cycle at ${id}`);
    const next = new Set([...path, id]);
    for (const edge of relationships.filter(
      (r) =>
        r.from === id &&
        (r.type === "DERIVED_FROM" || r.type === "DESCENDED_FROM_GLYPH"),
    ))
      visit(edge.to, next);
  }
  for (const e of entities) visit(e.id);
  assert.equal(ancestors("arabic", "DERIVED_FROM")[0].id, "nabataean");
  for (const r of relationships.filter(
    (r) => r.type === "DERIVED_FROM" || r.type === "DESCENDED_FROM_GLYPH",
  ))
    assert.ok(r.provenance?.sourceURL);
});
test("visual and phonetic similarity never become ancestry", () => {
  assert.ok(
    !ancestors("greek-alpha", "DESCENDED_FROM_GLYPH").some(
      (e) => e.id === "hiragana-a",
    ),
  );
  assert.ok(
    ancestors("latin-a", "DESCENDED_FROM_GLYPH").some(
      (e) => e.id === "phoenician-aleph",
    ),
  );
});
test("every quiz has valid distinct choices and includes the correct answer", () => {
  for (const q of quizzes) {
    assert.ok(quizPairs(q).length >= 4, q.id);
    for (let n = 0; n < 20; n++) {
      const question = makeQuestion(q.id);
      assert.equal(question.options.length, 4, q.id);
      assert.equal(new Set(question.options.map((e) => e.name)).size, 4);
      assert.ok(question.options.some((e) => e.id === question.answer.id));
    }
  }
});
test("progress is immutable and streak resets on error", () => {
  const a = recordAttempt(emptyProgress, "latin-a", true);
  const b = recordAttempt(a, "latin-a", false);
  assert.equal(emptyProgress.attempts, 0);
  assert.equal(b.attempts, 2);
  assert.equal(b.correct, 1);
  assert.equal(b.streak, 0);
  assert.equal(b.bestStreak, 1);
  assert.equal(b.topics["latin-a"].attempts, 2);
});
test("countries have capitals, flags and language connections; Arabic search reaches countries", () => {
  assert.ok(countries.length >= 240);
  assert.ok(search("Arabic").some((e) => e.id === "arabic"));
  assert.ok(search("Arabic").some((e) => e.type === "country"));
  assert.ok(
    countries.find((c) => c.cca3 === "PRT")?.capital.includes("Lisbon"),
  );
});

test("Cyrillic and all comparison letters resolve to correctly ordered graphemes", async () => {
  const { alphabets } = await import("./alphabets");
  const counts = {
    latin: 26,
    greek: 24,
    cyrillic: 33,
    arabic: 28,
    hebrew: 22,
    phoenician: 22,
  };
  for (const alphabet of alphabets) {
    assert.equal(
      alphabet.letters.length,
      counts[alphabet.id as keyof typeof counts],
    );
    alphabet.letters.forEach((letter, index) => {
      const entity = entityById.get(`${alphabet.id}-${letter.slug}`);
      assert.equal(entity?.symbol, letter.symbol);
      assert.ok(
        relatedForTest(entity!.id, "BELONGS_TO_SCRIPT").some(
          (r) => r.to === alphabet.id,
        ),
      );
    });
  }
  assert.equal(ancestors("cyrillic", "DERIVED_FROM")[0].id, "greek");
  assert.ok(
    ancestors("cyrillic-ve", "DESCENDED_FROM_GLYPH").some(
      (g) => g.id === "greek-beta",
    ),
  );
});
function relatedForTest(id: string, type: string) {
  return relationships.filter((r) => r.from === id && r.type === type);
}
test("comparison separates shape from sound and preserves missing cells and signs", async () => {
  const { comparisonRows } = await import("./alphabets");
  const rows = comparisonRows(
    ["latin", "greek", "cyrillic", "arabic", "hebrew"],
    "sound",
  );
  const v = rows.find((r) => r.key === "v")!;
  assert.ok(
    v.cells
      .find((c) => c.alphabet.id === "cyrillic")!
      .letters.some((l) => l.symbol === "В"),
  );
  assert.ok(
    v.cells
      .find((c) => c.alphabet.id === "greek")!
      .letters.some((l) => l.symbol === "Β"),
  );
  assert.ok(
    !v.cells
      .find((c) => c.alphabet.id === "latin")!
      .letters.some((l) => l.symbol === "B"),
  );
  assert.equal(
    v.cells.find((c) => c.alphabet.id === "arabic")!.letters.length,
    0,
  );
  assert.equal(
    comparisonRows(["cyrillic"], "sound").find((r) => r.key === "none")!
      .cells[0].letters.length,
    2,
  );
  assert.deepEqual(comparisonRows([], "sound"), []);
  assert.equal(
    comparisonRows(["arabic"], "roman").flatMap((r) => r.cells[0].letters)
      .length,
    28,
  );
});
test("all 50 states have unique capitals, parent-country links, and scoped quizzes", async () => {
  const { usStates } = await import("./us-states");
  assert.equal(usStates.length, 50);
  assert.equal(new Set(usStates.map((s) => s.code)).size, 50);
  assert.equal(new Set(usStates.map((s) => s.capitalId)).size, 50);
  for (const state of usStates) {
    assert.ok(
      relatedForTest("country-USA", "HAS_SUBDIVISION").some(
        (r) => r.to === state.id,
      ),
    );
    assert.equal(
      relatedForTest(state.id, "HAS_CAPITAL")[0].to,
      state.capitalId,
    );
    assert.equal(entityById.get(state.capitalId)?.name, state.capital);
  }
  assert.equal(usStates.find((s) => s.code === "US-NY")?.capital, "Albany");
  assert.equal(usStates.find((s) => s.code === "US-WA")?.capital, "Olympia");
  assert.equal(usStates.find((s) => s.code === "US-CA")?.capital, "Sacramento");
  assert.ok(search("Albany").some((e) => e.type === "capital"));
  assert.ok(search("California").some((e) => e.type === "subdivision"));
  assert.equal(
    quizPairs(quizzes.find((q) => q.id === "state-capitals")!).length,
    50,
  );
  assert.equal(
    quizPairs(quizzes.find((q) => q.id === "capital-states")!).length,
    50,
  );
  assert.ok(
    quizPairs(quizzes.find((q) => q.id === "reverse-capitals")!).every(
      (p) => p.answer.type === "country",
    ),
  );
});

test("alphabet sorting follows native letter order and keeps missing cells last", async () => {
  const { alphabets, comparisonRows } = await import("./alphabets");
  const selected = alphabets.map((a) => a.id);
  for (const mode of ["historical", "sound", "roman"] as const) {
    const baseline = comparisonRows(selected, mode);
    for (const alphabet of alphabets) {
      for (const direction of ["asc", "desc"] as const) {
        const rows = comparisonRows(selected, mode, {
          alphabetId: alphabet.id,
          direction,
        });
        assert.deepEqual(
          [...rows.map((r) => r.key)].sort(),
          [...baseline.map((r) => r.key)].sort(),
        );
        let missing = false;
        let previous = direction === "asc" ? -1 : Infinity;
        for (const row of rows) {
          const cell = row.cells.find((c) => c.alphabet.id === alphabet.id)!;
          if (!cell.letters.length) {
            missing = true;
            continue;
          }
          assert.equal(
            missing,
            false,
            "a populated cell appeared after a missing cell",
          );
          const rank = Math.min(
            ...cell.letters.map((l) => alphabet.letters.indexOf(l)),
          );
          assert.ok(direction === "asc" ? rank >= previous : rank <= previous);
          previous = rank;
        }
      }
    }
    assert.deepEqual(
      comparisonRows(selected, mode, {
        alphabetId: "absent",
        direction: "asc",
      }),
      baseline,
    );
  }
});

test("letter-name meanings are sourced and do not spread to descendants automatically", async () => {
  const { alphabets } = await import("./alphabets");
  assert.equal(
    (entityById.get("phoenician-aleph") as import("./schema").Grapheme).meaning
      ?.text,
    "Ox",
  );
  assert.equal(
    (entityById.get("hebrew-alef") as import("./schema").Grapheme).meaning
      ?.text,
    "Ox",
  );
  assert.equal(
    (entityById.get("greek-omega") as import("./schema").Grapheme).meaning
      ?.text,
    "Large o",
  );
  for (const id of ["latin-a", "greek-alpha", "cyrillic-a"])
    assert.equal(
      (entityById.get(id) as import("./schema").Grapheme).meaning,
      undefined,
    );
  for (const alphabet of alphabets)
    for (const letter of alphabet.letters)
      if (letter.meaning) {
        assert.ok(letter.meaning.provenance.sourceURL);
        assert.deepEqual(
          (
            entityById.get(
              `${alphabet.id}-${letter.slug}`,
            ) as import("./schema").Grapheme
          ).meaning,
          letter.meaning,
        );
      }
});

test("historical correspondence is default, aligns Aleph descendants, and covers each letter once", async () => {
  const { alphabets, comparisonRows, defaultComparisonMode } =
    await import("./alphabets");
  const { historicalFamilies } = await import("./historical-correspondence");
  assert.equal(defaultComparisonMode, "historical");
  const rows = comparisonRows(
    alphabets.map((a) => a.id),
    "historical",
  );
  const aleph = rows.find((row) => row.key === "aleph")!;
  assert.deepEqual(
    aleph.cells.map((cell) => cell.letters.map((letter) => letter.symbol)),
    [["A"], ["Α"], ["А"], ["ا"], ["א"], ["𐤀"]],
  );
  assert.deepEqual(
    rows
      .find((row) => row.key === "gimel")!
      .cells[0].letters.map((letter) => letter.symbol),
    ["C", "G"],
  );
  assert.ok(
    rows.some((row) => row.key === "unassigned-cyrillic-ya" && row.note),
  );
  for (const alphabet of alphabets) {
    const slugs = rows.flatMap((row) =>
      row.cells
        .find((cell) => cell.alphabet.id === alphabet.id)!
        .letters.map((letter) => letter.slug),
    );
    assert.equal(new Set(slugs).size, alphabet.letters.length);
    assert.equal(slugs.length, alphabet.letters.length);
  }
  for (const family of historicalFamilies)
    for (const [id, slugs] of Object.entries(family.members))
      for (const slug of slugs)
        assert.ok(
          alphabets
            .find((a) => a.id === id)!
            .letters.some((letter) => letter.slug === slug),
          `${id}-${slug}`,
        );
  assert.deepEqual(comparisonRows([], "historical"), []);
});

test("all Hebrew names have meanings and the four uncertain entries stay qualified", async () => {
  const { alphabets, letterMeaningLabel } = await import("./alphabets");
  const hebrew = alphabets.find((alphabet) => alphabet.id === "hebrew")!;
  assert.equal(hebrew.letters.filter((letter) => letter.meaning).length, 22);
  assert.deepEqual(
    hebrew.letters
      .filter((letter) => letter.meaning?.provenance.disputed)
      .map((letter) => letter.slug),
    ["he", "tet", "tsadi", "qof"],
  );
  for (const slug of ["he", "tet", "tsadi", "qof"]) {
    const meaning = hebrew.letters.find(
      (letter) => letter.slug === slug,
    )!.meaning!;
    assert.equal(meaning.provenance.confidence, "low");
    assert.equal(letterMeaningLabel(meaning), "Proposed meaning (uncertain)");
    assert.ok(meaning.note.startsWith("Uncertain."));
    assert.ok(meaning.references?.[0].sourceURL);
    assert.deepEqual(
      (entityById.get(`hebrew-${slug}`) as import("./schema").Grapheme).meaning,
      meaning,
    );
  }
  assert.equal(letterMeaningLabel(hebrew.letters[0].meaning!), "Meaning");
});

test("country labels appear after zooming, avoid collisions, and follow pan", async () => {
  const { visibleCountryLabels, countryLabelZoom } =
    await import("../map-labels");
  const candidates = [
    {
      id: "small",
      name: "Small",
      point: [510, 267] as [number, number],
      area: 100,
    },
    {
      id: "large",
      name: "Large",
      point: [500, 267] as [number, number],
      area: 500,
    },
    {
      id: "offscreen",
      name: "Offscreen",
      point: [800, 350] as [number, number],
      area: 200,
    },
    {
      id: "island",
      name: "Island",
      point: [550, 320] as [number, number],
      area: 1,
    },
  ];
  assert.deepEqual(
    visibleCountryLabels(candidates, countryLabelZoom - 0.1, { x: 0, y: 0 }),
    [],
  );
  assert.deepEqual(
    visibleCountryLabels(candidates, 2, { x: 0, y: 0 }).map(
      (label) => label.id,
    ),
    ["large"],
  );
  assert.deepEqual(
    visibleCountryLabels(candidates, 2, { x: -300, y: 0 }).map(
      (label) => label.id,
    ),
    ["large", "offscreen"],
  );
  assert.deepEqual(visibleCountryLabels(candidates, 2, { x: 0, y: 1000 }), []);
});

test("label collisions account for the larger text used on narrow maps", async () => {
  const { visibleCountryLabels } = await import("../map-labels");
  const rows = [
    {
      id: "a",
      name: "Alpha",
      point: [500, 267] as [number, number],
      area: 500,
    },
    { id: "b", name: "Beta", point: [500, 278] as [number, number], area: 400 },
  ];
  assert.equal(visibleCountryLabels(rows, 2, { x: 0, y: 0 }, 10).length, 2);
  assert.equal(visibleCountryLabels(rows, 2, { x: 0, y: 0 }, 22).length, 1);
});

test("close zoom gives tiny and missing-geometry countries nonoverlapping labels with leaders", async () => {
  const { visibleCountryLabels } = await import("../map-labels");
  const rows = [
    {
      id: "ISR",
      name: "Israel",
      point: [500, 267] as [number, number],
      area: 3,
    },
    {
      id: "LBN",
      name: "Lebanon",
      point: [501, 267] as [number, number],
      area: 2,
    },
    {
      id: "MCO",
      name: "Monaco",
      point: [502, 267] as [number, number],
      area: 0,
    },
  ];
  assert.equal(visibleCountryLabels(rows, 2, { x: 0, y: 0 }).length, 0);
  const labels = visibleCountryLabels(rows, 4, { x: 0, y: 0 });
  assert.equal(labels.length, 3);
  assert.ok(labels.find((l) => l.id === "MCO")!.anchor);
  for (let i = 0; i < labels.length; i++)
    for (let j = i + 1; j < labels.length; j++) {
      const a = labels[i],
        b = labels[j];
      assert.ok(
        Math.abs(a.point[0] - b.point[0]) * 4 >=
          (a.name.length + b.name.length) * 3 + 10 ||
          Math.abs(a.point[1] - b.point[1]) * 4 >= 18,
      );
    }
  const shifted = visibleCountryLabels(rows, 4, { x: 100, y: 50 });
  assert.deepEqual(
    shifted.map((l) => l.point),
    labels.map((l) => l.point),
  );
  assert.equal(visibleCountryLabels(rows, 4, { x: 2000, y: 0 }).length, 0);
});

test("every country has a Wikipedia target and demographic imports retain dates and provenance", async () => {
  const { demographics, wikipediaURL } = await import("./demographics");
  for (const country of countries) {
    const profile = demographics[country.cca3];
    assert.ok(profile.wikipediaTitle);
    assert.ok(
      wikipediaURL(country.cca3).startsWith("https://en.wikipedia.org/wiki/"),
    );
    if (profile.population) {
      assert.ok(
        profile.sourceURL?.startsWith(
          "https://github.com/factbook/factbook.json/",
        ),
      );
      assert.ok(profile.retrieved);
      assert.ok(!/<[^>]+>/.test(profile.population));
    }
  }
  assert.match(demographics.ISR.population!, /2024/);
  assert.match(demographics.ISR.establishment!, /1948/);
  assert.match(demographics.USA.establishment!, /1776.*1783/);
  assert.match(demographics.ISR.religion!, /2022/);
  assert.equal(demographics.PSE.population, undefined);
  assert.ok(wikipediaURL("GEO").includes("Georgia_(country)"));
});

test("letter display defaults to both and retains print for scripts without curated handwriting", async () => {
  const { defaultLetterDisplayMode, letterVariants, handwritingStyles } =
    await import("./handwriting");
  assert.equal(defaultLetterDisplayMode, "both");
  for (const script of [
    "latin",
    "greek",
    "cyrillic",
    "hebrew",
    "arabic",
    "devanagari",
    "hiragana",
    "han",
  ]) {
    assert.deepEqual(letterVariants(script, "both"), ["print", "handwritten"]);
    assert.deepEqual(letterVariants(script, "print"), ["print"]);
    assert.deepEqual(letterVariants(script, "handwritten"), ["handwritten"]);
    assert.ok(
      handwritingStyles[script].sourceURL.startsWith(
        "https://github.com/google/fonts/",
      ),
    );
  }
  assert.deepEqual(letterVariants("phoenician", "handwritten"), ["print"]);
  assert.deepEqual(letterVariants(undefined, "both"), ["print"]);
});

test("map pinch preserves its focal point, follows the midpoint, and clamps zoom", async () => {
  const { MapGestures, zoomMapAt, mapPoint } = await import("../map-gestures");
  const start = { zoom: 2, pan: { x: 50, y: -20 } },
    from = { x: 620, y: 180 },
    to = { x: 650, y: 210 };
  const zoomed = zoomMapAt(start, from, to, 4);
  const world = (view: typeof start, point: typeof from) => ({
    x: (point.x - 500 - view.pan.x) / view.zoom,
    y: (point.y - 267 - view.pan.y) / view.zoom,
  });
  assert.deepEqual(world(zoomed, to), world(start, from));
  assert.equal(zoomMapAt(start, from, to, 100).zoom, 16);
  assert.equal(zoomMapAt(start, from, to, 0).zoom, 1);
  const gestures = new MapGestures();
  gestures.down(1, { x: 400, y: 267 });
  gestures.down(2, { x: 600, y: 267 });
  gestures.move(1, { x: 300, y: 267 });
  gestures.move(2, { x: 700, y: 267 });
  assert.equal(gestures.view.zoom, 2);
  assert.deepEqual(gestures.view.pan, { x: 0, y: 0 });
  assert.equal(gestures.moved, true);
  gestures.up(2);
  const before = gestures.view;
  gestures.move(1, { x: 310, y: 277 });
  assert.equal(gestures.view.zoom, before.zoom);
  assert.deepEqual(gestures.view.pan, { x: 10, y: 10 });
  gestures.up(1);
  gestures.up(1);
  gestures.down(3, { x: 500, y: 267 });
  gestures.move(3, { x: 501, y: 267 });
  assert.equal(gestures.moved, false);
  gestures.up(3);
  assert.deepEqual(gestures.reset(), { zoom: 1, pan: { x: 0, y: 0 } });
  assert.deepEqual(
    mapPoint({ x: 200, y: 300 }, { left: 0, top: 0, width: 400, height: 600 }),
    { x: 500, y: 267.5 },
  );
});
