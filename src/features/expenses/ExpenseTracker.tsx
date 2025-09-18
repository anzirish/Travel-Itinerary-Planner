import { useState } from "react";
import type { Trip, Expense } from "../../Types/trip";
import * as tripService from "../../services/tripService.local";

interface Props {
  trip: Trip;
  onChange: () => void;
}

export default function ExpenseTracker({ trip, onChange }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Expense["category"]>("other");
  const [note, setNote] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) return;
    await tripService.addExpense(trip.id, {
      amount: parseFloat(amount),
      category,
      note,
      date: new Date().toISOString(),
    });
    setAmount("");
    setNote("");
    setCategory("other");
    onChange();
  }

  const total = (trip.expenses ?? []).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="font-medium mb-2">Expenses</h3>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded w-24"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Expense["category"])}
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
          type="text"
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {(trip.expenses ?? []).map((e) => (
          <li
            key={e.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div>
              <div className="font-medium">
                ₹{e.amount} — {e.category}
              </div>
              {e.note && <div className="text-sm text-gray-500">{e.note}</div>}
            </div>
            <button
              onClick={async () => {
                await tripService.deleteExpense(trip.id, e.id);
                onChange();
              }}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="mb-2 text-sm text-gray-600">Total so far: ₹{total}</div>
    </div>
  );
}
