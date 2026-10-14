import { useEffect, useMemo, useState, useRef } from "react";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import type { FeatureCollection, Feature } from "geojson";
import { Plus, Minus, LocateFixed } from "lucide-react";
import {
  visibleCountryLabels,
  countryLabelFontSize,
  type MapLabel,
} from "./map-labels";
import { countries } from "./data/knowledge";
export default function WorldMap({
  onCountry,
  selected,
  quiz = false,
  region = "All regions",
}: {
  onCountry: (id: string) => void;
  selected?: string;
  quiz?: boolean;
  region?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mapWidth, setMapWidth] = useState(1000);
  const labelFontSize = Math.max(
    countryLabelFontSize,
    (countryLabelFontSize * 1000) / mapWidth,
  );
  const [world, setWorld] = useState<FeatureCollection>();
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const moved = useRef(false);
  const [hover, setHover] = useState("");
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{
    x: number;
    y: number;
    px: number;
    py: number;
  }>();
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/world.json`)
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(setWorld)
      .catch(() => setError(true));
  }, []);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setMapWidth(entry.contentRect.width);
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);
  const projection = useMemo(
    () => geoNaturalEarth1().scale(175).translate([500, 270]),
    [],
  );
  const path = geoPath(projection);
  function resolve(f: Feature) {
    const p = f.properties;
    return countries.find(
      (c) => c.cca3 === p?.iso || c.cca3 === p?.cca3 || c.name === p?.name,
    );
  }
  const labelCandidates = useMemo(() => {
    const shapes = (world?.features || []).flatMap((feature): MapLabel[] => {
      const country = resolve(feature);
      if (
        !country ||
        feature.properties?.name === "Antarctica" ||
        (region !== "All regions" && country.region !== region)
      )
        return [];
      // Anchor multipart countries to their largest projected landmass, avoiding
      // centroids in the sea between islands or far-flung territories.
      const geometry = feature.geometry;
      const parts =
        geometry?.type === "MultiPolygon"
          ? geometry.coordinates.map((coordinates) => ({
              type: "Polygon" as const,
              coordinates,
            }))
          : geometry
            ? [geometry]
            : [];
      const largest = parts.sort((a, b) => path.area(b) - path.area(a))[0];
      if (!largest) return [];
      return [
        {
          id: country.cca3,
          name: country.name,
          point: path.centroid(largest),
          area: path.area(largest),
        },
      ];
    });
    const represented = new Set(shapes.map((label) => label.id));
    const anchors: MapLabel[] = countries.flatMap((country) => {
      if (
        represented.has(country.cca3) ||
        country.cca3 === "ATA" ||
        (region !== "All regions" && country.region !== region)
      )
        return [];
      const point = projection([country.latlng[1], country.latlng[0]]);
      return point
        ? [{ id: country.cca3, name: country.name, point, area: 0 }]
        : [];
    });
    return [...shapes, ...anchors].filter((label) => label.id !== "PSE");
  }, [world, projection, region]);
  const countryLabels = quiz
    ? []
    : visibleCountryLabels(labelCandidates, zoom, pan, labelFontSize);
  const oceans = [
    { name: "PACIFIC OCEAN", coordinate: [-140, -10] as [number, number] },
    { name: "ATLANTIC OCEAN", coordinate: [-35, -5] as [number, number] },
    { name: "INDIAN OCEAN", coordinate: [80, -30] as [number, number] },
  ];
  return (
    <div className={`map ${quiz ? "quiz-map" : ""}`}>
      <div className="map-top">
        <span>
          <i /> {quiz ? "SELECT A COUNTRY" : "THE WORLD, CONNECTED"}
        </span>
        <span>Natural Earth projection</span>
      </div>
      {error ? (
        <p className="map-error">
          The map could not load. Reload to try again; all places are available
          in the country directory.
        </p>
      ) : (
        <svg
          ref={svgRef}
          viewBox="0 0 1000 535"
          aria-label="Interactive world map"
          onPointerDown={(e) => {
            moved.current = false;
            if (e.button === 0)
              setDrag({ x: e.clientX, y: e.clientY, px: pan.x, py: pan.y });
          }}
          onPointerMove={(e) => {
            if (
              drag &&
              Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 4
            ) {
              moved.current = true;
              setPan({
                x: drag.px + (e.clientX - drag.x) * (1000 / mapWidth),
                y: drag.py + (e.clientY - drag.y) * (1000 / mapWidth),
              });
            }
          }}
          onPointerUp={() => setDrag(undefined)}
          onPointerLeave={() => setDrag(undefined)}
        >
          <defs>
            <pattern
              id="dots"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r=".65" fill="#c8d0c5" />
            </pattern>
          </defs>
          <rect width="1000" height="535" fill="url(#dots)" />
          <g
            transform={`translate(${500 + pan.x},${267 + pan.y}) scale(${zoom}) translate(-500,-267)`}
          >
            <path d={path(geoGraticule10()) || ""} className="graticule" />
            {!quiz && (
              <g className="ocean-labels" aria-hidden="true">
                {oceans.map((ocean) => {
                  const point = projection(ocean.coordinate);
                  return (
                    point && (
                      <text
                        key={ocean.name}
                        className="ocean"
                        fontSize={labelFontSize * 0.9}
                        x={point[0]}
                        y={point[1]}
                        textAnchor="middle"
                      >
                        {ocean.name}
                      </text>
                    )
                  );
                })}
              </g>
            )}
            {world?.features
              .filter((f) => f.properties?.name !== "Antarctica")
              .map((f, i) => {
                const c = resolve(f);
                const active =
                  c && (region === "All regions" || c.region === region);
                return (
                  <path
                    key={i}
                    d={path(f) || ""}
                    className={`country-path ${selected === c?.cca3 ? "selected" : ""} ${active ? "" : "dim"}`}
                    role={c ? "button" : undefined}
                    tabIndex={c ? 0 : undefined}
                    aria-label={c?.name || f.properties?.name}
                    onMouseEnter={() => setHover(c?.name || f.properties?.name)}
                    onMouseLeave={() => setHover("")}
                    onFocus={() => setHover(c?.name || f.properties?.name)}
                    onBlur={() => setHover("")}
                    onClick={() => !moved.current && c && onCountry(c.cca3)}
                    onKeyDown={(e) => {
                      if (c && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onCountry(c.cca3);
                      }
                    }}
                  >
                    <title>{c?.name || f.properties?.name}</title>
                  </path>
                );
              })}
            <g className="country-labels">
              {countryLabels.map((label) => (
                <g key={label.id}>
                  {label.anchor && (
                    <line
                      className="label-leader"
                      x1={label.anchor[0]}
                      y1={label.anchor[1]}
                      x2={label.point[0]}
                      y2={label.point[1]}
                      strokeWidth={1 / zoom}
                    />
                  )}
                  <text
                    className={`country-label ${label.area === 0 ? "label-link" : ""}`}
                    data-country-label={label.id}
                    x={label.point[0]}
                    y={label.point[1]}
                    fontSize={labelFontSize / zoom}
                    strokeWidth={(labelFontSize * 0.25) / zoom}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    role={label.area === 0 ? "button" : undefined}
                    tabIndex={label.area === 0 ? 0 : undefined}
                    aria-label={label.area === 0 ? label.name : undefined}
                    onMouseEnter={() => setHover(label.name)}
                    onMouseLeave={() => setHover("")}
                    onFocus={() => setHover(label.name)}
                    onBlur={() => setHover("")}
                    onClick={() => !moved.current && onCountry(label.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onCountry(label.id);
                      }
                    }}
                  >
                    {label.name}
                  </text>
                </g>
              ))}
            </g>
          </g>
        </svg>
      )}
      <div className="map-bottom">
        <span>{hover || "Click a country. Follow a connection."}</span>
        <div>
          <span className="zoom-level">{zoom.toFixed(1)}×</span>
          <button
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(z * 1.4, 16))}
          >
            <Plus size={17} />
          </button>
          <button
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(z / 1.4, 1))}
          >
            <Minus size={17} />
          </button>
          <button
            aria-label="Reset map"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
          >
            <LocateFixed size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
