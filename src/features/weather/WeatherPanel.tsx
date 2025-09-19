import { useEffect, useState } from "react";
import { fetchWeather } from "../../services/weatherService";
import type { Trip, WeatherForecast } from "../../Types/trip";
import { useMemo } from "react";

interface Props {
  trip: Trip;
}

interface LocationForecast {
  name: string;
  address: string;
  forecasts: WeatherForecast[];
}

export default function WeatherPanel({ trip }: Props) {
  const [forecastData, setForecastData] = useState<LocationForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uniqueLocations = useMemo(() => {
  return Array.from(
    new Map(
      trip.items
        .filter((it) => it.location)
        .map((it) => [it.location!.lat + "," + it.location!.lng, it.location])
    ).values()
  );
}, [trip.items]);

  useEffect(() => {
  async function load() {
    if (uniqueLocations.length === 0) return;
    try {
      setLoading(true);
      const results: LocationForecast[] = [];

      for (const loc of uniqueLocations) {
        if (!loc) continue;
        const forecasts = await fetchWeather(loc.lat, loc.lng);
        results.push({
          name: loc.name || "Unnamed location",
          address: loc.address || "",
          forecasts,
        });
      }

      setForecastData(results);
    } catch (e) {
      console.error(e);
      setError("Could not fetch weather");
    } finally {
      setLoading(false);
    }
  }
  load();
}, [trip.id, uniqueLocations]);


  if (uniqueLocations.length === 0) {
    return <div className="text-gray-500">Add items with locations to see forecasts.</div>;
  }

  if (loading) return <div>Loading weather...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-4 rounded shadow-sm space-y-6">
      <h3 className="font-medium mb-3">Weather Forecast</h3>
      {forecastData.map((loc) => (
        <div key={loc.name + loc.address} className="border p-3 rounded">
          <div className="font-semibold">{loc.name}</div>
          <div className="text-sm text-gray-500 mb-2">{loc.address}</div>
          <ul className="space-y-1">
            {loc.forecasts.map((f) => (
              <li key={f.date} className="flex justify-between border p-2 rounded">
                <span>{f.date}</span>
                <span>{f.temp}°C - {f.description}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
