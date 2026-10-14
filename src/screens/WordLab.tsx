import { useLetterForms } from "../components/LetterForms";
import { letterVariants, handwritingStyles } from "../data/handwriting";
import { useState } from "react";
import { ArrowRight, Volume2, RotateCcw, Lightbulb } from "lucide-react";
import { words } from "../data/knowledge";
import { entityById } from "../data/graph";
import { EntityLink, Source, PageTitle, Section } from "../components/ui";

export default function WordLab({
  speak,
}: {
  speak: (t: string, l?: string, r?: number) => void;
}) {
  const w = words[0];
  const { mode } = useLetterForms();
  const [stage, setStage] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const stages = [
    "Natural word",
    "Grapheme colors",
    "Boundaries",
    "Contextual forms",
    "Isolated letters",
    "Names & sounds",
  ];
  return (
    <>
      <PageTitle
        eyebrow="EXPLORE / WORD LAB"
        title="A word. A world within."
        description="Take writing apart, one connection at a time. Then see how it comes together."
      />
      <div className="word-lab">
        <div className="word-lab-top">
          <span className="tag">ARABIC · MODERN STANDARD ARABIC</span>
          <span>RIGHT TO LEFT ←</span>
        </div>
        <div className="word-form-renderings">
          {letterVariants(w.scriptId, mode).map((variant) => (
            <div
              className="word-rendering"
              key={variant}
              data-variant={variant}
            >
              <div className={`word-stage stage-${stage}`} dir="rtl">
                {stage === 0 ? (
                  <span className="natural-word" lang="ar">
                    {w.text}
                  </span>
                ) : stage < 3 ? (
                  <span
                    className={`colored-word ${stage === 2 ? "boundaries" : ""}`}
                    lang="ar"
                  >
                    {w.segments.map((s, i) => (
                      <span
                        key={i}
                        role="button"
                        tabIndex={0}
                        aria-label={`${s.name}, ${s.sound}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelected(i);
                          }
                        }}
                        className={`segment color-${i} ${selected === i ? "selected" : ""}`}
                        onClick={() => setSelected(i)}
                      >
                        {s.isolated}
                      </span>
                    ))}
                  </span>
                ) : (
                  <div className="separated-word">
                    {w.segments.map((s, i) => (
                      <button
                        key={i}
                        className={`color-${i} ${selected === i ? "selected" : ""}`}
                        onClick={() => setSelected(i)}
                      >
                        <span lang="ar">
                          {stage === 3 ? s.contextual : s.isolated}
                        </span>
                        {stage === 5 && (
                          <>
                            <strong>{s.name}</strong>
                            <small>{s.sound}</small>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <small className="word-form-caption">
                {variant === "print"
                  ? "Print"
                  : handwritingStyles[w.scriptId].label}
              </small>
            </div>
          ))}
        </div>
        <div className="word-reading">
          <strong>{w.transliteration}</strong>
          <span>{w.pronunciation.ipa}</span>
          <span>“{w.translation}”</span>
          <button
            aria-label="Play word pronunciation"
            onClick={() => speak(w.text, w.languageId)}
          >
            <Volume2 size={18} />
          </button>
          <button
            className="slow-audio"
            onClick={() => speak(w.text, w.languageId, 0.55)}
          >
            0.5×
          </button>
        </div>
        <div className="decomposition-steps">
          {stages.map((s, i) => (
            <button
              className={stage === i ? "active" : ""}
              key={s}
              onClick={() => {
                setStage(i);
                setSelected(null);
              }}
            >
              <span>{i + 1}</span>
              {s}
            </button>
          ))}
        </div>
        <div className="word-controls">
          <button
            className="secondary"
            onClick={() => {
              setStage(0);
              setSelected(null);
            }}
          >
            <RotateCcw size={15} />
            Reassemble
          </button>
          <span>
            {stage + 1} / {stages.length} · {stages[stage]}
          </span>
          <button
            className="primary"
            disabled={stage === 5}
            onClick={() => setStage((s) => s + 1)}
          >
            Take it apart <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div className="two-columns">
        <Section title="The letters inside">
          <div className="entity-grid">
            {w.segments.map((s, i) => (
              <div
                key={s.graphemeId}
                className={selected === i ? "highlighted" : ""}
              >
                <EntityLink entity={entityById.get(s.graphemeId)!} />
              </div>
            ))}
          </div>
        </Section>
        <Section title="Why do the shapes change?">
          <p className="readable">
            Arabic letters join according to their connection properties and
            neighbors. Most have several contextual forms. Alif connects to the
            preceding letter but does not join to the following one.
          </p>
          <div className="note-card">
            <Lightbulb size={20} />
            <p>
              {w.description} The colored view preserves joining; the separated
              view adds visible extension strokes as teaching aids.
            </p>
          </div>
          <p className="muted">
            Audio uses an installed browser/system voice when available. The
            word lab works without audio.
          </p>
        </Section>
      </div>
      <Source items={w.provenance} />
    </>
  );
}
