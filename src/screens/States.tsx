import { useState } from "react";
import { Source } from "../components/ui";
import StatesTable from "../components/StatesTable";
import { subdivisionCollections } from "../data/subdivision-collections";
export default function States() {
  const [countryCode, setCountryCode] = useState(
    subdivisionCollections[0].countryCode,
  );
  const collection = subdivisionCollections.find(
    (c) => c.countryCode === countryCode,
  )!;
  return (
    <section aria-label="States, provinces and capitals">
      <div className="section-title">
        <h2>States, provinces & capitals</h2>
        <label className="select-label">
          Country{" "}
          <select
            aria-label="Country for states and provinces"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            {subdivisionCollections.map((c) => (
              <option key={c.countryCode} value={c.countryCode}>
                {c.countryName}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="muted">{collection.description}</p>
      <StatesTable key={countryCode} collection={collection} />
      <Source items={collection.sources} />
    </section>
  );
}
