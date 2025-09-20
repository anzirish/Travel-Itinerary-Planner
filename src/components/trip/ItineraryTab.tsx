import DayView from "../../features/itinarery/DayView";
import type { Trip } from "../../Types/trip";

export default function ItineraryTab({ trip }: { trip: Trip }) {
  return (
    <div>
      <DayView trip={trip} />
    </div>
  );
}
