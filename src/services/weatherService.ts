const API_KEY = "3a29099de6bf7b1bebe13df4741b99b3";

// fetch 5-day forecast from OpenWeather

interface OpenWeatherEntry {
  dt_txt: string;
  main: { temp: number };
  weather: { description: string }[];
}

interface OpenWeatherResponse {
  list: OpenWeatherEntry[];
}

export async function fetchWeather(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = await res.json();

  // group by date and take daily averages
  const forecasts: { [date: string]: { temps: number[]; descriptions: string[] } } = {};

  (data as OpenWeatherResponse).list.forEach((entry) => {
  const date = entry.dt_txt.slice(0, 10);
  if (!forecasts[date]) forecasts[date] = { temps: [], descriptions: [] };
  forecasts[date].temps.push(entry.main.temp);
  forecasts[date].descriptions.push(entry.weather[0].description);
});


  return Object.entries(forecasts).map(([date, info]) => ({
    date,
    temp: Math.round(info.temps.reduce((a, b) => a + b, 0) / info.temps.length),
    description: info.descriptions[0],
  }));
}
