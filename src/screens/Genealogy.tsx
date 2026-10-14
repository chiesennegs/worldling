import { Glyph, useLetterForms } from "../components/LetterForms";
import { handwritingStyles, letterVariants } from "../data/handwriting";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { scripts, relationships } from "../data/knowledge";
import { related } from "../data/graph";
import type { Script } from "../data/schema";
import { go } from "../navigation";
import { EntityLink, Source, PageTitle, Section } from "../components/ui";

export default function Genealogy() {
  const { mode } = useLetterForms();
  const [selected, setSelected] = useState("phoenician");
  const s = scripts.find((s) => s.id === selected)!;
  const positions: Record<string, [number, number]> = {
    "proto-sinaitic": [450, 28],
    phoenician: [450, 136],
    greek: [190, 248],
    aramaic: [710, 248],
    etruscan: [100, 360],
    cyrillic: [330, 472],
    hebrew: [580, 360],
    nabataean: [840, 360],
    latin: [100, 472],
    arabic: [840, 472],
  };
  return (
    <>
      <PageTitle
        eyebrow="EXPLORE / SCRIPT GENEALOGY"
        title="Writing runs in the family."
        description="Follow the branches of a shared history. Select a script to uncover its connections."
      />
      <div className="genealogy-layout">
        <div className="tree-panel">
          <div className="tree-legend">
            <span>
              <i />
              Historical descent
            </span>
            <span>Approximate emergence · not to scale</span>
          </div>
          <svg viewBox="0 0 1040 580" aria-label="Script family tree">
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M0 0L10 5L0 10" fill="#a0ae98" />
              </marker>
            </defs>
            {relationships
              .filter((r) => r.type === "DERIVED_FROM")
              .map((r) => {
                const a = positions[r.to],
                  b = positions[r.from];
                return (
                  a &&
                  b && (
                    <path
                      key={r.from}
                      d={`M${a[0]} ${a[1] + 62} V${(a[1] + b[1] + 62) / 2} H${b[0]} V${b[1]}`}
                      fill="none"
                      stroke="#a0ae98"
                      strokeWidth="1.6"
                      markerEnd="url(#arrow)"
                    />
                  )
                );
              })}
            {Object.entries(positions).map(([id, [x, y]]) => {
              const n = scripts.find((s) => s.id === id)!;
              return (
                <g
                  key={id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Explore ${n.name}`}
                  className={`tree-node ${selected === id ? "selected" : ""}`}
                  transform={`translate(${x - 86},${y})`}
                  onClick={() => setSelected(id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(id);
                    }
                  }}
                >
                  <rect width="172" height="65" rx="8" />
                  <text x="15" y="26" className="tree-name">
                    {n.name}
                  </text>
                  <text x="15" y="47" className="tree-date">
                    {n.period}
                  </text>
                  {letterVariants(id, mode).map((variant, i, variants) => (
                    <text
                      key={variant}
                      x="149"
                      y={variants.length === 2 ? 25 + i * 25 : 37}
                      className="tree-symbol"
                      style={
                        variant === "handwritten"
                          ? { fontFamily: `"${handwritingStyles[id].family}"` }
                          : undefined
                      }
                    >
                      {id === "proto-sinaitic" ? "◌" : n.sample.slice(0, 2)}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
          <p>
            One representative family, not a complete history of writing. Early
            alphabetic origins remain debated. Ancient direction and letter
            shapes vary by inscription.
          </p>
        </div>
        <aside className="tree-detail">
          <span className="tag">{s.kind}</span>
          <div className="tree-big-glyph">
            <Glyph text={s.sample} scriptId={s.id} />
          </div>
          <h2>{s.name}</h2>
          <p>{s.description}</p>
          <small className="eyebrow">{s.period}</small>
          <button className="primary" onClick={() => go(`/script/${s.id}`)}>
            Explore this script <ArrowUpRight size={16} />
          </button>
          <Section title="Earlier connections">
            {related(s.id, "DERIVED_FROM").map((r) => (
              <EntityLink key={r.entity.id} entity={r.entity} small />
            ))}
            {!related(s.id, "DERIVED_FROM").length && (
              <p className="muted">
                Earliest node in this representative collection.
              </p>
            )}
          </Section>
          <Source items={s.provenance} />
        </aside>
      </div>
    </>
  );
}
