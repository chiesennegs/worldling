import { ChevronLeft, ArrowRight } from "lucide-react";
import { entityById, related } from "../data/graph";
import { collectionForPlace } from "../data/subdivision-collections";
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
  const { collection, subdivision: state } = collectionForPlace(id);
  const parents = related(
    id,
    entity.type === "capital" ? "HAS_CAPITAL" : "HAS_SUBDIVISION",
    true,
  );
  const capitals = related(id, "HAS_CAPITAL");
  return (
    <>
      <button
        className="back"
        onClick={() => go(state ? "/world/states" : "/world")}
      >
        <ChevronLeft size={16} />
        {state
          ? `${collection?.countryName} ${collection?.divisionPlural} & capitals`
          : "World & places"}
      </button>
      <PageTitle
        eyebrow={`PLACES / ${collection ? `${collection.countryName.toUpperCase()} / ` : ""}${entity.type === "capital" ? "CAPITAL CITY" : state ? state.kind.toUpperCase() : "STATE / PROVINCE"}`}
        title={entity.name}
        description={
          entity.type === "capital"
            ? `Capital of ${parents.map((p) => p.entity.name).join(", ")}.`
            : state
              ? `${state.name} is a ${state.kind} of ${collection!.countryName}.`
              : "A first-level subdivision."
        }
      >
        <Save id={id} saved={saved} bookmark={bookmark} />
      </PageTitle>
      {state && (
        <div className="facts">
          <Fact label={state.kind.toUpperCase()} value={state.name} />
          <Fact
            label={`${state.kind.toUpperCase()} CAPITAL`}
            value={state.capital}
          />
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
            <EntityLink
              entity={entityById.get(`country-${collection!.countryCode}`)!}
            />
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
      {collection?.practiceQuizId && (
        <button
          className="primary"
          onClick={() => go(`/quiz/${collection!.practiceQuizId}`)}
        >
          Practice {collection.divisionPlural} and capitals
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
