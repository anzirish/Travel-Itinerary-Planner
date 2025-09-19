import { useEffect, useState } from "react";
import type { Trip } from "../Types/trip";
import { Link, useNavigate } from "react-router-dom";
import * as tripService from "../services/tripService.firebase";

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [title, setTitle] = useState("");
  const [dates, setDates] = useState({ start: "", end: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = tripService.subscribeTrips((allTrips) => {
      setTrips(allTrips);
    });
    return () => unsub();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !dates.start || !dates.end) return;
    const newTrip: Trip = await tripService.createTrip({
      title,
      startDate: dates.start,
      endDate: dates.end,
    });
    setTrips((prevTrips) => [newTrip, ...prevTrips]);
    setTitle("");
    setDates({ start: "", end: "" });
    navigate(`/trip/${newTrip.id}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Trips</h1>

      <form
        onSubmit={handleCreate}
        className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6"
      >
        <input
          className="p-2 border rounded"
          placeholder="Trip title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          type="date"
          value={dates.start}
          onChange={(e) => setDates((s) => ({ ...s, start: e.target.value }))}
        />
        <input
          className="p-2 border rounded"
          type="date"
          value={dates.end}
          onChange={(e) => setDates((s) => ({ ...s, end: e.target.value }))}
        />
        <button
          className="bg-blue-600 text-white rounded px-4 py-2"
          type="submit"
        >
          Create Trip
        </button>
      </form>

      <div className="grid gap-4">
        {trips.length === 0 && (
          <div className="text-gray-500">No trips yet — create one above.</div>
        )}
        {trips.map((t) => (
          <div
            key={t.id}
            className="p-4 bg-white rounded shadow-sm border-1 border-gray-300 flex justify-between items-center"
          >
            <div>
              <Link to={`/trip/${t.id}`} className="text-lg font-medium">
                {t.title}
              </Link>
              <div className="text-sm text-gray-500">
                {t.startDate} → {t.endDate}
              </div>
            </div>
            <div>
              <button
                className="text-sm text-white font-semibold px-4 py-2 cursor-pointer hover:bg-red-600 border rounded bg-red-500"
                onClick={async () => {
                  await tripService.removeTrip(t.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trips;
