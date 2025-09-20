import { useEffect, useMemo, useState } from "react";
import type { Trip, WeatherForecast } from "../../Types/trip";
import { fetchWeather } from "../../services/weatherService";

interface LocationForecast {
  name: string;
  address: string;
  forecasts: WeatherForecast[];
}

export default function WeatherTab({ trip }: { trip: Trip }) {
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
  
    const getWeatherIcon = (description: string) => {
      const desc = description.toLowerCase();
      if (desc.includes('sun') || desc.includes('clear')) {
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        );
      } else if (desc.includes('cloud')) {
        return (
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
          </svg>
        );
      } else if (desc.includes('rain') || desc.includes('drizzle')) {
        return (
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        );
      } else if (desc.includes('snow')) {
        return (
          <svg className="w-6 h-6 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0v-.5A1.5 1.5 0 0114.5 6c.526 0 .988-.27 1.256-.679a6.012 6.012 0 011.913 2.706A3.5 3.5 0 0116 12.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 12.5a3.5 3.5 0 01.332-4.473z" clipRule="evenodd" />
          </svg>
        );
      }
      return (
        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    };
  
    const getTempColor = (temp: number) => {
      if (temp >= 30) return "text-red-500";
      if (temp >= 25) return "text-orange-500";
      if (temp >= 20) return "text-yellow-600";
      if (temp >= 15) return "text-green-500";
      if (temp >= 10) return "text-blue-500";
      return "text-blue-700";
    };
  
    if (uniqueLocations.length === 0) {
      return (
        <div className="bg-slate-800 rounded-lg border border-slate-600 p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-slate-300 font-medium text-lg mb-2">No Weather Data</h3>
            <p className="text-slate-400 text-sm">Add items with locations to see weather forecasts</p>
          </div>
        </div>
      );
    }
  
    if (loading) {
      return (
        <div className="bg-slate-800 rounded-lg border border-slate-600 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Weather Forecast</h3>
                <p className="text-slate-400 text-sm">Loading weather data...</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-700/50 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-slate-600 rounded"></div>
                  <div className="h-4 bg-slate-600 rounded w-32"></div>
                </div>
                <div className="h-3 bg-slate-600 rounded w-48 mb-3"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-16 bg-slate-600/50 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="bg-slate-800 rounded-lg border border-red-500/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Weather Error</h3>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
  
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Weather Forecast</h3>
              <p className="text-slate-400 text-sm">{forecastData.length} location{forecastData.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Updated now</span>
          </div>
        </div>
  
        {/* Weather Content */}
        <div className="p-6 space-y-6">
          {forecastData.map((loc, index) => (
            <div key={loc.name + loc.address} className="bg-slate-700/30 rounded-lg border border-slate-600/50 p-5">
              {/* Location Header */}
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-lg mb-1">{loc.name}</h4>
                  {loc.address && (
                    <p className="text-slate-400 text-sm leading-relaxed">{loc.address}</p>
                  )}
                </div>
              </div>
  
              {/* Weather Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loc.forecasts.map((forecast) => (
                  <div
                    key={forecast.date}
                    className="bg-slate-700/50 hover:bg-slate-700/70 rounded-lg p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-300 text-sm font-medium">
                        {new Date(forecast.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      {getWeatherIcon(forecast.description)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs">Temperature</span>
                        <span className={`text-xl font-bold ${getTempColor(forecast.temp)}`}>
                          {forecast.temp}°C
                        </span>
                      </div>
                      
                      <div className="text-slate-400 text-xs leading-relaxed">
                        {forecast.description.charAt(0).toUpperCase() + forecast.description.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}
