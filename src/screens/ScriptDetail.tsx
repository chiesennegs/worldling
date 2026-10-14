import { Glyph } from "../components/LetterForms";
import { BookOpen, ArrowRight, ChevronLeft } from "lucide-react";
import { letterMeaningLabel } from "../data/alphabets";
import { scripts, graphemes, relationships } from "../data/knowledge";
import { entityById, related } from "../data/graph";
import type { Script } from "../data/schema";
import { go } from "../navigation";
import {
  EntityLink,
  Source,
  PageTitle,
  Save,
  Fact,
  Section,
} from "../components/ui";

export default function ScriptDetail({
  id,
  saved,
  bookmark,
}: {
  id: string;
  saved: string[];
  bookmark: (id: string) => void;
}) {
  const s = scripts.find((s) => s.id === id);
  if (!s) return <p>Script not found.</p>;
  const letters = graphemes.filter((g) => g.scriptId === id);
  return (
    <>
      <button className="back" onClick={() => go("/writing")}>
        <ChevronLeft size={16} />
        All writing systems
      </button>
      <PageTitle
        eyebrow={`WRITING / ${s.kind.toUpperCase()}`}
        title={s.name}
        description={s.description || ""}
      >
        <Save id={id} saved={saved} bookmark={bookmark} />
      </PageTitle>
      <div className="script-detail-hero">
        <span dir={s.direction}>{s.sample}</span>
        <div className="facts">
          <Fact label="SYSTEM TYPE" value={s.kind} />
          <Fact
            label="DIRECTION"
            value={s.direction === "rtl" ? "Right to left" : "Left to right"}
          />
          <Fact label="EARLIEST PERIOD, APPROX." value={s.period} />
        </div>
      </div>
      <Section
        title="Meet the letters"
        subtitle="Select a glyph to explore its forms and relationships. Meaning labels explain letter names; proposed meanings are uncertain. Select a letter for interpretations and sources."
      >
        <div className="letter-grid">
          {letters.length ? (
            letters.map((g) => (
              <button
                className="letter-tile"
                key={g.id}
                onClick={() => go(`/letter/${g.id}`)}
              >
                <Glyph
                  text={
                    ["latin", "greek", "cyrillic"].includes(g.scriptId)
                      ? `${g.symbol} ${g.symbol?.toLowerCase()}`
                      : g.symbol
                  }
                  scriptId={g.scriptId}
                />
                <strong>{g.name}</strong>
                <small>{g.transliteration}</small>
                {g.meaning && (
                  <small className="letter-meaning" title={g.meaning.note}>
                    {letterMeaningLabel(g.meaning)}: {g.meaning.text}
                  </small>
                )}
              </button>
            ))
          ) : (
            <p>
              Individual letters in this script are not yet in the curated
              collection.
            </p>
          )}
        </div>
      </Section>
      <div className="two-columns">
        <Section title="Written in this script">
          <div className="entity-grid">
            {s.languageIds
              .map((id) => entityById.get(id))
              .filter(Boolean)
              .map((e) => (
                <EntityLink key={e!.id} entity={e!} />
              ))}
          </div>
        </Section>
        <Section title="A place in the family">
          <div className="entity-grid">
            {related(id, "DERIVED_FROM").map((r) => (
              <div key={r.entity.id}>
                <span className="relationship-label">DERIVED FROM</span>
                <EntityLink entity={r.entity} />
              </div>
            ))}
            {related(id, "DERIVED_FROM", true).map((r) => (
              <div key={r.entity.id}>
                <span className="relationship-label">LATER DESCENDANT</span>
                <EntityLink entity={r.entity} />
              </div>
            ))}
          </div>
          <button className="text-button" onClick={() => go("/genealogy")}>
            See the family tree <ArrowRight size={16} />
          </button>
        </Section>
      </div>
      {id === "arabic" && (
        <div className="note-strip">
          <BookOpen />
          <span>
            <b>Letters that change with their neighbors.</b> Take the word سلام
            apart in the word explorer.
          </span>
          <button className="primary" onClick={() => go("/word")}>
            Open word lab <ArrowRight size={16} />
          </button>
        </div>
      )}
      <Source
        items={[
          ...(s.provenance || []),
          ...Array.from(
            new Map(
              letters
                .filter((g) => g.meaning)
                .flatMap((g) =>
                  [g.meaning!.provenance, ...(g.meaning!.references || [])].map(
                    (source) => [source.sourceURL, source] as const,
                  ),
                ),
            ).values(),
          ),
        ]}
      />
    </>
  );
}
