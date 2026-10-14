import { ChevronLeft } from "lucide-react";
import { PageTitle, Source } from "../components/ui";
import StatesTable from "../components/StatesTable";
import { stateSource } from "../data/us-states";
import { go } from "../navigation";
export default function States() {
  return (
    <>
      <button className="back" onClick={() => go("/world")}>
        <ChevronLeft size={16} />
        World & places
      </button>
      <PageTitle
        eyebrow="PLACES / UNITED STATES"
        title="Fifty states. Fifty capitals."
        description="Explore the United States, one state and capital at a time. Washington, D.C. is the federal district and is not included among the 50 states."
      />
      <StatesTable />
      <Source items={[stateSource]} />
    </>
  );
}
