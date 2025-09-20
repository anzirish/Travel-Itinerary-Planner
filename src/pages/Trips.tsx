import { useEffect, useState } from "react";
import { CreateTripForm } from "../components/trips/CreateTripForm";
import { DeleteConfirmationModal } from "../components/trips/DeleteConfirmationModal";
import { LoadingSpinner } from "../components/trips/LoadingSpinner";
import * as tripService from "../services/tripService.firebase";
import { TripsList } from "../components/trips/TripsList";
import type { Trip } from "../Types/trip";
import { useNavigate } from "react-router-dom";

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  /**
   * Subscribe to real-time trip updates from Firebase
   * Automatically updates UI when trips are added/removed/modified
   */
  useEffect(() => {
    const unsubscribe = tripService.subscribeTrips((allTrips) => {
      setTrips(allTrips);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  /**
   * Handle successful trip creation
   * Updates local state and navigates to new trip
   */
  const handleTripCreated = (newTrip: Trip) => {
    setTrips((prevTrips) => [newTrip, ...prevTrips]);
    navigate(`/trip/${newTrip.id}`);
  };

  /**
   * Handle trip deletion request - opens confirmation modal
   */
  const handleDeleteRequest = (trip: Trip) => {
    setTripToDelete(trip);
  };

  /**
   * Handle confirmed trip deletion
   */
  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;
    
    setIsDeleting(true);
    try {
      await tripService.removeTrip(tripToDelete.id);
      setTripToDelete(null);
    } catch (error) {
      console.error("Error deleting trip:", error);
      // Could add error toast here
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle deletion cancellation
   */
  const handleCancelDelete = () => {
    setTripToDelete(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ✈️ Your Travel Adventures
          </h1>
          <p className="text-slate-300">Plan, organize, and track your amazing journeys</p>
        </div>

        {/* Trip Creation Form */}
        <CreateTripForm onTripCreated={handleTripCreated} />

        {/* Trips List */}
        <TripsList 
          trips={trips} 
          onDeleteRequest={handleDeleteRequest} 
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={tripToDelete !== null}
          tripTitle={tripToDelete?.title || ''}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
        
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="fixed top-1/2 right-4 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
};

export default Trips;