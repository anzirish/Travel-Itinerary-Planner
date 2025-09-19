import { useState } from "react";
import type { Trip } from "../../Types/trip"; 
import * as tripService from "../../services/tripService.firebase";

interface Props {
  trip: Trip;
  onChange: () => void;
}

export default function PackingList({ trip, onChange }: Props) {
  const [itemName, setItemName] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!itemName.trim()) return;
    await tripService.addPackingItem(trip.id, itemName.trim());
    setItemName("");
    onChange();
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="font-medium mb-3">Packing List</h3>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add item (e.g. Passport)"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {(trip.packingList ?? []).map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={item.packed}
                onChange={async () => {
                  await tripService.togglePackingItem(trip.id, item.id);
                  onChange();
                }}
              />
              <span className={item.packed ? "line-through text-gray-500" : ""}>
                {item.name}
              </span>
            </label>
            <button
              onClick={async () => {
                await tripService.removePackingItem(trip.id, item.id);
                onChange();
              }}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
