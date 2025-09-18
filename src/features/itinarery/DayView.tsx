import { useState } from "react";
import ItemEditor from "./ItemEditor";
import type { Trip, ItineraryItem } from "../../Types/trip";
import * as tripService from "../../services/tripService.local";

interface DayViewProps {
  trip: Trip;
  onChange?: () => void;
}

export default function DayView({ trip, onChange }: DayViewProps) {
  const [editingItem, setEditingItem] = useState<{
    date: string;
    item?: ItineraryItem;
  } | null>(null);
  const days = getDatesBetween(trip.startDate, trip.endDate);

  async function handleDelete(itemId: string) {
    await tripService.deleteItem(trip.id, itemId);
    if (onChange) {
      onChange();
    }
  }

  return (
    <div>
      {days.map((day) => (
        <div
          key={day}
          className="border border-gray-400 mb-6 bg-white p-4 rounded shadow-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="font-medium">{day}</div>
            <button
              className=" bg-blue-500 text-white rounded text-smfont-semibold px-3 py-2 cursor-pointer hover:bg-blue-600 border "
              onClick={() => setEditingItem({ date: day })}
            >
              Add item
            </button>
          </div>

          <div className="space-y-2">
            {trip.items
              .filter((it) => it.start.slice(0, 10) === day)
              .map((it) => (
                <div
                  key={it.id}
                  className="p-2 border border-gray-200 rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{it.title}</div>
                    <div className="text-sm text-gray-500">
                      {it.type} • {it.start.slice(11, 16)}
                      {it.end ? ` - ${it.end.slice(11, 16)}` : ""}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-sm text-white font-semibold px-4 py-2 cursor-pointer hover:bg-green-600 border rounded bg-green-500"
                      onClick={() => setEditingItem({ date: day, item: it })}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm text-white font-semibold px-4 py-2 cursor-pointer hover:bg-red-600 border rounded bg-red-500"
                      onClick={() => handleDelete(it.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {editingItem && editingItem.date === day && (
            <ItemEditor
              date={day}
              tripId={trip.id}
              item={editingItem.item}
              onClose={async () => {
                setEditingItem(null);
                if (onChange) {
                  onChange();
                }
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function getDatesBetween(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const days: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}
