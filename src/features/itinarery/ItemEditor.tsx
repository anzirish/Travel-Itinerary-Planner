import React, { useState } from "react";
import type { ItineraryItem, ItineraryItemType } from "../../Types/trip";
import * as tripService from "../../services/tripService.firebase";
import LocationPicker from "../../modals/LocationPicker";
import { 
  X, 
  Clock, 
  Type, 
  MapPin, 
  Plus,
  Edit3,
  Save,
  Loader2
} from "lucide-react";

interface ItemEditorProps {
  date: string;
  tripId: string;
  item?: ItineraryItem;
  onClose: () => void;
}

/**
 * ItemEditor Component - Beautiful form for creating and editing itinerary items
 * Features dark theme design, type-specific styling, and location integration
 */
export default function ItemEditor({
  date,
  tripId,
  item,
  onClose,
}: ItemEditorProps) {
  const [title, setTitle] = useState(item?.title || "");
  const [type, setType] = useState<ItineraryItemType>(item?.type || "activity");
  const [time, setTime] = useState(
    item?.start ? item.start.slice(11, 16) : "09:00"
  );
  const [description, setDescription] = useState(item?.details || "");
  const [location, setLocation] = useState(item?.location ?? null);
  const [showPicker, setShowPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission with loading state
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isoStart = `${date}T${time}:00`;

      if (item) {
        // Update existing item
        const updatedItem: ItineraryItem = {
          ...item,
          title,
          type,
          start: isoStart,
          details : description,
          location,
        };
        const trip = await tripService.loadTrip(tripId);
        if (!trip) return;
        
        const updatedTrip = {
          ...trip,
          items: trip.items.map((it) => (it.id === item.id ? updatedItem : it)),
        };
        await tripService.saveTrip(updatedTrip);
      } else {
        // Add new item
        await tripService.addItem(tripId, {
          title,
          type,
          start: isoStart,
          details : description,
          location,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Get type-specific colors (dark theme)
   */
  const getTypeColors = (selectedType: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
      activity: { bg: "bg-green-600", text: "text-green-400", border: "border-green-500/30" },
      flight: { bg: "bg-blue-600", text: "text-blue-400", border: "border-blue-500/30" },
      hotel: { bg: "bg-purple-600", text: "text-purple-400", border: "border-purple-500/30" },
      restaurant: { bg: "bg-orange-600", text: "text-orange-400", border: "border-orange-500/30" },
      transport: { bg: "bg-indigo-600", text: "text-indigo-400", border: "border-indigo-500/30" },
      sightseeing: { bg: "bg-pink-600", text: "text-pink-400", border: "border-pink-500/30" },
      meeting: { bg: "bg-amber-600", text: "text-amber-400", border: "border-amber-500/30" },
      note: { bg: "bg-slate-600", text: "text-slate-400", border: "border-slate-500/30" },
    };
    return colorMap[selectedType] || colorMap.activity;
  };

  const typeColors = getTypeColors(type);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-600 overflow-hidden">
      
      {/* Header */}
      <div className={`${typeColors.bg} p-6 text-white relative`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            {item ? <Edit3 size={24} /> : <Plus size={24} />}
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {item ? "Edit Activity" : "Add New Activity"}
            </h3>
            <p className="text-white/80 mt-1">
              {formatDate(date)}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Activity Title
          </label>
          <div className="relative">
            <Type className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Visit Eiffel Tower"
              className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Type and Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Type Select */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Activity Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ItineraryItemType)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              disabled={isSubmitting}
            >
              <option value="activity">🎯 Activity</option>
              <option value="flight">✈️ Flight</option>
              <option value="hotel">🏨 Hotel</option>
              <option value="restaurant">🍽️ Restaurant</option>
              <option value="transport">🚗 Transport</option>
              <option value="sightseeing">📷 Sightseeing</option>
              <option value="meeting">☕ Meeting</option>
              <option value="note">📝 Note</option>
            </select>
          </div>

          {/* Time Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this activity..."
            rows={3}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none transition-all"
            disabled={isSubmitting}
          />
        </div>

        {/* Location Section */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Location (Optional)
          </label>
          
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors text-slate-300 font-medium"
              disabled={isSubmitting}
            >
              <MapPin size={18} />
              {location ? "Update Location" : "Set Location"}
            </button>
            
            {location && (
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <MapPin className="text-blue-400" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">
                      {location.name || "Selected Location"}
                    </p>
                    {location.address && (
                      <p className="text-sm text-slate-400 mt-1">
                        {location.address}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocation(null)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove location"
                    disabled={isSubmitting}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-slate-600">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                {item ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                <Save size={18} />
                {item ? "Update Activity" : "Add Activity"}
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 bg-slate-700 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Location Picker Modal */}
      {showPicker && (
        <LocationPicker
          isOpen={showPicker}
          onClose={() => setShowPicker(false)}
          onSelect={async (loc) => {
            try {
              const result = await import("../../services/geocodeService").then(
                (m) => m.reverseGeocode(loc.lat, loc.lng)
              );
              setLocation({
                name: result.name,
                lat: loc.lat,
                lng: loc.lng,
                address: result.address,
              });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              setLocation({
                name: "Unknown place",
                lat: loc.lat,
                lng: loc.lng,
                address: "",
              });
            }
            setShowPicker(false);
          }}
        />
      )}
    </div>
  );
}