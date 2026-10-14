import { ArrowRight } from "lucide-react";
import { scripts, relationships, writingSystems } from "../data/knowledge";
import { entityById, related } from "../data/graph";
import { go } from "../navigation";
import { EntityLink, PageTitle, Section, ScriptCard } from "../components/ui";

export default function LanguageDetail({ id }: { id: string }) {
  const l = entityById.get(id);
  if (!l) return <p>Language not found.</p>;
  const ss = related(id, "USES_SCRIPT");
  const places = related(id, "SPOKEN_IN");
  return (
    <>
      <PageTitle
        eyebrow="EXPLORE / LANGUAGE"
        title={l.name}
        description="A language connects people. Writing gives those connections another form."
      />
      <Section title="Ways to write it">
        <div className="script-grid">
          {ss.length ? (
            ss.map((r) => (
              <ScriptCard
                key={r.entity.id}
                script={scripts.find((s) => s.id === r.entity.id)!}
              />
            ))
          ) : (
            <p className="muted">
              The script relationships for this language have not yet been
              curated.
            </p>
          )}
        </div>
        {writingSystems
          .filter((w) => w.languageIds.includes(id))
          .map((w) => (
            <p className="muted" key={w.id}>
              {w.name} writing system · {w.kind}
            </p>
          ))}
      </Section>
      <Section
        title="A language across places"
        subtitle="Countries and territories where this language is listed in our source. This is not an exhaustive map of its speakers."
      >
        <div className="entity-grid">
          {places.length ? (
            places.map((r) => (
              <EntityLink key={r.entity.id} entity={r.entity} />
            ))
          ) : (
            <p className="muted">
              This historical language has no modern country association in the
              index.
            </p>
          )}
        </div>
      </Section>
      {id === "ara" && (
        <button className="primary" onClick={() => go("/word")}>
          Explore an Arabic word <ArrowRight size={16} />
        </button>
      )}
    </>
  );
}
