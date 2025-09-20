import { useState } from "react";
import * as tripService from "../../services/tripService.firebase";
import type { Trip, Expense } from "../../Types/trip";

export default function ExpensesTab({ trip }: { trip: Trip }) {
  const [newCategory, setNewCategory] = useState<Expense["category"]>("other");
  const [newAmount, setNewAmount] = useState("");
  const [newNote, setNewNote] = useState("");

  const categoryIcons: Record<Expense["category"], string> = {
    flight: "✈️",
    hotel: "🏨",
    food: "🍽️",
    activity: "🎯",
    transport: "🚗",
    other: "💰"
  };

  const categoryColors: Record<Expense["category"], string> = {
    flight: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    hotel: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    food: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    activity: "bg-green-500/20 text-green-400 border-green-500/30",
    transport: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    other: "bg-gray-500/20 text-gray-400 border-gray-500/30"
  };

  const totalExpenses = trip.expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    await tripService.addExpense(trip.id, {
      category: newCategory,
      amount: Number(newAmount),
      note: newNote,
      date: new Date().toISOString(),
    });
    setNewAmount("");
    setNewNote("");
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-600">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Trip Expenses</h3>
            <p className="text-slate-400 text-sm">{trip.expenses?.length || 0} expense{(trip.expenses?.length || 0) !== 1 ? 's' : ''}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-slate-400 text-xs mb-1">Total Spent</div>
          <div className="text-2xl font-bold text-green-400">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Add Expense Section */}
      <div className="p-6 border-b border-slate-600">
        <h4 className="text-white font-medium mb-4 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Expense
        </h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value as Expense["category"])
                }
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="flight">✈️ Flight</option>
                <option value="hotel">🏨 Hotel</option>
                <option value="food">🍽️ Food</option>
                <option value="activity">🎯 Activity</option>
                <option value="transport">🚗 Transport</option>
                <option value="other">💰 Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">₹</span>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Note
              </label>
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Optional note..."
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleAddExpense}
              disabled={!newAmount}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Expense</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="p-6">
        {trip.expenses && trip.expenses.length > 0 ? (
          <div className="space-y-3">
            {trip.expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600/50 p-4 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`px-3 py-1 rounded-full border text-xs font-medium ${categoryColors[expense.category]}`}>
                      <span className="mr-1">{categoryIcons[expense.category]}</span>
                      {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold text-green-400">
                          ₹{Number(expense.amount).toLocaleString('en-IN')}
                        </span>
                        {expense.note && (
                          <span className="text-slate-400 text-sm truncate">
                            {expense.note}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(expense.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => tripService.deleteExpense(trip.id, expense.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete expense"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-slate-300 font-medium text-lg mb-2">No Expenses Yet</h3>
            <p className="text-slate-400 text-sm">Start tracking your trip expenses by adding your first expense above</p>
          </div>
        )}
      </div>

      {/* Total Summary Footer */}
      {trip.expenses && trip.expenses.length > 0 && (
        <div className="p-6 border-t border-slate-600 bg-slate-700/20">
          <div className="flex justify-between items-center">
            <div className="text-slate-300">
              <span className="text-lg font-medium">Total Trip Expenses</span>
              <div className="text-sm text-slate-400">{trip.expenses.length} transaction{trip.expenses.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">
                ₹{totalExpenses.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-500">
                Avg: ₹{Math.round(totalExpenses / trip.expenses.length).toLocaleString('en-IN')} per expense
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}