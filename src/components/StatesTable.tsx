import { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import {
  subdivisionCollections,
  type SubdivisionCollection,
} from "../data/subdivision-collections";
import { go } from "../navigation";
export default function StatesTable({
  collection = subdivisionCollections[0],
}: {
  collection?: SubdivisionCollection;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"name" | "capital">("name");
  const showKind = new Set(collection.entries.map((s) => s.kind)).size > 1;
  const list = collection.entries
    .filter((s) =>
      `${s.name} ${s.code} ${s.capital} ${s.kind}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) => a[sort].localeCompare(b[sort]));
  return (
    <>
      <div className="toolbar state-toolbar">
        <input
          className="filter-input"
          aria-label={`Filter ${collection.countryName} ${collection.divisionPlural} and capitals`}
          placeholder="Find a place or capital…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className="select-label">
          Sort by{" "}
          <select
            aria-label={`Sort ${collection.countryName} ${collection.divisionPlural}`}
            value={sort}
            onChange={(e) => setSort(e.target.value as "name" | "capital")}
          >
            <option value="name">{collection.divisionLabel}</option>
            <option value="capital">Capital</option>
          </select>
        </label>
      </div>
      <div className="table-scroll">
        <table className="states-table">
          <caption>
            {list.length} of {collection.entries.length}{" "}
            {collection.countryName} {collection.divisionPlural}. Select a place
            or its capital to explore.
          </caption>
          <thead>
            <tr>
              <th scope="col">{collection.divisionLabel}</th>
              {showKind && <th scope="col">Type</th>}
              <th scope="col">Code</th>
              <th scope="col">Capital</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td>
                  <button onClick={() => go(`/place/${s.id}`)}>
                    {s.name}
                    <ArrowUpRight size={13} />
                  </button>
                </td>
                {showKind && <td>{s.kind}</td>}
                <td>{s.code}</td>
                <td>
                  <button onClick={() => go(`/place/${s.capitalId}`)}>
                    {s.capital}
                    <ArrowUpRight size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!list.length && (
        <p className="muted">No places or capitals match this search.</p>
      )}
      {collection.practiceQuizId && (
        <button
          className="text-button state-practice"
          onClick={() => go(`/quiz/${collection.practiceQuizId}`)}
        >
          Practice {collection.divisionPlural} and capitals{" "}
          <ArrowRight size={16} />
        </button>
      )}
    </>
  );
}
