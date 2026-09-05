import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, ChevronDown } from 'lucide-react';

interface WeatherDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

interface WeatherWidgetProps {
  cityName: string;
  country: string;
  className?: string;
}

// WMO weather code → readable label + Lucide icon + color
function getWeatherInfo(code: number): { label: string; icon: React.ReactNode; color: string; emoji: string } {
  if (code === 0) return { label: 'Clear Sky', icon: <Sun className="w-3.5 h-3.5" />, color: 'text-amber-500', emoji: '☀️' };
  if (code <= 2) return { label: 'Partly Cloudy', icon: <Cloud className="w-3.5 h-3.5" />, color: 'text-sky-500', emoji: '⛅' };
  if (code === 3) return { label: 'Overcast', icon: <Cloud className="w-3.5 h-3.5" />, color: 'text-gray-500', emoji: '☁️' };
  if (code <= 49) return { label: 'Foggy', icon: <Wind className="w-3.5 h-3.5" />, color: 'text-gray-400', emoji: '🌫️' };
  if (code <= 67) return { label: 'Rainy', icon: <CloudRain className="w-3.5 h-3.5" />, color: 'text-blue-500', emoji: '🌧️' };
  if (code <= 77) return { label: 'Snowy', icon: <CloudSnow className="w-3.5 h-3.5" />, color: 'text-sky-300', emoji: '❄️' };
  if (code <= 82) return { label: 'Showers', icon: <Droplets className="w-3.5 h-3.5" />, color: 'text-blue-400', emoji: '🌦️' };
  if (code <= 99) return { label: 'Thunderstorm', icon: <CloudLightning className="w-3.5 h-3.5" />, color: 'text-purple-500', emoji: '⛈️' };
  return { label: 'Unknown', icon: <Cloud className="w-3.5 h-3.5" />, color: 'text-gray-400', emoji: '🌡️' };
}

// Day of week abbreviation from ISO date string
function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

// Geocode via Nominatim then hit Open-Meteo (both free, no key)
async function fetchWeather(cityName: string, country: string): Promise<WeatherDay[] | null> {
  const cacheKey = `weather_${cityName}_${country}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    // Cache for 1 hour (timestamp check)
    if (Date.now() - parsed.ts < 3600000) return parsed.data;
  }

  try {
    // Step 1: Geocode
    const geoQuery = encodeURIComponent(`${cityName}, ${country}`);
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${geoQuery}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en', 'User-Agent': 'Tripweave/1.0' } }
    );
    const geoData = await geoRes.json();
    if (!geoData.length) return null;

    const lat = parseFloat(geoData[0].lat).toFixed(4);
    const lon = parseFloat(geoData[0].lon).toFixed(4);

    // Step 2: Fetch 5-day forecast from Open-Meteo
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
    );
    const weatherData = await weatherRes.json();

    const days: WeatherDay[] = (weatherData.daily?.time || []).map((date: string, i: number) => ({
      date,
      maxTemp: Math.round(weatherData.daily.temperature_2m_max[i]),
      minTemp: Math.round(weatherData.daily.temperature_2m_min[i]),
      weatherCode: weatherData.daily.weathercode[i],
    }));

    sessionStorage.setItem(cacheKey, JSON.stringify({ data: days, ts: Date.now() }));
    return days;
  } catch {
    return null;
  }
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ cityName, country, className = '' }) => {
  const [forecast, setForecast] = useState<WeatherDay[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setForecast(null);

    fetchWeather(cityName, country).then((data) => {
      if (!cancelled) {
        setForecast(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [cityName, country]);

  if (loading) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 ${className}`}>
        <div className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        <span>Loading weather…</span>
      </div>
    );
  }

  if (!forecast || forecast.length === 0) {
    return null;
  }

  const today = forecast[0];
  const info = getWeatherInfo(today.weatherCode);

  return (
    <div className={`${className}`}>
      {/* Compact Badge */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="inline-flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors"
      >
        <span className={info.color}>{info.icon}</span>
        <span>{today.maxTemp}° / {today.minTemp}°</span>
        <ChevronDown
          className={`w-3 h-3 text-sky-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded 5-Day Forecast */}
      {expanded && (
        <div className="mt-2 bg-white border border-[#e5e5ea] rounded-2xl p-3 shadow-sm w-64">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            5-Day Forecast · {cityName}
          </p>
          <div className="space-y-1.5">
            {forecast.map((day, i) => {
              const d = getWeatherInfo(day.weatherCode);
              return (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-600 w-10">
                    {i === 0 ? 'Today' : getDayLabel(day.date)}
                  </span>
                  <div className={`flex items-center gap-1 ${d.color}`}>
                    {d.icon}
                    <span className="text-[11px] font-semibold text-gray-500">{d.label}</span>
                  </div>
                  <span className="text-xs font-extrabold text-black">
                    {day.maxTemp}° <span className="text-gray-400 font-normal">/ {day.minTemp}°</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
