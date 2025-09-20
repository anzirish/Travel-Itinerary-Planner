import type { Trip } from "../../Types/trip";
import { TripCard } from "./TripCard";
import { EmptyState } from "./EmptyState";

interface TripsListProps {
  trips: Trip[];
  onDeleteRequest: (trip: Trip) => void;
}

export const TripsList = ({ trips, onDeleteRequest }: TripsListProps) => {
  if (trips.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <TripCard 
          key={trip.id} 
          trip={trip} 
          onDeleteRequest={() => onDeleteRequest(trip)} 
        />
      ))}
    </div>
  );
};