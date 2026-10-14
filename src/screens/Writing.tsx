import { Glyph } from "../components/LetterForms";
import { useState } from "react";
import { Network, ArrowRight } from "lucide-react";
import { scripts, graphemes } from "../data/knowledge";
import { go } from "../navigation";
import { PageTitle, ScriptCard, Section } from "../components/ui";

export default function Writing() {
  const [kind, setKind] = useState("All systems");
  return (
    <>
      <PageTitle
        eyebrow="EXPLORE / WRITING"
        title="Language, made visible."
        description="Alphabets are only the beginning. Discover the many ways the world writes."
      >
        <button className="secondary" onClick={() => go("/compare")}>
          Compare alphabets <ArrowRight size={16} />
        </button>
      </PageTitle>
      <div className="writing-banner">
        <span className="writing-banner-glyphs">
          <Glyph text="अ" scriptId="devanagari" />{" "}
          <Glyph text="ع" scriptId="arabic" />{" "}
          <Glyph text="あ" scriptId="hiragana" />{" "}
          <Glyph text="A" scriptId="latin" /> <Glyph text="山" scriptId="han" />
        </span>
        <div>
          <div className="eyebrow">
            DIFFERENT SYSTEMS. SHARED HUMAN INSTINCT.
          </div>
          <h2>More than letters.</h2>
          <p>
            An abjad foregrounds consonants. An abugida builds around
            consonant–vowel units. A syllabary represents syllables or morae.
            Explore each on its own terms.
          </p>
        </div>
      </div>
      <div className="toolbar">
        <div className="tabs scroll-tabs">
          {[
            "All systems",
            "alphabet",
            "abjad",
            "abugida",
            "syllabary",
            "logographic",
          ].map((k) => (
            <button
              key={k}
              className={kind === k ? "active" : ""}
              onClick={() => setKind(k)}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
      <div className="script-grid">
        {scripts
          .filter((s) => kind === "All systems" || s.kind === kind)
          .map((s) => (
            <ScriptCard key={s.id} script={s} />
          ))}
      </div>
      <Section
        title="Names with a meaning"
        subtitle="Some letter names preserve words or descriptions. Select one to explore its meaning and history."
      >
        <div className="meaning-examples">
          {["phoenician-aleph", "hebrew-bet", "hebrew-ayin", "greek-omega"].map(
            (id) => {
              const letter = graphemes.find((g) => g.id === id)!;
              const script = scripts.find((s) => s.id === letter.scriptId)!;
              return (
                <button key={id} onClick={() => go(`/letter/${id}`)}>
                  <Glyph
                    className="meaning-glyph"
                    text={letter.symbol}
                    scriptId={letter.scriptId}
                  />
                  <span>
                    <strong>
                      {letter.name} → {letter.meaning?.text}
                    </strong>
                    <small>{script.name} · Letter-name meaning</small>
                  </span>
                  <ArrowRight size={16} />
                </button>
              );
            },
          )}
        </div>
      </Section>
      <div className="note-strip">
        <Network size={20} />
        <span>
          <b>Curious how they connect?</b> Follow the family tree of early
          Mediterranean scripts.
        </span>
        <button className="text-button" onClick={() => go("/genealogy")}>
          Explore genealogy <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}
