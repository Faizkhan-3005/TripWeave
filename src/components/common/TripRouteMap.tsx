import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Polyline, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, X, MapPin } from 'lucide-react';
import { TripStopModel } from '../../types';

// Fix default icon paths broken by Webpack/Vite bundler
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Coords {
  lat: number;
  lon: number;
}

interface TripRouteMapProps {
  stops: TripStopModel[];
  compact?: boolean; // smaller height for dashboard
}

// Creates numbered SVG markers
function createNumberedIcon(num: number, isFirst: boolean, isLast: boolean) {
  const bg = isFirst ? '#16a34a' : isLast ? '#dc2626' : '#111827';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42">
      <path d="M17 0C7.611 0 0 7.611 0 17c0 12.75 17 25 17 25s17-12.25 17-25C34 7.611 26.389 0 17 0z" fill="${bg}"/>
      <circle cx="17" cy="17" r="11" fill="white"/>
      <text x="17" y="22" text-anchor="middle" font-size="11" font-weight="800" fill="${bg}" font-family="system-ui,sans-serif">${num}</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    tooltipAnchor: [17, -42],
  });
}

// Auto-fit bounds and invalidate size controller
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    // Invalidate map size after render in case container size changed
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (positions.length > 0) {
        if (positions.length === 1) {
          map.setView(positions[0], 8);
        } else {
          map.fitBounds(positions, { padding: [50, 50] });
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [map, positions]);
  return null;
}

// Geocode a city via Nominatim (OpenStreetMap, free, no API key)
async function geocodeCity(cityName: string, country: string): Promise<Coords | null> {
  const cacheKey = `nominatim_${cityName}_${country}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const query = encodeURIComponent(`${cityName}, ${country}`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en', 'User-Agent': 'Tripweave/1.0' } }
    );
    const data = await res.json();
    if (data.length > 0) {
      const coords: Coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      sessionStorage.setItem(cacheKey, JSON.stringify(coords));
      return coords;
    }
  } catch {
    // Silently fail
  }
  return null;
}

export const TripRouteMap: React.FC<TripRouteMapProps> = ({ stops, compact = false }) => {
  const [coordsMap, setCoordsMap] = useState<Record<string, Coords>>({});
  const [loading, setLoading] = useState(true);
  const [isExpandedModal, setIsExpandedModal] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (stops.length === 0) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      const results: Record<string, Coords> = {};
      await Promise.all(
        stops.map(async (stop) => {
          const key = stop.city.id;
          const coords = await geocodeCity(stop.city.name, stop.city.country);
          if (coords) results[key] = coords;
        })
      );
      if (isMounted.current) {
        setCoordsMap(results);
        setLoading(false);
      }
    };
    fetchAll();
  }, [stops]);

  const resolvedStops = stops
    .slice()
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .filter((s) => coordsMap[s.city.id]);

  const positions: [number, number][] = resolvedStops.map((s) => [
    coordsMap[s.city.id].lat,
    coordsMap[s.city.id].lon,
  ]);

  const mapHeight = compact ? 'h-48' : 'h-72';

  if (loading) {
    return (
      <div className={`${mapHeight} w-full rounded-2xl bg-gray-100 flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-500">Loading route map…</span>
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className={`${mapHeight} w-full rounded-2xl bg-gray-100 flex items-center justify-center`}>
        <span className="text-xs font-semibold text-gray-400">No location data available</span>
      </div>
    );
  }

  return (
    <>
      {/* Primary Inline Map Container */}
      <div className={`relative ${mapHeight} w-full rounded-2xl overflow-hidden border border-[#e5e5ea] shadow-sm group`}>
        <MapContainer
          center={positions[0]}
          zoom={4}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          zoomControl={!compact}
          attributionControl={!compact}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <FitBounds positions={positions} />

          {/* Polyline connecting all city stops */}
          {positions.length > 1 && (
            <Polyline
              positions={positions}
              pathOptions={{
                color: '#111827',
                weight: 3,
                opacity: 0.85,
                dashArray: '8 6',
              }}
            />
          )}

          {/* Numbered markers for each stop */}
          {resolvedStops.map((stop, idx) => (
            <Marker
              key={`inline-${stop.city.id}`}
              position={[coordsMap[stop.city.id].lat, coordsMap[stop.city.id].lon]}
              icon={createNumberedIcon(idx + 1, idx === 0, idx === resolvedStops.length - 1)}
            >
              <Tooltip direction="top" offset={[0, -42]} opacity={1}>
                <div className="text-xs font-bold whitespace-nowrap">
                  <span className="font-extrabold">{idx + 1}. {stop.city.name}</span>
                  <br />
                  <span className="text-gray-500">{stop.city.country}</span>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>

        {/* Expand Map Overlay Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpandedModal(true);
          }}
          type="button"
          title="Expand to Fullscreen Map"
          className="absolute top-2.5 right-2.5 z-[500] bg-white/95 hover:bg-white text-black p-2 rounded-xl border border-gray-200 shadow-md flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Expand Map</span>
        </button>
      </div>

      {/* Fullscreen Expandable Modal Map mounted via React Portal to document.body */}
      {isExpandedModal && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsExpandedModal(false)}
        >
          <div 
            className="bg-white w-full max-w-5xl h-[85vh] rounded-[36px] overflow-hidden shadow-2xl border border-gray-200 relative flex flex-col z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white z-20 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Interactive Route Map</h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {resolvedStops.length} Destinations along your journey
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExpandedModal(false)}
                type="button"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-black flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Expanded Full-Size Map */}
            <div className="flex-1 w-full relative">
              <MapContainer
                center={positions[0]}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <FitBounds positions={positions} />

                {positions.length > 1 && (
                  <Polyline
                    positions={positions}
                    pathOptions={{
                      color: '#111827',
                      weight: 4,
                      opacity: 0.9,
                      dashArray: '10 8',
                    }}
                  />
                )}

                {resolvedStops.map((stop, idx) => (
                  <Marker
                    key={`portal-marker-${stop.city.id}`}
                    position={[coordsMap[stop.city.id].lat, coordsMap[stop.city.id].lon]}
                    icon={createNumberedIcon(idx + 1, idx === 0, idx === resolvedStops.length - 1)}
                  >
                    <Tooltip direction="top" offset={[0, -42]} opacity={1} permanent>
                      <div className="text-xs font-bold whitespace-nowrap">
                        <span className="font-black">{idx + 1}. {stop.city.name}</span> ({stop.city.country})
                      </div>
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Modal Bottom Stops Route Bar */}
            <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2 overflow-x-auto shrink-0 z-20">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">
                Route Order:
              </span>
              {resolvedStops.map((stop, idx) => (
                <div
                  key={`portal-pill-${stop.city.id}`}
                  className="bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs"
                >
                  <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{stop.city.name}</span>
                </div>
              ))}
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
};
