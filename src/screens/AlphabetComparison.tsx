import { Glyph, useLetterForms } from "../components/LetterForms";
import { useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ArrowUpDown,
  Info,
  Settings2,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
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
import { handwritingStyles } from "../data/handwriting";
import ComparisonPanel from "../components/ComparisonPanel";
import {
  nextComparisonSort,
  comparisonSortAction,
} from "../data/comparison-controls";
import { historicalSources } from "../data/historical-correspondence";
import { PageTitle, Source } from "../components/ui";
import { go } from "../navigation";
type OpenPanel = {
  kind: "alphabets" | "display" | "help" | "family";
  anchor: HTMLElement;
  rowKey?: string;
};
export default function AlphabetComparison() {
  const { mode: letterMode, setMode: setLetterMode } = useLetterForms();
  const [panel, setPanel] = useState<OpenPanel>();
  const [familyExpanded, setFamilyExpanded] = useState(
    () =>
      typeof window === "undefined" ||
      !window.matchMedia("(max-width: 760px)").matches,
  );

  const [selected, setSelected] = useState([
    "latin",
    "greek",
    "cyrillic",
    "arabic",
    "hebrew",
  ]);
  const [mode, setMode] = useState<ComparisonMode>(defaultComparisonMode);
  const showFamilyColumn = mode !== "historical" || familyExpanded;
  const [sort, setSort] = useState<ComparisonSort>();
  const activeSort = selected.includes(sort?.alphabetId || "")
    ? sort
    : undefined;
  const columns = alphabets.filter((a) => selected.includes(a.id));
  const canShowLetterForms = columns.some(
    (alphabet) => !!handwritingStyles[alphabet.id],
  );
  const rows = comparisonRows(selected, mode, activeSort);
  const family =
    panel?.kind === "family"
      ? rows.find((row) => row.key === panel.rowKey)
      : undefined;
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
      <div className="compare-controls">
        <div
          className="compare-modes"
          role="group"
          aria-label="Correspondence mode"
        >
          {(
            [
              ["historical", "History"],
              ["sound", "Sounds"],
              ["roman", "Romanization"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              aria-pressed={mode === value}
              className={mode === value ? "active" : ""}
              onClick={() => setMode(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="compare-actions">
          <button
            aria-haspopup="dialog"
            aria-expanded={panel?.kind === "alphabets"}
            onClick={(event) =>
              setPanel({ kind: "alphabets", anchor: event.currentTarget })
            }
          >
            <SlidersHorizontal size={16} /> Alphabets · {columns.length}
          </button>
          <button
            aria-haspopup="dialog"
            aria-expanded={panel?.kind === "display"}
            disabled={
              !canShowLetterForms && (mode !== "historical" || !columns.length)
            }
            onClick={(event) =>
              setPanel({ kind: "display", anchor: event.currentTarget })
            }
          >
            <Settings2 size={16} /> Display
          </button>
          <button
            aria-haspopup="dialog"
            aria-expanded={panel?.kind === "help"}
            onClick={(event) =>
              setPanel({ kind: "help", anchor: event.currentTarget })
            }
          >
            <Info size={16} /> Help
          </button>
        </div>
      </div>
      <p className="compare-summary">
        {columns.length
          ? columns.map((a) => a.label).join(" · ")
          : "No alphabets selected"}{" "}
        <span> · {rows.length} rows</span>
      </p>
      <p className="compare-guidance">
        {mode === "historical"
          ? "Shared history, even when sounds differ."
          : mode === "sound"
            ? "Similar sounds, not identical letters."
            : "Shared romanization, not necessarily a shared sound."}
        <span> Tap a letter to explore; tap a column heading to sort.</span>
      </p>
      {activeSort && (
        <p className="compare-sort-status" role="status">
          {columns.find((a) => a.id === activeSort.alphabetId)?.label}:{" "}
          {activeSort.direction === "asc" ? "forward" : "reverse"} letter order.
          Tap its heading to{" "}
          {activeSort.direction === "asc"
            ? "reverse"
            : "restore correspondence order"}
          .
        </p>
      )}
      {columns.length ? (
        <div
          className="table-scroll comparison-scroll"
          tabIndex={0}
          role="region"
          aria-label="Scrollable alphabet comparison"
        >
          <table
            id="alphabet-comparison"
            className={`comparison-table ${showFamilyColumn ? "has-family-column" : "no-family-column"}`}
          >
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
                {showFamilyColumn && (
                  <th className="family-column" scope="col">
                    {mode === "historical"
                      ? "Historical family"
                      : mode === "sound"
                        ? "Sound family"
                        : "Romanization"}
                  </th>
                )}
                {mode === "historical" && (
                  <th scope="col" className="family-info-column">
                    <span className="sr-only">Family notes</span>
                  </th>
                )}
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
                    <div className="compare-column-heading">
                      <button
                        className="compare-header-sort"
                        aria-label={`${comparisonSortAction(activeSort, a.id)} ${a.label}`}
                        onClick={() =>
                          setSort(nextComparisonSort(activeSort, a.id))
                        }
                      >
                        {a.label}
                        {activeSort?.alphabetId === a.id ? (
                          activeSort.direction === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )
                        ) : (
                          <ArrowUpDown size={14} />
                        )}
                      </button>
                      <button
                        className="comparison-icon-button"
                        aria-label={`About ${a.label}`}
                        title={`About ${a.label}`}
                        onClick={() => go(`/script/${a.id}`)}
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.key}
                  aria-label={mode === "historical" ? row.label : undefined}
                >
                  {showFamilyColumn && (
                    <th className="family-column" scope="row">
                      {row.label}
                    </th>
                  )}
                  {mode === "historical" && (
                    <td className="family-info-column">
                      <button
                        className="comparison-icon-button"
                        aria-label={`About ${row.label}`}
                        title={row.label}
                        aria-haspopup="dialog"
                        onClick={(event) =>
                          setPanel({
                            kind: "family",
                            rowKey: row.key,
                            anchor: event.currentTarget,
                          })
                        }
                      >
                        <Info size={18} />
                      </button>
                    </td>
                  )}
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
      <details className="alphabet-notes comparison-reference">
        <summary>About the selected alphabets</summary>
        {columns.map((a) => (
          <p key={a.id}>
            <b>{a.label}.</b> {a.notes}
          </p>
        ))}
      </details>
      <details className="comparison-reference">
        <summary>Sources & references</summary>
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
      </details>
      {panel && (
        <ComparisonPanel
          key={panel.kind + (panel.rowKey || "")}
          title={
            panel.kind === "alphabets"
              ? "Select alphabets & abjads"
              : panel.kind === "display"
                ? "Display"
                : panel.kind === "help"
                  ? "How to compare"
                  : family?.label || "Family notes"
          }
          anchor={panel.anchor}
          onDismiss={() => setPanel(undefined)}
        >
          {panel.kind === "alphabets" && (
            <fieldset className="compare-alphabet-options">
              <legend className="sr-only">Select alphabets & abjads</legend>
              {alphabets.map((a) => (
                <label key={a.id}>
                  <input
                    type="checkbox"
                    checked={selected.includes(a.id)}
                    onChange={() => {
                      setSelected((previous) =>
                        previous.includes(a.id)
                          ? previous.filter((id) => id !== a.id)
                          : [...previous, a.id],
                      );
                      if (selected.includes(a.id) && sort?.alphabetId === a.id)
                        setSort(undefined);
                    }}
                  />{" "}
                  <span>
                    {a.label}
                    <small>{a.letters.length} letters</small>
                  </span>
                </label>
              ))}
            </fieldset>
          )}
          {panel.kind === "display" && (
            <>
              {canShowLetterForms && (
                <>
                  <fieldset className="compare-form-options">
                    <legend>Letter forms</legend>
                    {(
                      [
                        ["both", "Both"],
                        ["print", "Print"],
                        ["handwritten", "Handwritten"],
                      ] as const
                    ).map(([value, label]) => (
                      <label key={value}>
                        <input
                          type="radio"
                          name="comparison-letter-forms"
                          value={value}
                          checked={letterMode === value}
                          onChange={() => setLetterMode(value)}
                        />
                        {label}
                      </label>
                    ))}
                  </fieldset>
                  <p className="muted">
                    Handwritten forms appear where available. This preference
                    applies across Worldling.
                  </p>
                </>
              )}
              {mode === "historical" && (
                <label className="compare-family-setting">
                  <input
                    type="checkbox"
                    checked={familyExpanded}
                    onChange={(event) =>
                      setFamilyExpanded(event.target.checked)
                    }
                  />{" "}
                  Show historical family column
                </label>
              )}
              {mode === "historical" && (
                <p className="muted">
                  Family comments are always available through each row’s
                  information button.
                </p>
              )}
            </>
          )}
          {panel.kind === "help" && (
            <div className="comparison-help-copy" role="note">
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
                correspondence; digraphs and vowel marks are not added to fill
                gaps.
                {mode !== "historical" &&
                  "These rows do not assert historical ancestry."}{" "}
                Tap a column heading to cycle forward, reverse, and
                correspondence order; rows with no letter in that alphabet stay
                at the bottom. Meanings describe traditional or literal letter
                names where documented. For example, Aleph’s name means “ox”;
                the letter represents a sound. Disputed meanings are marked as
                proposed and uncertain; select a letter for competing
                interpretations and sources. Names without a documented meaning
                here have no meaning label.
              </p>
            </div>
          )}
          {panel.kind === "family" && family && (
            <>
              <p>{family.note}</p>
              <ul className="compare-family-members">
                {family.cells
                  .filter((cell) => cell.letters.length)
                  .map((cell) => (
                    <li key={cell.alphabet.id}>
                      <strong>{cell.alphabet.label}</strong>:{" "}
                      <span className="compare-family-glyphs">
                        {cell.letters.map((letter) => (
                          <span key={letter.slug}>
                            <Glyph
                              text={letter.symbol}
                              scriptId={cell.alphabet.id}
                              dir={
                                ["arabic", "hebrew"].includes(cell.alphabet.id)
                                  ? "rtl"
                                  : "ltr"
                              }
                            />
                            <small>{letter.name}</small>
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
              </ul>
              <p className="muted">
                Shared rows group historical families; they do not imply direct
                borrowing between every displayed script.
              </p>
            </>
          )}
        </ComparisonPanel>
      )}
    </>
  );
}
