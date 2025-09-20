// Trip.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as tripService from "../services/tripService.firebase";
import type { Trip, Expense } from "../Types/trip";
import DayView from "../features/itinarery/DayView";
import ItemEditor from "../features/itinarery/ItemEditor";
import MapPanel from "../features/itinarery/MapPanel";
import WeatherPanel from "../features/weather/WeatherPanel";

export default function TripPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activeTab, setActiveTab] = useState("itinerary");

  // expenses state
  const [newCategory, setNewCategory] = useState<Expense["category"]>("other");
  const [newAmount, setNewAmount] = useState("");
  const [newNote, setNewNote] = useState("");

  // packing list state
  const [newPacking, setNewPacking] = useState("");

  // collaborators state
  const [newCollaborator, setNewCollaborator] = useState("");

  // subscribe to trip realtime
  useEffect(() => {
    if (!id) return;
    const unsub = tripService.subscribeTrip(id, (t) => setTrip(t ?? null));
    return () => unsub();
  }, [id]);

  if (!trip) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">{trip.title}</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b">
        {[
          "itinerary",
          "map",
          "weather",
          "expenses",
          "packing",
          "documents",
          "share",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-600"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Itinerary Tab */}
      {activeTab === "itinerary" && (
        <div>
          <DayView trip={trip} />
          <div className="mt-4">
            <ItemEditor
              date={trip.startDate}
              tripId={trip.id}
              onClose={() => {}}
            />
          </div>
        </div>
      )}

      {/* Map Tab */}
      {activeTab === "map" && <MapPanel trip={trip} />}

      {/* Weather Tab */}
      {activeTab === "weather" && <WeatherPanel trip={trip} />}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector(
                'input[type="file"]'
              ) as HTMLInputElement;
              if (!input.files?.length) return;

              const file = input.files[0];
              await tripService.uploadDocument(trip.id, file, trip.ownerId);
              input.value = "";
            }}
            className="flex gap-2 items-center"
          >
            <input type="file" className="p-2 border rounded" required />
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Upload
            </button>
          </form>

          <ul className="space-y-2">
            {trip.documents?.map((doc) => (
              <li
                key={doc.id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <a
                  href={doc.base64}
                  download={doc.name}
                  className="text-blue-600 underline"
                >
                  {doc.name}
                </a>
                <button
                  onClick={() => tripService.deleteDocument(trip.id, doc.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        <div className="space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await tripService.addExpense(trip.id, {
                category: newCategory,
                amount: Number(newAmount),
                note: newNote,
                date: new Date().toISOString(),
              });
              setNewAmount("");
              setNewNote("");
            }}
            className="flex gap-2"
          >
            <select
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value as Expense["category"])
              }
              className="p-2 border rounded"
            >
              <option value="flight">Flight</option>
              <option value="hotel">Hotel</option>
              <option value="food">Food</option>
              <option value="activity">Activity</option>
              <option value="transport">Transport</option>
              <option value="other">Other</option>
            </select>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="Amount"
              className="p-2 border rounded w-24"
              required
            />
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Note"
              className="p-2 border rounded flex-1"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Add
            </button>
          </form>

          <ul className="space-y-2">
            {trip.expenses?.map((e) => (
              <li
                key={e.id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <span>
                  {e.category} – ${Number(e.amount).toFixed(2)}
                  {e.note && ` (${e.note})`}
                </span>
                <button
                  onClick={() => tripService.deleteExpense(trip.id, e.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Packing Tab */}
      {activeTab === "packing" && (
        <div className="space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await tripService.addPackingItem(trip.id, newPacking);
              setNewPacking("");
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newPacking}
              onChange={(e) => setNewPacking(e.target.value)}
              placeholder="Packing item"
              className="p-2 border rounded flex-1"
              required
            />
            <button
              type="submit"
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Add
            </button>
          </form>

          <ul className="space-y-2">
            {trip.packingList?.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <span
                  className={`${
                    p.packed ? "line-through text-gray-500" : ""
                  } cursor-pointer`}
                  onClick={() => tripService.togglePackingItem(trip.id, p.id)}
                >
                  {p.name}
                </span>
                <button
                  onClick={() => tripService.removePackingItem(trip.id, p.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Share Tab */}
      {activeTab === "share" && (
        <div className="space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await tripService.addCollaborator(trip.id, newCollaborator);
              setNewCollaborator("");
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newCollaborator}
              onChange={(e) => setNewCollaborator(e.target.value)}
              placeholder="Collaborator User ID"
              className="p-2 border rounded flex-1"
              required
            />
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Add
            </button>
          </form>

          <ul className="space-y-2">
            {trip.allowedUsers?.map((u) => (
              <li
                key={u}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <span>{u}</span>
                {u !== trip.ownerId && (
                  <button
                    onClick={() => tripService.removeCollaborator(trip.id, u)}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
