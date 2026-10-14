import { demographics, wikipediaURL } from "../data/demographics";
import StatesTable from "../components/StatesTable";
import { ArrowRight, ChevronLeft, MapPin, Lightbulb } from "lucide-react";
import { countries, scripts, languages, subdivisions } from "../data/knowledge";
import { entityById, related } from "../data/graph";
import type { Entity } from "../data/schema";
import { go } from "../navigation";
import {
  EntityLink,
  Source,
  PageTitle,
  Save,
  Fact,
  Section,
  ScriptCard,
} from "../components/ui";
import WorldMap from "../Map";

export default function CountryDetail({
  id,
  saved,
  bookmark,
}: {
  id: string;
  saved: string[];
  bookmark: (id: string) => void;
}) {
  const c = countries.find((c) => c.cca3 === id);
  if (!c) return <p>Place not found.</p>;
  const profile = demographics[id];
  const ls = Object.keys(c.languages)
    .map((l) => entityById.get(l))
    .filter(Boolean) as Entity[];
  const scriptIds = [
    ...new Set(
      ls.flatMap((l) => related(l.id, "USES_SCRIPT").map((x) => x.entity.id)),
    ),
  ];
  return (
    <>
      <button className="back" onClick={() => go("/world")}>
        <ChevronLeft size={16} />
        Back to the atlas
      </button>
      <PageTitle
        eyebrow={`${c.region.toUpperCase()} / ${c.subregion.toUpperCase()}`}
        title={`${c.flag} ${c.name}`}
        description="A place is the beginning of a thousand connections."
      >
        <Save id={`country-${id}`} saved={saved} bookmark={bookmark} />
      </PageTitle>
      <div className="detail-grid">
        <div>
          <div className="facts">
            <Fact
              label="CAPITAL"
              value={c.capital.join(" / ") || "None designated"}
            />
            <Fact label="REGION" value={c.region} />
            <Fact label="LANGUAGES LISTED" value={String(ls.length)} />
          </div>
          <Section
            title="People & government"
            subtitle="Dated reference figures from the archived World Factbook. Estimate and survey years are shown with each figure; government descriptions may have changed."
          >
            <dl className="demographic-facts">
              {(
                [
                  ["Population", profile.population],
                  ["Establishment / independence", profile.establishment],
                  ["Government", profile.government],
                  ["Religious affiliation", profile.religion],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value || "Not yet curated"}</dd>
                </div>
              ))}
            </dl>
            {profile.populationNote && (
              <p className="muted">
                Population scope: {profile.populationNote}
              </p>
            )}
            <p className="muted">
              Formation and independence can involve several dates; religious
              affiliation describes population estimates rather than a single
              national religion.
            </p>
            {profile.sourceURL && (
              <p>
                <a
                  href={profile.sourceURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  World Factbook profile (public-domain archive)
                </a>{" "}
                · Retrieved {profile.retrieved}
              </p>
            )}
            <a
              className="text-button"
              href={wikipediaURL(id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read about {c.name} on Wikipedia ↗
            </a>
          </Section>
          <Section
            title="The languages of this place"
            subtitle="Follow a language into the way it is written."
          >
            <div className="entity-grid">
              {ls.map((l) => (
                <EntityLink key={l.id} entity={l} />
              ))}
            </div>
          </Section>
          <Section title="A place in writing">
            <div className="script-grid compact">
              {scriptIds.length ? (
                scriptIds.map((id) => (
                  <ScriptCard
                    key={id}
                    script={scripts.find((s) => s.id === id)!}
                  />
                ))
              ) : (
                <p className="muted">
                  Writing connections for these languages are still being
                  curated.
                </p>
              )}
            </div>
          </Section>
          <Section title="Across the border">
            <div className="entity-grid">
              {c.borders.length ? (
                c.borders
                  .map((code) => entityById.get(`country-${code}`))
                  .filter(Boolean)
                  .map((e) => <EntityLink key={e!.id} entity={e!} />)
              ) : (
                <p className="muted">No land borders listed.</p>
              )}
            </div>
          </Section>
          {subdivisions[id] && (
            <Section
              title="A closer look"
              subtitle={
                id === "USA"
                  ? "All 50 states and their capitals."
                  : "A representative selection of first-level subdivisions."
              }
            >
              {id === "USA" ? (
                <StatesTable />
              ) : (
                <div className="chips">
                  {subdivisions[id].map((s) => (
                    <span className="chip" key={s}>
                      <MapPin size={14} />
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </Section>
          )}
          <Source
            items={[
              {
                source: "mledoze/countries — country metadata (ODbL)",
                sourceURL: "https://github.com/mledoze/countries",
                notes:
                  "Languages reflect the source index, not an exhaustive list of every community language. Multiple capitals and disputed status follow the source.",
              },
            ]}
          />
        </div>
        <aside>
          <WorldMap onCountry={(id) => go(`/country/${id}`)} selected={id} />
          <div className="note-card">
            <Lightbulb size={22} />
            <h3>Keep following the thread.</h3>
            <p>
              Countries hold many languages. Languages can use several scripts.
              Every connection leads somewhere new.
            </p>
            <button className="text-button" onClick={() => go("/learn")}>
              Try a geography quiz <ArrowRight size={16} />
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
