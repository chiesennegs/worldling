export interface MapLabel {
  id: string;
  name: string;
  point: [number, number];
  area: number;
  anchor?: [number, number];
}
/** Keep ocean type at 10 CSS pixels, independent of geographic zoom. */
export function oceanLabelStyle(zoom: number, mapWidth: number) {
  const unitsPerPixel = 1000 / Math.max(1, mapWidth) / zoom;
  return { fontSize: 10 * unitsPerPixel, letterSpacing: 1.2 * unitsPerPixel };
}
export const countryLabelZoom = 2;
export const countryLabelFontSize = 14;
export const countryLabelMaxZoom = 16;

/** Place readable labels in screen/viewBox space. At close zooms, short leader
 * lines allow small countries to escape collisions without overlapping text.
 * Geographic point anchors (area=0) fill gaps in the coarse boundary dataset.
 */
export function visibleCountryLabels(
  candidates: MapLabel[],
  zoom: number,
  pan: { x: number; y: number },
  fontSize = countryLabelFontSize,
): MapLabel[] {
  if (zoom < countryLabelZoom) return [];
  const placed: { left: number; right: number; top: number; bottom: number }[] =
    [];
  const result: MapLabel[] = [];
  for (const label of [...candidates].sort(
    (a, b) => b.area - a.area || a.name.localeCompare(b.name),
  )) {
    if (zoom < 4 && label.area * zoom * zoom < 65) continue;
    const x = 500 + pan.x + (label.point[0] - 500) * zoom;
    const y = 267 + pan.y + (label.point[1] - 267) * zoom;
    if (![x, y].every(Number.isFinite) || x < 4 || x > 996 || y < 25 || y > 507)
      continue;
    const width = label.name.length * fontSize * 0.6 + 10;
    const offsets: [number, number][] = [[0, 0]];
    if (zoom >= 4) {
      for (const distance of [2, 4, 6]) {
        const dy = fontSize * distance;
        offsets.push(
          [0, -dy],
          [0, dy],
          [width / 2 + 8, -dy],
          [-width / 2 - 8, dy],
        );
      }
    }
    for (const [dx, dy] of offsets) {
      const box = {
        left: x + dx - width / 2,
        right: x + dx + width / 2,
        top: y + dy - fontSize * 0.9,
        bottom: y + dy + fontSize * 0.9,
      };
      if (box.left < 4 || box.right > 996 || box.top < 25 || box.bottom > 507)
        continue;
      if (
        placed.some(
          (other) =>
            box.left < other.right &&
            box.right > other.left &&
            box.top < other.bottom &&
            box.bottom > other.top,
        )
      )
        continue;
      placed.push(box);
      // Labels without polygon geometry always get a small leader to locate them.
      if (label.area === 0 && dx === 0 && dy === 0) {
        placed.pop();
        continue;
      }
      result.push({
        ...label,
        point: [label.point[0] + dx / zoom, label.point[1] + dy / zoom],
        anchor: dx || dy ? label.point : undefined,
      });
      break;
    }
  }
  return result;
}
