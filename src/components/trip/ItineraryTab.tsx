import DayView from "../../features/itinarery/DayView";
import ItemEditor from "../../features/itinarery/ItemEditor";
import type { Trip } from "../../Types/trip";

export default function ItineraryTab({ trip }: { trip: Trip }) {
  return (
    <div>
      <DayView trip={trip} />
      <div className="mt-4">
        <ItemEditor
          date={trip.startDate}
          tripId={trip.id}
          onClose={() => {}}
        />
      </div>
    </div>
  );
}
