import { writingSystems } from "./data/knowledge";
import type { Entity } from "./data/schema";

export function go(path: string) {
  location.hash = path;
  window.scrollTo({ top: 0, behavior: "instant" });
}
export function entityPath(e: Entity) {
  return e.type === "subdivision" || e.type === "capital"
    ? `/place/${e.id}`
    : e.type === "country"
      ? `/country/${e.id.replace("country-", "")}`
      : e.type === "script"
        ? `/script/${e.id}`
        : e.type === "grapheme"
          ? `/letter/${e.id}`
          : e.type === "language"
            ? `/language/${e.id}`
            : e.type === "word"
              ? "/word"
              : e.type === "writing-system"
                ? `/script/${writingSystems.find((w) => w.id === e.id)?.scriptId}`
                : "/world";
}
