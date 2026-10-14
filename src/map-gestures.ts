export type MapPoint = { x: number; y: number };
export type MapView = { zoom: number; pan: MapPoint };
const center = { x: 500, y: 267 };
export function zoomMapAt(
  view: MapView,
  from: MapPoint,
  to: MapPoint,
  zoom: number,
): MapView {
  const nextZoom = Math.max(1, Math.min(16, zoom));
  const ratio = nextZoom / view.zoom;
  return {
    zoom: nextZoom,
    pan: {
      x: to.x - center.x - (from.x - center.x - view.pan.x) * ratio,
      y: to.y - center.y - (from.y - center.y - view.pan.y) * ratio,
    },
  };
}
/** Convert client coordinates to the SVG's centered, aspect-preserving viewBox. */
export function mapPoint(
  client: MapPoint,
  rect: { left: number; top: number; width: number; height: number },
): MapPoint {
  const scale = Math.min(rect.width / 1000, rect.height / 535);
  return {
    x: (client.x - rect.left - (rect.width - 1000 * scale) / 2) / scale,
    y: (client.y - rect.top - (rect.height - 535 * scale) / 2) / scale,
  };
}
export class MapGestures {
  view: MapView = { zoom: 1, pan: { x: 0, y: 0 } };
  moved = false;
  private points = new Map<number, MapPoint>();
  private start?: { view: MapView; point: MapPoint; distance?: number };
  private rebase() {
    const points = [...this.points.values()];
    if (!points.length) {
      this.start = undefined;
      return;
    }
    const a = points[0],
      b = points[1];
    this.start = {
      view: this.view,
      point: b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a,
      distance: b ? Math.hypot(b.x - a.x, b.y - a.y) : undefined,
    };
  }
  down(id: number, point: MapPoint) {
    if (!this.points.size) this.moved = false;
    this.points.set(id, point);
    if (this.points.size > 1) this.moved = true;
    this.rebase();
  }
  move(id: number, point: MapPoint, unitsPerPixel = 1): MapView {
    if (!this.points.has(id) || !this.start) return this.view;
    this.points.set(id, point);
    const [a, b] = [...this.points.values()];
    if (b && this.start.distance) {
      const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const distance = Math.hypot(b.x - a.x, b.y - a.y);
      this.view = zoomMapAt(
        this.start.view,
        this.start.point,
        midpoint,
        (this.start.view.zoom * distance) / this.start.distance,
      );
      this.moved = true;
    } else {
      const dx = a.x - this.start.point.x,
        dy = a.y - this.start.point.y;
      if (this.moved || Math.hypot(dx, dy) > 4 * unitsPerPixel) {
        this.moved = true;
        this.view = {
          zoom: this.start.view.zoom,
          pan: { x: this.start.view.pan.x + dx, y: this.start.view.pan.y + dy },
        };
      }
    }
    return this.view;
  }
  up(id: number) {
    this.points.delete(id);
    this.rebase();
  }
  zoomAt(point: MapPoint, zoom: number) {
    this.view = zoomMapAt(this.view, point, point, zoom);
    this.rebase();
    return this.view;
  }
  reset() {
    this.view = { zoom: 1, pan: { x: 0, y: 0 } };
    this.points.clear();
    this.start = undefined;
    return this.view;
  }
}
