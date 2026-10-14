import { Source } from "../components/ui";
import StatesTable from "../components/StatesTable";
import { subdivisionCollections } from "../data/subdivision-collections";
export default function States({
  countryCode = "USA",
  onCountryChange,
}: {
  countryCode?: string;
  onCountryChange?: (code: string) => void;
}) {
  const collection =
    subdivisionCollections.find((c) => c.countryCode === countryCode) ||
    subdivisionCollections[0];
  return (
    <section aria-label="Administrative subdivisions and capitals">
      <div className="section-title">
        <h2>
          {collection.countryName}: {collection.divisionPlural}
        </h2>
        <label className="select-label">
          Country{" "}
          <select
            aria-label="Country for subdivisions"
            value={collection.countryCode}
            onChange={(e) => onCountryChange?.(e.target.value)}
          >
            {[...subdivisionCollections]
              .sort((a, b) => a.countryName.localeCompare(b.countryName))
              .map((c) => (
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
