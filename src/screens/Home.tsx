import { Glyph } from "../components/LetterForms";
import {
  Globe2,
  Network,
  GraduationCap,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  Type,
} from "lucide-react";
import { countries, scripts, languages } from "../data/knowledge";
import type { Progress } from "../data/schema";
import { go } from "../navigation";
import { PageTitle } from "../components/ui";
import WorldMap from "../Map";

export default function Home({ progress }: { progress: Progress }) {
  return (
    <>
      <PageTitle
        eyebrow="YOUR NEXT DISCOVERY STARTS HERE"
        title="The world is full of connections."
        description="Follow a place to a language. A letter to its origins. See where curiosity takes you."
      >
        <span className="edition">
          THE EXPLORER’S EDITION <span>01 / A WORLD IN WRITING</span>
        </span>
      </PageTitle>
      <div className="home-grid">
        <section className="atlas-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">START SOMEWHERE. GO ANYWHERE.</span>
              <h2>One world. Countless stories.</h2>
            </div>
            <button className="text-button" onClick={() => go("/world")}>
              Open atlas <ArrowUpRight size={17} />
            </button>
          </div>
          <WorldMap onCountry={(id) => go(`/country/${id}`)} />
          <div className="atlas-caption">
            <span>
              <span className="legend-dot" /> A few places to begin
            </span>
            <span>
              {countries.filter((c) => c.independent).length} independent states{" "}
              <span>·</span> {languages.length} languages in the index
            </span>
          </div>
        </section>
        <aside className="discovery-card">
          <div className="eyebrow">
            <span className="spark">✳</span> A LETTER’S LONG JOURNEY
          </div>
          <div className="hero-glyph">
            <div className="hero-letter-forms">
              <Glyph text="A" scriptId="latin" />
            </div>
            <span>𐤀</span>
          </div>
          <h2>Before A was A.</h2>
          <p>
            From an ancient letter to a symbol you use every day. Follow a story
            nearly 3,000 years in the making.
          </p>
          <div className="mini-evolution">
            <span>
              𐤀<small>Phoenician</small>
            </span>
            <ArrowRight size={17} />
            <span>
              <Glyph text="Α" scriptId="greek" />
              <small>Greek</small>
            </span>
            <ArrowRight size={17} />
            <span>
              <Glyph text="A" scriptId="latin" />
              <small>Latin</small>
            </span>
          </div>
          <button onClick={() => go("/letter/latin-a")}>
            Follow the letter <ArrowUpRight size={18} />
          </button>
        </aside>
      </div>
      <section className="exploration-section">
        <div className="section-title">
          <h2>Pick a thread. Start exploring.</h2>
          <span>EVERYTHING IS CONNECTED</span>
        </div>
        <div className="entry-grid">
          <button className="entry-card places" onClick={() => go("/world")}>
            <div className="card-top">
              <span className="entry-icon">
                <Globe2 size={21} />
              </span>
              <ArrowUpRight size={19} />
            </div>
            <div className="entry-art flags">
              🇯🇵 <span>🇵🇹</span> 🇱🇧
            </div>
            <h3>Places & people</h3>
            <p>
              Countries, capitals, flags, and the languages that bring them to
              life.
            </p>
            <span className="entry-bottom">
              EXPLORE THE WORLD <ArrowRight size={15} />
            </span>
          </button>
          <button className="entry-card writing" onClick={() => go("/writing")}>
            <div className="card-top">
              <span className="entry-icon">
                <Type size={21} />
              </span>
              <ArrowUpRight size={19} />
            </div>
            <div className="entry-art glyphs">
              <Glyph text="अ" scriptId="devanagari" />{" "}
              <Glyph text="ع" scriptId="arabic" />{" "}
              <Glyph text="あ" scriptId="hiragana" />
            </div>
            <h3>A world in writing</h3>
            <p>
              Meet the scripts, letters, and symbols that give language a
              visible form.
            </p>
            <span className="entry-bottom">
              EXPLORE WRITING <ArrowRight size={15} />
            </span>
          </button>
          <button className="entry-card roots" onClick={() => go("/genealogy")}>
            <div className="card-top">
              <span className="entry-icon">
                <Network size={21} />
              </span>
              <ArrowUpRight size={19} />
            </div>
            <div className="entry-art root-art">
              <span>𐤀</span>
              <div>↙ &nbsp; ↘</div>
              <span>
                <Glyph text="Α" scriptId="greek" />{" "}
                <Glyph text="א" scriptId="hebrew" />
              </span>
            </div>
            <h3>Every script has a story</h3>
            <p>
              Trace family trees and follow the paths of writing across time.
            </p>
            <span className="entry-bottom">
              DISCOVER THE CONNECTIONS <ArrowRight size={15} />
            </span>
          </button>
        </div>
      </section>
      <div className="bottom-grid">
        <section className="journey-panel">
          <div className="section-title">
            <h2>A trail worth following</h2>
            <span>CURATED CONNECTION</span>
          </div>
          <div className="trail">
            <button onClick={() => go("/country/LBN")}>
              <span className="trail-symbol">🇱🇧</span>
              <strong>Lebanon</strong>
              <small>A place</small>
            </button>
            <ChevronRight />
            <button onClick={() => go("/language/ara")}>
              <span className="trail-symbol">
                <Glyph className="arabic" text="ع" scriptId="arabic" />
              </span>
              <strong>Arabic</strong>
              <small>A language</small>
            </button>
            <ChevronRight />
            <button onClick={() => go("/letter/arabic-alif")}>
              <span className="trail-symbol">
                <Glyph text="ا" scriptId="arabic" />
              </span>
              <strong>Alif</strong>
              <small>A letter</small>
            </button>
            <ChevronRight />
            <button onClick={() => go("/letter/phoenician-aleph")}>
              <span className="trail-symbol">𐤀</span>
              <strong>Aleph</strong>
              <small>An ancestor</small>
            </button>
            <button
              className="trail-arrow"
              aria-label="Explore the trail"
              onClick={() => go("/country/LBN")}
            >
              <ArrowUpRight size={22} />
            </button>
          </div>
          <p>Thousands of years. One connected story.</p>
        </section>
        <section className="practice-prompt">
          <div className="practice-icon">
            <GraduationCap size={25} />
          </div>
          <div>
            <span className="eyebrow">A LITTLE PLAY. A LOT OF DISCOVERY.</span>
            <h3>Put your curiosity to the test.</h3>
            <p>
              {progress.attempts
                ? `${progress.correct} discoveries remembered. Ready for a few more?`
                : "Flags, capitals, letters. What will you learn today?"}
            </p>
            <button className="text-button" onClick={() => go("/learn")}>
              Let’s play <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
