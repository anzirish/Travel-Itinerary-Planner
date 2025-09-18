import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as tripService from "../services/tripService.local";
import type { Trip } from "../Types/trip";
import DayView from "../features/itinarery/DayView";
import MapPanel from "../features/itinarery/MapPanel";

export default function Trip() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    (async () => setTrip(await tripService.loadTrip(id)))();
  }, [id]);

  if (!trip) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{trip.title}</h2>
          <div className="text-sm text-gray-500">
            {trip.startDate} → {trip.endDate}
          </div>
        </div>
        <DayView
          trip={trip}
          onChange={async () =>
            setTrip((await tripService.loadTrip(trip.id)) as Trip)
          }
        />
      </div>

      <aside>
        <MapPanel items={trip.items} />
        <div className="mt-4 bg-white p-4 rounded shadow-sm">
          <h3 className="font-medium mb-2">Export</h3>
          <button
            className="w-full p-2 bg-gray-800 text-white rounded"
            onClick={() => {
              const blob = new Blob([JSON.stringify(trip, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${trip.title}.json`;
              a.click();
            }}
          >
            Export JSON
          </button>
        </div>
      </aside>
    </div>
  );
}
