import { Glyph } from "./LetterForms";
import { ArrowUpRight, Bookmark } from "lucide-react";
import type { Entity, Script, Provenance } from "../data/schema";
import { go, entityPath } from "../navigation";

export function EntityLink({
  entity,
  small = false,
}: {
  entity: Entity;
  small?: boolean;
}) {
  return (
    <button
      className={`entity-link ${small ? "small" : ""}`}
      onClick={() => go(entityPath(entity))}
    >
      {entity.symbol && (
        <span className="entity-symbol">
          {["grapheme", "word", "script"].includes(entity.type) ? (
            <Glyph
              text={entity.symbol}
              scriptId={
                entity.type === "script"
                  ? entity.id
                  : (entity as Entity & { scriptId: string }).scriptId
              }
            />
          ) : (
            entity.symbol
          )}
        </span>
      )}
      <span>
        <strong>{entity.name}</strong>
        <small>{entity.type.replace("-", " ")}</small>
      </span>
      <ArrowUpRight size={16} />
    </button>
  );
}

export function Source({ items }: { items?: Provenance[] }) {
  return items?.length ? (
    <details className="sources">
      <summary>Sources & historical notes</summary>
      {items.map((s, i) => (
        <p key={i}>
          <a href={s.sourceURL} target="_blank" rel="noreferrer">
            {s.source} ↗
          </a>
          {s.confidence && <small>Confidence: {s.confidence}</small>}
          {s.notes && <span>{s.notes}</span>}
          {s.disputed && <b>Disputed interpretation</b>}
        </p>
      ))}
    </details>
  ) : null;
}

export function PageTitle({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

export function Save({
  id,
  saved,
  bookmark,
}: {
  id: string;
  saved: string[];
  bookmark: (id: string) => void;
}) {
  return (
    <button
      className={`secondary ${saved.includes(id) ? "is-saved" : ""}`}
      onClick={() => bookmark(id)}
    >
      <Bookmark size={16} fill={saved.includes(id) ? "currentColor" : "none"} />
      {saved.includes(id) ? "Saved" : "Save discovery"}
    </button>
  );
}

export function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="detail-section">
      <h2>{title}</h2>
      {subtitle && <p className="muted">{subtitle}</p>}
      {children}
    </section>
  );
}

export function ScriptCard({ script: s }: { script: Script }) {
  return (
    <button
      className={`script-card ${s.id === "arabic" ? "arabic-card" : ""}`}
      onClick={() => go(`/script/${s.id}`)}
    >
      <div className="script-card-top">
        <span className="tag">{s.kind}</span>
        <ArrowUpRight size={16} />
      </div>
      <div className="script-sample" dir={s.direction}>
        <Glyph text={s.sample} scriptId={s.id} dir={s.direction} />
      </div>
      <h3>{s.name}</h3>
      <p>
        {s.period} <span>·</span>{" "}
        {s.direction === "rtl" ? "Right to left" : "Left to right"}
      </p>
    </button>
  );
}
