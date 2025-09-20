import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as tripService from "../services/tripService.firebase";
import type { Trip } from "../Types/trip";
import {
  Calendar,
  MapPin,
  CloudSun,
  DollarSign,
  Package,
  FileText,
  Star,
  Share2,
  Clock,
  Users,
  ArrowLeft,
  Loader2,
  Search,
  Bell,
  Settings,
  User,
  Home,
  Plane,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DocumentsTab from "../components/trip/DocumentsTab";
import ItineraryTab from "../components/trip/ItineraryTab";
import MapTab from "../components/trip/MapTab";
import WeatherPanel from "../features/weather/WeatherPanel";
import PackingTab from "../components/trip/PackingTab";
import ExpensesTab from "../components/trip/ExpensesTab";
import ReviewsTab from "../components/trip/ReviewsTab";
import ShareTab from "../components/trip/ShareTab";

/**
 * TripPage Component - Detailed trip management interface with parent UI
 * Features tabbed navigation, trip overview, and comprehensive trip management tools
 */
export default function TripPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [isLoading, setIsLoading] = useState(true);
  const [showParentUI, setShowParentUI] = useState(!id); // Show parent UI if no trip ID

  /**
   * Subscribe to real-time trip updates
   */
  useEffect(() => {
    if (!id) {
      setShowParentUI(true);
      setIsLoading(false);
      return;
    }

    const unsubscribe = tripService.subscribeTrip(id, (tripData) => {
      setTrip(tripData ?? null);
      setShowParentUI(false);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  /**
   * Calculate trip duration in days
   */
  const getTripDuration = (trip: Trip) => {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  /**
   * Get trip status based on dates
   */
  const getTripStatus = (trip: Trip) => {
    const today = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    if (today < startDate) {
      return {
        label: "Upcoming",
        className: "bg-blue-100 text-blue-800",
        icon: Clock,
      };
    } else if (today >= startDate && today <= endDate) {
      return {
        label: "Active",
        className: "bg-green-100 text-green-800",
        icon: Users,
      };
    } else {
      return {
        label: "Completed",
        className: "bg-gray-100 text-gray-800",
        icon: Star,
      };
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const tabs = [
    { id: "itinerary", label: "Itinerary", icon: Calendar },
    { id: "map", label: "Map", icon: MapPin },
    { id: "weather", label: "Weather", icon: CloudSun },
    { id: "expenses", label: "Expenses", icon: DollarSign },
    { id: "packing", label: "Packing", icon: Package },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "share", label: "Share", icon: Share2 },
  ];

  const mainTabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "trips", label: "My Trips", icon: Plane },
    { id: "explore", label: "Explore", icon: Search },
    { id: "profile", label: "Profile", icon: User },
  ];

  const [parentActiveTab, setParentActiveTab] = useState("dashboard");

  // Parent UI Components
  const ParentHeader = () => (
    <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-white">
              🎯 Travel Planner
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
              <Search size={20} />
            </button>
            <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
              <Bell size={20} />
            </button>
            <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ParentNavigation = () => (
    <div className="bg-slate-800 rounded-2xl border border-slate-600 p-2 shadow-lg mb-8">
      <div className="flex gap-2">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setParentActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                parentActiveTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Explorer!</h2>
        <p className="text-blue-100 mb-6">
          Ready for your next adventure? Let's plan something amazing.
        </p>
        <button
          onClick={() => navigate("/trip/new")}
          className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Plan New Trip
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Plane className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-slate-300">Total Trips</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <MapPin className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">23</p>
              <p className="text-slate-300">Countries Visited</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Clock className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">156</p>
              <p className="text-slate-300">Days Traveled</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Recent Trips</h3>
        <div className="text-center text-slate-300 py-12">
          <div className="text-6xl mb-4">✈️</div>
          <p>Your trips will appear here</p>
          <button
            onClick={() => setParentActiveTab("trips")}
            className="mt-4 text-blue-400 hover:text-blue-300 font-medium"
          >
            View All Trips →
          </button>
        </div>
      </div>
    </div>
  );

  const TripsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Trips</h2>
        <button
          onClick={() => navigate("/trip/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          New Trip
        </button>
      </div>

      <div className="text-center text-slate-300 py-12">
        <div className="text-6xl mb-4">🗂️</div>
        <p>Your trip list will appear here</p>
        <p className="text-sm mt-2 text-slate-400">
          Connected to your tripService.firebase
        </p>
      </div>
    </div>
  );

  const ParentContent = () => (
    <div className="bg-slate-800 rounded-2xl border border-slate-600 shadow-lg p-8">
      {parentActiveTab === "dashboard" && <DashboardContent />}
      {parentActiveTab === "trips" && <TripsContent />}
      {parentActiveTab === "explore" && (
        <div className="text-center text-slate-300">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2 text-white">
            Explore Destinations
          </h2>
          <p>Discover amazing places for your next adventure</p>
        </div>
      )}
      {parentActiveTab === "profile" && (
        <div className="text-center text-slate-300">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold mb-2 text-white">Your Profile</h2>
          <p>Manage your account and travel preferences</p>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin text-blue-400 mx-auto mb-4"
            size={48}
          />
          <p className="text-slate-300">Loading your trip details...</p>
        </div>
      </div>
    );
  }

  // Show parent UI when no trip ID
  if (showParentUI) {
    return (
      <div className="min-h-screen bg-slate-900">
        <ParentHeader />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <ParentNavigation />
          <ParentContent />
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="fixed bottom-20 right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="fixed top-1/2 right-4 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-2">Trip Not Found</h2>
          <p className="text-slate-300 mb-6">
            The trip you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  const status = getTripStatus(trip);
  const StatusIcon = status.icon;

  // Original trip detail view - dark theme
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header Section */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back to Trips</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Trip Title and Details */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold text-white">
                  🎯 {trip.title}
                </h1>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-2 ${status.className}`}
                >
                  <StatusIcon size={14} />
                  {status.label}
                </span>
              </div>

              {/* Trip Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Start Date */}
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Calendar className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Start Date</p>
                      <p className="font-semibold text-white">
                        {formatDate(trip.startDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* End Date */}
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                      <Calendar className="text-indigo-400" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">End Date</p>
                      <p className="font-semibold text-white">
                        {formatDate(trip.endDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Clock className="text-purple-400" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Duration</p>
                      <p className="font-semibold text-white">
                        {getTripDuration(trip)} days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="bg-slate-800 rounded-2xl border border-slate-600 p-2 mb-8 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="bg-slate-800 rounded-2xl border border-slate-600 shadow-lg overflow-hidden">
          <div className="p-6 lg:p-8">
            {/* Tab Contents */}
            {activeTab === "itinerary" && <ItineraryTab trip={trip} />}
            {activeTab === "map" && <MapTab trip={trip} />}
            {activeTab === "weather" && <WeatherPanel trip={trip} />}
            {activeTab === "documents" && <DocumentsTab trip={trip} />}
            {activeTab === "expenses" && <ExpensesTab trip={trip} />}
            {activeTab === "packing" && <PackingTab trip={trip} />}
            {activeTab === "reviews" && <ReviewsTab trip={trip} />}
            {activeTab === "share" && <ShareTab trip={trip} />}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="fixed top-1/2 right-4 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}
