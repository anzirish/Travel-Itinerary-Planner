import { useState } from "react";
import ItemEditor from "./ItemEditor";
import type { Trip, ItineraryItem } from "../../Types/trip";
import * as tripService from "../../services/tripService.firebase";
import {
  Plus,
  MapPin,
  Clock,
  Calendar,
  Edit3,
  Trash2,
  Coffee,
  Camera,
  Utensils,
  Car,
  Plane,
  Building,
  Star,
} from "lucide-react";

interface DayViewProps {
  trip: Trip;
  onChange?: () => void;
}

/**
 * DayView Component - Displays trip itinerary organized by days
 * Features beautiful cards, type-specific icons, and smooth interactions
 */
export default function DayView({ trip, onChange }: DayViewProps) {
  const [editingItem, setEditingItem] = useState<{
    date: string;
    item?: ItineraryItem;
  } | null>(null);

  const days = getDatesBetween(trip.startDate, trip.endDate);

  /**
   * Handle item deletion with confirmation
   */
  const handleDelete = async (itemId: string, itemTitle: string) => {
    if (confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
      await tripService.deleteItem(trip.id, itemId);
      if (onChange) {
        onChange();
      }
    }
  };

  /**
   * Get icon based on item type
   */
  const getTypeIcon = (type: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const iconMap: { [key: string]: any } = {
      flight: Plane,
      hotel: Building,
      restaurant: Utensils,
      activity: Star,
      transport: Car,
      sightseeing: Camera,
      meeting: Coffee,
      default: Calendar,
    };
    return iconMap[type.toLowerCase()] || iconMap.default;
  };

  /**
   * Get color scheme based on item type (dark theme)
   */
  const getTypeColors = (type: string) => {
    const colorMap: { [key: string]: string } = {
      flight: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      hotel: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      restaurant: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      activity: "bg-green-500/20 text-green-400 border-green-500/30",
      transport: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      sightseeing: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      meeting: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      default: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };
    return colorMap[type.toLowerCase()] || colorMap.default;
  };

  /**
   * Format date for display
   */
  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time for accurate comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return {
        label: "Today",
        date: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        isToday: true,
      };
    } else if (date.getTime() === tomorrow.getTime()) {
      return {
        label: "Tomorrow",
        date: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        isTomorrow: true,
      };
    } else {
      return {
        label: date.toLocaleDateString("en-US", { weekday: "long" }),
        date: date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        isRegular: true,
      };
    }
  };

  /**
   * Format time for display
   */
  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  /**
   * Get day items sorted by time
   */
  const getDayItems = (day: string) => {
    return trip.items
      .filter((item) => item.start.slice(0, 10) === day)
      .sort((a, b) => a.start.localeCompare(b.start));
  };

  return (
    <div className="space-y-6">
      {days.map((day, dayIndex) => {
        const dateInfo = formatDateHeader(day);
        const dayItems = getDayItems(day);

        return (
          <div
            key={day}
            className="bg-slate-800 rounded-lg border border-slate-600 overflow-hidden"
          >
            {/* Day Header */}
            <div
              className={`px-6 py-4 border-b border-slate-600 ${
                dateInfo.isToday
                  ? "bg-blue-500/10"
                  : dateInfo.isTomorrow
                  ? "bg-green-500/10"
                  : "bg-slate-700/30"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      dateInfo.isToday
                        ? "bg-blue-600"
                        : dateInfo.isTomorrow
                        ? "bg-green-600"
                        : "bg-slate-600"
                    }`}
                  >
                    <Calendar size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-semibold text-white">
                        Day {dayIndex + 1}
                      </h3>
                      {dateInfo.isToday && (
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                          Today
                        </span>
                      )}
                      {dateInfo.isTomorrow && (
                        <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                          Tomorrow
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300">{dateInfo.date}</p>
                  </div>
                </div>

                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium transition-colors flex items-center gap-2"
                  onClick={() => setEditingItem({ date: day })}
                >
                  <Plus size={18} />
                  Add Item
                </button>
              </div>
            </div>

            {/* Day Content */}
            <div className="p-6">
              {/* Items List */}
              {dayItems.length > 0 ? (
                <div className="space-y-4">
                  {dayItems.map((item) => {
                    const TypeIcon = getTypeIcon(item.type);
                    const typeColors = getTypeColors(item.type);

                    return (
                      <div
                        key={item.id}
                        className="group bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600/50 p-4 transition-all duration-200"
                      >
                        <div className="flex justify-between items-center">
                          {/* Item Content */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Type Icon */}
                            <div
                              className={`p-2 rounded-lg border ${typeColors}`}
                            >
                              <TypeIcon size={18} />
                            </div>

                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-white text-lg truncate">
                                  {item.title}
                                </h4>
                                <span
                                  className={`px-3 py-1 text-xs font-medium rounded-full border ${typeColors}`}
                                >
                                  {item.type}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-slate-400">
                                {/* Time */}
                                <div className="flex items-center gap-2">
                                  <Clock size={14} />
                                  <span className="font-medium">
                                    {formatTime(item.start.slice(11, 16))}
                                    {item.end &&
                                      ` - ${formatTime(
                                        item.end.slice(11, 16)
                                      )}`}
                                  </span>
                                </div>

                                {/* Location */}
                                {item.location?.name && (
                                  <div className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    <span className="truncate">
                                      {item.location.name}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Description */}
                              {item.details && (
                                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                                  {item.details}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              onClick={() =>
                                setEditingItem({ date: day, item })
                              }
                              title="Edit item"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              onClick={() => handleDelete(item.id, item.title)}
                              title="Delete item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-slate-300 font-medium text-lg mb-2">
                    No Activities Planned
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Start building your day by adding activities, meals, or
                    events
                  </p>
                  <button
                    onClick={() => setEditingItem({ date: day })}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add First Activity
                  </button>
                </div>
              )}

              {/* Item Editor Modal */}
              {editingItem && editingItem.date === day && (
                <div className="mt-6 p-6 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="mb-4">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      {editingItem.item ? (
                        <>
                          <Edit3 size={16} />
                          Edit Activity
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          Add New Activity
                        </>
                      )}
                    </h4>
                    <p className="text-slate-400 text-sm mt-1">
                      {dateInfo.label} - {dateInfo.date}
                    </p>
                  </div>
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
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Trip Summary Footer */}
      {days.length > 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Trip Overview</h3>
                <p className="text-slate-400 text-sm">
                  {days.length} day{days.length !== 1 ? "s" : ""} •{" "}
                  {trip.items.length} activit
                  {trip.items.length !== 1 ? "ies" : "y"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-400 text-xs mb-1">
                Total Activities
              </div>
              <div className="text-2xl font-bold text-slate-300">
                {trip.items.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Generate array of date strings between start and end dates
 */
function getDatesBetween(startISO: string, endISO: string): string[] {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const days: string[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }

  return days;
}
