import { useState } from "react";
import type { Trip } from "../../Types/trip";
import { Plus, Calendar, MapPin, Loader2, AlertCircle } from "lucide-react";
import * as tripService from "../../services/tripService.firebase";

interface CreateTripFormProps {
  onTripCreated: (trip: Trip) => void;
}

export const CreateTripForm = ({ onTripCreated }: CreateTripFormProps) => {
  const [title, setTitle] = useState("");
  const [dates, setDates] = useState({ start: "", end: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  /**
   * Validates date inputs to ensure logical trip planning
   */
  const validateDates = (start: string, end: string): string | null => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (startDate < todayDate) {
      return "Start date cannot be in the past";
    }
    if (endDate <= startDate) {
      return "End date must be after start date";
    }
    return null;
  };

  /**
   * Handles trip creation with validation and error handling
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Input validation
    if (!title.trim()) {
      setError("Trip title is required");
      return;
    }
    if (!dates.start || !dates.end) {
      setError("Both start and end dates are required");
      return;
    }

    // Date validation
    const dateError = validateDates(dates.start, dates.end);
    if (dateError) {
      setError(dateError);
      return;
    }

    setIsCreating(true);
    try {
      const newTrip = await tripService.createTrip({
        title: title.trim(),
        startDate: dates.start,
        endDate: dates.end,
      });
      
      // Reset form
      setTitle("");
      setDates({ start: "", end: "" });
      
      onTripCreated(newTrip);
    } catch (err) {
      setError("Failed to create trip. Please try again.");
      console.error("Error creating trip:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 p-6 mb-8 hover:bg-slate-800/80 hover:border-slate-600/50 transition-all duration-300">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Plus className="text-blue-400" size={24} />
        Create New Trip
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-300 backdrop-blur-sm">
          <AlertCircle size={20} className="text-red-400" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Trip Title Input */}
        <div className="relative group">
          <MapPin className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-400 transition-colors" size={20} />
          <input
            className="w-full pl-10 pr-4 py-3 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-slate-700/50 backdrop-blur-sm text-white placeholder-slate-400 transition-all hover:border-slate-500/70 hover:bg-slate-700/70"
            placeholder="Where to next?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            disabled={isCreating}
          />
        </div>
        
        {/* Start Date Input */}
        <div className="relative group">
          <Calendar className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-400 transition-colors" size={20} />
          <input
            className="w-full pl-10 pr-4 py-3 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-slate-700/50 backdrop-blur-sm text-white transition-all hover:border-slate-500/70 hover:bg-slate-700/70 [color-scheme:dark]"
            type="date"
            value={dates.start}
            min={today}
            onChange={(e) => setDates((s) => ({ ...s, start: e.target.value }))}
            disabled={isCreating}
          />
        </div>
        
        {/* End Date Input */}
        <div className="relative group">
          <Calendar className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={20} />
          <input
            className="w-full pl-10 pr-4 py-3 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 bg-slate-700/50 backdrop-blur-sm text-white transition-all hover:border-slate-500/70 hover:bg-slate-700/70 [color-scheme:dark]"
            type="date"
            value={dates.end}
            min={dates.start || today}
            onChange={(e) => setDates((s) => ({ ...s, end: e.target.value }))}
            disabled={isCreating}
          />
        </div>
        
        {/* Submit Button */}
        <button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl px-6 py-3 font-semibold transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none border border-blue-500/30 hover:border-blue-400/50"
          type="submit"
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Creating...
            </>
          ) : (
            <>
              <Plus size={20} />
              Create Trip
            </>
          )}
        </button>
      </form>
      
      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};