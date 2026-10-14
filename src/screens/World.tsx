import { useState } from "react";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { countries, languages } from "../data/knowledge";
import { go } from "../navigation";
import { PageTitle } from "../components/ui";
import WorldMap from "../Map";

export default function World() {
  const [region, setRegion] = useState("All regions");
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState("Map");
  const list = countries
    .filter(
      (c) =>
        (region === "All regions" || c.region === region) &&
        c.name.toLowerCase().includes(filter.toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <PageTitle
        eyebrow="EXPLORE / PLACES"
        title="Find your place in the world."
        description="Every border opens a door to languages, symbols, and stories."
      />
      <div className="toolbar">
        <div className="tabs">
          {["Map", "Countries", "Flags", "States"].map((t) => (
            <button
              key={t}
              className={t === tab ? "active" : ""}
              onClick={() => (t === "States" ? go("/states") : setTab(t))}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="select-label">
          <SlidersHorizontal size={15} />
          <select
            aria-label="Filter by region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {[
              "All regions",
              "Africa",
              "Americas",
              "Asia",
              "Europe",
              "Oceania",
              "Antarctic",
            ].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>
      {tab === "Map" && (
        <>
          <WorldMap onCountry={(id) => go(`/country/${id}`)} region={region} />
          <p className="muted map-note">
            Drag to pan; use + / − to zoom. Country names appear from 2× zoom as
            space allows. Zoom up to 16× for small countries; from 4×, leader
            lines connect displaced labels to their locations. Places absent
            from the coarse boundary map use geographic anchors and clickable
            names. Boundaries reflect Natural Earth’s de facto map, not a
            political position.
          </p>
        </>
      )}
      <div className="section-title">
        <h2>
          {tab === "Flags"
            ? "A world of flags"
            : "Country & territory directory"}{" "}
          <span className="count">{list.length}</span>
        </h2>
        <input
          className="filter-input"
          placeholder="Filter places…"
          aria-label="Filter countries"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className={tab === "Flags" ? "flag-grid" : "country-grid"}>
        {list.map((c) => (
          <button
            className="country-card"
            key={c.cca3}
            onClick={() => go(`/country/${c.cca3}`)}
          >
            <span>{c.flag}</span>
            <div>
              <strong>{c.name}</strong>
              <small>
                {c.capital.join(" · ") || "No designated capital"} · {c.region}
              </small>
            </div>
            <ArrowUpRight size={15} />
          </button>
        ))}
      </div>
      {!list.length && <p>No places match this filter.</p>}
    </>
  );
}
