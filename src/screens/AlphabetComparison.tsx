import { Glyph } from "../components/LetterForms";
import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ArrowUpDown } from "lucide-react";
import {
  alphabets,
  comparisonRows,
  alphabetSource,
  meaningSources,
  letterMeaningLabel,
  type ComparisonSort,
  type ComparisonMode,
  defaultComparisonMode,
} from "../data/alphabets";
import { historicalSources } from "../data/historical-correspondence";
import { PageTitle, Source } from "../components/ui";
import { go } from "../navigation";
export default function AlphabetComparison() {
  const [selected, setSelected] = useState([
    "latin",
    "greek",
    "cyrillic",
    "arabic",
    "hebrew",
  ]);
  const [mode, setMode] = useState<ComparisonMode>(defaultComparisonMode);
  const [sort, setSort] = useState<ComparisonSort>();
  const activeSort = selected.includes(sort?.alphabetId || "")
    ? sort
    : undefined;
  const columns = alphabets.filter((a) => selected.includes(a.id));
  const rows = comparisonRows(selected, mode, activeSort);
  return (
    <>
      <button className="back" onClick={() => go("/writing")}>
        <ChevronLeft size={16} />
        Writing systems
      </button>
      <PageTitle
        eyebrow="WRITING / SIDE BY SIDE"
        title="Different letters. Shared connections."
        description="Line up historical letter families, or compare sounds and romanization. Select any letter to explore it."
      />
      <fieldset className="alphabet-select">
        <legend>Select alphabets & abjads</legend>
        {alphabets.map((a) => (
          <label key={a.id}>
            <input
              type="checkbox"
              checked={selected.includes(a.id)}
              onChange={() =>
                setSelected((s) =>
                  s.includes(a.id) ? s.filter((x) => x !== a.id) : [...s, a.id],
                )
              }
            />
            {a.label}
            <small>{a.letters.length} letters</small>
          </label>
        ))}
      </fieldset>
      <div className="toolbar">
        <div className="tabs scroll-tabs">
          <button
            aria-pressed={mode === "historical"}
            className={mode === "historical" ? "active" : ""}
            onClick={() => setMode("historical")}
          >
            Historical correspondence
          </button>
          <button
            aria-pressed={mode === "sound"}
            className={mode === "sound" ? "active" : ""}
            onClick={() => setMode("sound")}
          >
            Similar sounds
          </button>
          <button
            aria-pressed={mode === "roman"}
            className={mode === "roman" ? "active" : ""}
            onClick={() => setMode("roman")}
          >
            Romanization
          </button>
        </div>
        <label className="comparison-sort">
          Sort by
          <select
            aria-label="Sort comparison by"
            value={activeSort?.alphabetId || ""}
            onChange={(e) =>
              setSort(
                e.target.value
                  ? { alphabetId: e.target.value, direction: "asc" }
                  : undefined,
              )
            }
          >
            <option value="">Correspondence order</option>
            {columns.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label} letter order
              </option>
            ))}
          </select>
        </label>
        <span className="muted">{rows.length} correspondence rows</span>
      </div>
      <div className="comparison-note" role="note">
        <b>
          {mode === "historical"
            ? "Shared history, even when sounds differ."
            : mode === "sound"
              ? "Similar sounds, not identical letters."
              : "Shared romanization, not necessarily a shared sound."}
        </b>
        <p>
          {mode === "historical"
            ? "Rows group curated historical letter families, including later modifications. Alif, Alef, Alpha and A share the Aleph family. A row can contain several descendants, such as Latin C and G; it does not imply direct borrowing between every displayed script. Letters without an assigned correspondence appear on their own rows. Intermediate and obsolete letters are not displayed."
            : mode === "sound"
              ? "Rows group broad representative sound values. Some sounds are only approximate matches (such as /x/ and /χ/, or different r sounds). A letter may appear in several rows because context or diacritics change its value."
              : "Rows match simplified romanization labels exactly. Romanization conventions vary: ph and f remain separate, as do e and ē. This is a letter-level reference, not a word transliterator."}{" "}
          An empty cell means no single letter is listed for that
          correspondence; digraphs and vowel marks are not added to fill gaps.
          {mode !== "historical" &&
            "These rows do not assert historical ancestry."}{" "}
          Sort an alphabet by its letter order; rows with no letter in that
          alphabet stay at the bottom. Meanings describe traditional or literal
          letter names where documented. For example, Aleph’s name means “ox”;
          the letter represents a sound. Disputed meanings are marked as
          proposed and uncertain; select a letter for competing interpretations
          and sources. Names without a documented meaning here have no meaning
          label.
        </p>
      </div>
      {columns.length ? (
        <div
          className="table-scroll comparison-scroll"
          tabIndex={0}
          role="region"
          aria-label="Scrollable alphabet comparison"
        >
          <table className="comparison-table">
            <caption>
              {mode === "historical"
                ? "Historical letter families"
                : mode === "sound"
                  ? "Broad sound correspondences"
                  : "Educational romanization correspondences"}{" "}
              — select a glyph for its details. Scroll sideways to see every
              selected script.
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  {mode === "historical"
                    ? "Historical family"
                    : mode === "sound"
                      ? "Sound family"
                      : "Romanization"}
                </th>
                {columns.map((a) => (
                  <th
                    key={a.id}
                    scope="col"
                    aria-sort={
                      activeSort?.alphabetId === a.id
                        ? activeSort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <button onClick={() => go(`/script/${a.id}`)}>
                      {a.label}
                      <ArrowUpRight size={13} />
                    </button>
                    <button
                      className="alphabet-sort-button"
                      aria-label={`Sort by ${a.label} ${activeSort?.alphabetId === a.id && activeSort.direction === "asc" ? "descending" : "ascending"} letter order`}
                      onClick={() =>
                        setSort({
                          alphabetId: a.id,
                          direction:
                            activeSort?.alphabetId === a.id &&
                            activeSort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      <ArrowUpDown size={12} />
                      {activeSort?.alphabetId === a.id
                        ? activeSort.direction === "asc"
                          ? "First → last"
                          : "Last → first"
                        : "Sort letters"}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <th scope="row">
                    {row.label}
                    {row.note && (
                      <small className="historical-row-note">{row.note}</small>
                    )}
                  </th>
                  {row.cells.map((cell) => (
                    <td key={cell.alphabet.id}>
                      {cell.letters.length ? (
                        <div className="comparison-letters">
                          {cell.letters.map((l) => (
                            <button
                              key={l.slug}
                              aria-label={`${cell.alphabet.label} ${l.name}, ${l.symbol}`}
                              title={`${l.name}: ${l.ipa}`}
                              onClick={() =>
                                go(`/letter/${cell.alphabet.id}-${l.slug}`)
                              }
                            >
                              <Glyph
                                text={
                                  ["latin", "greek", "cyrillic"].includes(
                                    cell.alphabet.id,
                                  )
                                    ? `${l.symbol} ${l.symbol.toLowerCase()}`
                                    : l.symbol
                                }
                                scriptId={cell.alphabet.id}
                                dir={
                                  ["arabic", "hebrew"].includes(
                                    cell.alphabet.id,
                                  )
                                    ? "rtl"
                                    : "ltr"
                                }
                              />
                              <small>{l.name}</small>
                              {l.meaning && (
                                <small
                                  className="letter-meaning"
                                  title={l.meaning.note}
                                >
                                  {letterMeaningLabel(l.meaning)}:{" "}
                                  {l.meaning.text}
                                </small>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span
                          className="missing-letter"
                          aria-label="No single-letter correspondence"
                        >
                          —
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          Choose an alphabet above to start comparing.
        </div>
      )}
      <section className="alphabet-notes">
        <h2>Read each column on its own terms.</h2>
        {columns.map((a) => (
          <p key={a.id}>
            <b>{a.label}.</b> {a.notes}
          </p>
        ))}
      </section>
      <Source
        items={[
          alphabetSource,
          ...(mode === "historical" ? historicalSources : []),
          ...meaningSources,
          {
            source: "Unicode — European alphabetic scripts",
            sourceURL:
              "https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-7/",
            confidence: "high",
          },
        ]}
      />
    </>
  );
}
