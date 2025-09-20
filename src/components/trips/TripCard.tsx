import { Link } from "react-router-dom";
import type { Trip } from "../../Types/trip";
import { Calendar, Trash2 } from "lucide-react";

interface TripCardProps {
  trip: Trip;
  onDeleteRequest: () => void;
}

export const TripCard = ({ trip, onDeleteRequest }: TripCardProps) => {
  /**
   * Calculate trip duration in days
   */
  const getTripDuration = () => {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  /**
   * Determine trip status based on current date
   */
  const getTripStatus = () => {
    const today = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    
    if (today < startDate) {
      return { label: "Upcoming", className: "bg-blue-500/20 text-blue-300 border-blue-500/30" };
    } else if (today >= startDate && today <= endDate) {
      return { label: "Active", className: "bg-green-500/20 text-green-300 border-green-500/30" };
    } else {
      return { label: "Completed", className: "bg-slate-500/20 text-slate-300 border-slate-500/30" };
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const status = getTripStatus();

  return (
    <div className="group bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 p-6 hover:shadow-2xl hover:bg-slate-800/90 hover:border-slate-600/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
      <div className="flex justify-between items-start">
        
        {/* Trip Information */}
        <div className="flex-1">
          <Link 
            to={`/trip/${trip.id}`} 
            className="block hover:no-underline"
          >
            {/* Trip Title */}
            <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2 flex items-center gap-3">
              🎯 {trip.title}
            </h3>
            
            {/* Date Information */}
            <div className="flex items-center gap-4 text-slate-300">
              {/* Start Date Badge */}
              <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full">
                <Calendar size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-blue-200">
                  {formatDate(trip.startDate)}
                </span>
              </div>
              
              <span className="text-slate-500">→</span>
              
              {/* End Date Badge */}
              <div className="flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full">
                <Calendar size={16} className="text-indigo-400" />
                <span className="text-sm font-medium text-indigo-200">
                  {formatDate(trip.endDate)}
                </span>
              </div>
            </div>
            
            {/* Trip Details and Status */}
            <div className="mt-3 flex items-center justify-between">
              {/* Duration */}
              <div className="text-sm text-slate-400">
                Duration: <span className="text-slate-300 font-medium">{getTripDuration()} days</span>
              </div>
              
              {/* Status Badge */}
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${status.className}`}>
                {status.label}
              </span>
            </div>
          </Link>
        </div>
        
        {/* Delete Button */}
        <div className="ml-4">
          <button
            className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-all font-medium border border-red-500/30 hover:border-red-400/50 group backdrop-blur-sm"
            onClick={onDeleteRequest}
          >
            <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
            Delete
          </button>
        </div>
      </div>

      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};