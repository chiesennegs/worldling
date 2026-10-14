import { ChevronLeft, ArrowRight } from "lucide-react";
import { entityById, related } from "../data/graph";
import { usStates, stateSource } from "../data/us-states";
import { go } from "../navigation";
import {
  PageTitle,
  Fact,
  EntityLink,
  Section,
  Save,
  Source,
} from "../components/ui";
export default function PlaceDetail({
  id,
  saved,
  bookmark,
}: {
  id: string;
  saved: string[];
  bookmark: (id: string) => void;
}) {
  const entity = entityById.get(id);
  if (!entity) return <p>This place was not found.</p>;
  const state = usStates.find((s) => s.id === id || s.capitalId === id);
  const parents = related(
    id,
    entity.type === "capital" ? "HAS_CAPITAL" : "HAS_SUBDIVISION",
    true,
  );
  const capitals = related(id, "HAS_CAPITAL");
  return (
    <>
      <button className="back" onClick={() => go(state ? "/states" : "/world")}>
        <ChevronLeft size={16} />
        {state ? "U.S. states & capitals" : "World & places"}
      </button>
      <PageTitle
        eyebrow={`PLACES / ${state ? "UNITED STATES / " : ""}${entity.type === "capital" ? "CAPITAL CITY" : "STATE / PROVINCE"}`}
        title={entity.name}
        description={
          entity.type === "capital"
            ? `Capital of ${parents.map((p) => p.entity.name).join(", ")}.`
            : state
              ? `${state.name} is one of the 50 U.S. states.`
              : "A first-level subdivision."
        }
      >
        <Save id={id} saved={saved} bookmark={bookmark} />
      </PageTitle>
      {state && (
        <div className="facts">
          <Fact label="STATE" value={state.name} />
          <Fact label="STATE CAPITAL" value={state.capital} />
          <Fact label="SUBDIVISION CODE" value={state.code} />
        </div>
      )}
      <Section
        title={
          entity.type === "capital"
            ? "The place it serves"
            : "Part of a larger world"
        }
      >
        <div className="entity-grid">
          {parents.map((p) => (
            <EntityLink key={p.entity.id} entity={p.entity} />
          ))}
          {state && entity.type === "capital" && (
            <EntityLink entity={entityById.get("country-USA")!} />
          )}
        </div>
      </Section>
      {capitals.length > 0 && (
        <Section title="Its capital">
          <div className="entity-grid">
            {capitals.map((c) => (
              <EntityLink key={c.entity.id} entity={c.entity} />
            ))}
          </div>
        </Section>
      )}
      {state && (
        <button className="primary" onClick={() => go("/quiz/state-capitals")}>
          Practice state capitals
          <ArrowRight size={16} />
        </button>
      )}
      <Source
        items={
          entity.provenance ||
          state?.provenance ||
          (entity.type === "capital"
            ? [
                {
                  source: "mledoze/countries — country metadata",
                  sourceURL: "https://github.com/mledoze/countries",
                },
              ]
            : undefined)
        }
      />
    </>
  );
}
