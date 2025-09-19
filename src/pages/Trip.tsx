import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as tripService from "../services/tripService.firebase";
import type { Trip } from "../Types/trip";
import DayView from "../features/itinarery/DayView";
import MapPanel from "../features/itinarery/MapPanel";
import ExpenseTracker from "../features/expenses/ExpenseTracker";
import PackingList from "../features/packing/PackingList";
import WeatherPanel from "../features/weather/WeatherPanel";

export default function Trip() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<
    "itinerary" | "map" | "expenses" | "packing" | "weather"
  >("itinerary");

 useEffect(() => {
  if (!id) return;
  const unsub = tripService.subscribeTrip(id, (t) => setTrip(t));
  return () => unsub();
}, [id]);


  if (!trip) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded shadow-sm p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{trip.title}</h2>
          <div className="text-gray-500">
            {trip.startDate} → {trip.endDate}
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-b mb-4">
        <button
          onClick={() => setActiveTab("itinerary")}
          className={`pb-2 ${
            activeTab === "itinerary"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Itinerary
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`pb-2 ${
            activeTab === "map"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setActiveTab("packing")}
          className={`pb-2 ${
            activeTab === "packing"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Packing List
        </button>
        <button
          onClick={() => setActiveTab("weather")}
          className={`pb-2 ${
            activeTab === "weather"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Weather
        </button>
        <button
          onClick={() => setActiveTab("expenses")}
          className={`pb-2 ${
            activeTab === "expenses"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Expenses
        </button>
      </div>

      <div>
        {activeTab === "itinerary" && (
          <DayView
            trip={trip}
            onChange={async () =>
              setTrip((await tripService.loadTrip(trip.id)) as Trip)
            }
          />
        )}

        {activeTab === "map" && <MapPanel items={trip.items} />}
        {activeTab === "packing" && (
          <PackingList
            trip={trip}
            onChange={async () =>
              setTrip((await tripService.loadTrip(trip.id)) as Trip)
            }
          />
        )}
        {activeTab === "weather" && <WeatherPanel trip={trip} />}

        {activeTab === "expenses" && (
          <ExpenseTracker
            trip={trip}
            onChange={async () =>
              setTrip((await tripService.loadTrip(trip.id)) as Trip)
            }
          />
        )}
      </div>
    </div>
  );
}
