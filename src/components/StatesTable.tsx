import { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { usStates } from "../data/us-states";
import { go } from "../navigation";
export default function StatesTable() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"name" | "capital">("name");
  const list = usStates
    .filter((s) =>
      `${s.name} ${s.code} ${s.capital}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) => a[sort].localeCompare(b[sort]));
  return (
    <>
      <div className="toolbar state-toolbar">
        <input
          className="filter-input"
          aria-label="Filter U.S. states and capitals"
          placeholder="Find a state or capital…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className="select-label">
          Sort by{" "}
          <select
            aria-label="Sort U.S. states"
            value={sort}
            onChange={(e) => setSort(e.target.value as "name" | "capital")}
          >
            <option value="name">State</option>
            <option value="capital">Capital</option>
          </select>
        </label>
      </div>
      <div className="table-scroll">
        <table className="states-table">
          <caption>
            {list.length} of 50 U.S. states. Select a state or its capital to
            explore.
          </caption>
          <thead>
            <tr>
              <th scope="col">State</th>
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
        <p className="muted">No states or capitals match this search.</p>
      )}
      <button
        className="text-button state-practice"
        onClick={() => go("/quiz/state-capitals")}
      >
        Practice state capitals <ArrowRight size={16} />
      </button>
    </>
  );
}
