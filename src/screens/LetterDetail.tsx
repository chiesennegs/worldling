import { Glyph } from "../components/LetterForms";
import { handwritingStyles } from "../data/handwriting";
import { ArrowRight, ChevronLeft, Volume2 } from "lucide-react";
import { scripts, graphemes } from "../data/knowledge";
import { entityById, related, ancestors } from "../data/graph";
import { go } from "../navigation";
import {
  EntityLink,
  Source,
  PageTitle,
  Save,
  Fact,
  Section,
} from "../components/ui";

export default function LetterDetail({
  id,
  saved,
  bookmark,
  speak,
}: {
  id: string;
  saved: string[];
  bookmark: (id: string) => void;
  speak: (t: string, l?: string, r?: number) => void;
}) {
  const g = graphemes.find((g) => g.id === id);
  if (!g) return <p>Letter not found.</p>;
  const script = scripts.find((s) => s.id === g.scriptId)!;
  const chain = ancestors(id, "DESCENDED_FROM_GLYPH").reverse();
  return (
    <>
      <button className="back" onClick={() => go(`/script/${g.scriptId}`)}>
        <ChevronLeft size={16} />
        {script.name} script
      </button>
      <PageTitle
        eyebrow={`GRAPHEME / ${script.name.toUpperCase()}`}
        title={g.name}
        description="One small symbol. A long and connected history."
      >
        <Save id={id} saved={saved} bookmark={bookmark} />
      </PageTitle>
      <div className="letter-detail">
        <div className="glyph-stage">
          <Glyph text={g.symbol} scriptId={g.scriptId} />
          <small>
            {script.name} · {g.name}
          </small>
          <button
            className="audio-button"
            onClick={() =>
              speak(
                g.sounds[0].speechText || g.symbol || g.name,
                g.sounds[0].language,
              )
            }
          >
            <Volume2 size={17} />
            Hear a representative reading
          </button>
        </div>
        <div className="letter-info">
          <span className="tag">{script.kind}</span>
          <h2>A closer look at {g.name}</h2>
          <div className="facts">
            {g.meaning && (
              <Fact
                label={
                  g.meaning.provenance.disputed
                    ? "PROPOSED LETTER-NAME MEANING (UNCERTAIN)"
                    : "LETTER-NAME MEANING"
                }
                value={g.meaning.text}
              />
            )}
            <Fact label="TRANSLITERATION" value={g.transliteration} />
            <Fact label="ORDER IN SAMPLE TRADITION" value={String(g.order)} />
            <Fact label="REPRESENTATIVE VALUE / NAME" value={g.sounds[0].ipa} />
            <Fact
              label="LANGUAGE"
              value={
                entityById.get(g.sounds[0].language)?.name ||
                g.sounds[0].language
              }
            />
          </div>
          <p className="muted">{g.sounds[0].context}</p>
          {g.meaning && <p className="muted">{g.meaning.note}</p>}
          {g.origin && <p className="origin-note">{g.origin}</p>}
          <EntityLink entity={script} />
        </div>
      </div>
      <Section
        title="A letter has many forms"
        subtitle="The same grapheme can appear in different visual forms. This is a modern font rendering, not a historical facsimile."
      >
        <div className="forms">
          {Object.entries(g.forms).map(([name, glyph]) => (
            <div key={name}>
              <Glyph text={glyph} scriptId={g.scriptId} />
              <small>{name}</small>
            </div>
          ))}
        </div>
      </Section>
      {chain.length > 0 && (
        <Section
          title="Follow the shape through time"
          subtitle="Historical descent connects these letters. Their sounds and functions are not necessarily the same."
        >
          <div className="evolution">
            {[...chain, g].map((e, i) => (
              <div className="evolution-step" key={e.id}>
                {i > 0 && <ArrowRight size={19} />}
                <button onClick={() => go(`/letter/${e.id}`)}>
                  <Glyph
                    text={e.symbol}
                    scriptId={graphemes.find((g) => g.id === e.id)?.scriptId}
                  />
                  <strong>{e.name}</strong>
                  <small>
                    {
                      scripts.find(
                        (s) =>
                          s.id ===
                          graphemes.find((g) => g.id === e.id)?.scriptId,
                      )?.name
                    }
                  </small>
                </button>
              </div>
            ))}
          </div>
        </Section>
      )}
      <Section title="Connected, in different ways">
        <div className="relationship-grid">
          {(
            [
              "DESCENDED_FROM_GLYPH",
              "VISUALLY_SIMILAR_TO",
              "PHONETICALLY_SIMILAR_TO",
            ] as const
          ).map((type) => {
            const rs = [
              ...related(id, type).map((r) => ({ ...r, inverse: false })),
              ...related(id, type, true).map((r) => ({ ...r, inverse: true })),
            ];
            return (
              rs.length > 0 && (
                <div key={type}>
                  <h3>
                    {type === "DESCENDED_FROM_GLYPH"
                      ? "Historical ancestry"
                      : type === "VISUALLY_SIMILAR_TO"
                        ? "Visual similarity"
                        : "Similar pronunciation"}
                  </h3>
                  <p className="muted">
                    {type === "DESCENDED_FROM_GLYPH"
                      ? "A documented line of transmission."
                      : type === "VISUALLY_SIMILAR_TO"
                        ? "Shapes can resemble one another."
                        : "A shared representative sound, not a shared origin."}
                  </p>
                  {rs.map((r) => (
                    <div key={r.entity.id}>
                      <small className="relationship-label">
                        {type === "DESCENDED_FROM_GLYPH"
                          ? r.inverse
                            ? "DESCENDANT"
                            : "ANCESTOR"
                          : "RELATED BY " +
                            (type === "VISUALLY_SIMILAR_TO"
                              ? "SHAPE"
                              : "SOUND")}
                      </small>
                      <EntityLink entity={r.entity} />
                      {r.relationship.notes && (
                        <p className="muted">{r.relationship.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )
            );
          })}
        </div>
      </Section>
      <Source
        items={[
          ...(g.provenance || []),
          ...(handwritingStyles[g.scriptId]
            ? [
                {
                  source: `${handwritingStyles[g.scriptId].family} — representative handwritten rendering (SIL Open Font License)`,
                  sourceURL: handwritingStyles[g.scriptId].sourceURL,
                  notes: handwritingStyles[g.scriptId].note,
                },
              ]
            : []),
          ...(g.meaning
            ? [g.meaning.provenance, ...(g.meaning.references || [])]
            : []),
          ...related(id, "DESCENDED_FROM_GLYPH")
            .map((r) => r.relationship.provenance!)
            .filter(Boolean),
        ]}
      />
    </>
  );
}
