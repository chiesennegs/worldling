import type { ComparisonSort } from "./alphabets";

/** Header presses cycle native order forward, reverse, then correspondence. */
export function nextComparisonSort(
  current: ComparisonSort | undefined,
  alphabetId: string,
): ComparisonSort | undefined {
  if (current?.alphabetId !== alphabetId)
    return { alphabetId, direction: "asc" };
  return current.direction === "asc"
    ? { alphabetId, direction: "desc" }
    : undefined;
}
export function comparisonSortAction(
  current: ComparisonSort | undefined,
  alphabetId: string,
) {
  const next = nextComparisonSort(current, alphabetId);
  return next
    ? `Sort ${next.direction === "asc" ? "forward" : "reverse"} by`
    : "Restore correspondence order from";
}
