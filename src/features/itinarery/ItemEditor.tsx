import React, { useState } from "react";
import type { ItineraryItem, ItineraryItemType } from "../../Types/trip";
import * as tripService from "../../services/tripService.local";

interface ItemEditorProps {
  date: string;
  tripId: string;
  item?: ItineraryItem;
  onClose: () => void;
}

export default function ItemEditor({
  date,
  tripId,
  item,
  onClose,
}: ItemEditorProps) {
  // local form state
  const [title, setTitle] = useState(item?.title || "");
  const [type, setType] = useState<ItineraryItemType>(
    item?.type || "activity"
  );
  const [time, setTime] = useState(
    item?.start ? item.start.slice(11, 16) : "00:00"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isoStart = `${date}T${time}:00`;

    if (item) {
      // update existing
      const updatedItem: ItineraryItem = {
        ...item,
        title,
        type,
        start: isoStart,
      };
      const trip = await tripService.loadTrip(tripId);
      if (!trip) return;
      const updatedTrip = {
        ...trip,
        items: trip.items.map((it) => (it.id === item.id ? updatedItem : it)),
      };
      await tripService.saveTrip(updatedTrip);
    } else {
      // add new
      await tripService.addItem(tripId, {
        title,
        type,
        start: isoStart,
      });
    }

    onClose();
  };

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <form onSubmit={handleSubmit} className="grid gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (e.g. Museum visit)"
          className="p-2 border rounded"
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as ItineraryItemType)}
          className="p-2 border rounded"
        >
          <option value="activity">Activity</option>
          <option value="flight">Flight</option>
          <option value="hotel">Hotel</option>
          <option value="note">Note</option>
        </select>

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="p-2 border rounded"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            {item ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
