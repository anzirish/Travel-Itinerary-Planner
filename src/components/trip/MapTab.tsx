import L from "leaflet";
import type { ItineraryItem, Trip } from "../../Types/trip";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

export default function MapTab({ trip }: { trip: Trip }) {
  const items = trip.items;
    
    // Custom marker icon with blue theme
    const customIcon = new L.Icon({
      iconUrl: "data:image/svg+xml;base64," + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                fill="#3b82f6" stroke="#1d4ed8" stroke-width="1"/>
          <circle cx="12" cy="9" r="3" fill="white"/>
        </svg>
      `),
      iconSize: [24, 36],
      iconAnchor: [12, 36],
      popupAnchor: [0, -36],
      shadowUrl: "data:image/svg+xml;base64," + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 41" width="41" height="41">
          <ellipse cx="20.5" cy="37" rx="18" ry="4" fill="rgba(0,0,0,0.2)"/>
        </svg>
      `),
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    });
  
    function FitBounds({ items }: { items: ItineraryItem[] }) {
      const map = useMap();
  
      useEffect(() => {
        const bounds: L.LatLngTuple[] = items
          .filter((it) => it.location && it.location.lat && it.location.lng)
          .map((it) => [it.location!.lat, it.location!.lng]);
  
        if (bounds.length > 0) {
          map.fitBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 15 
          });
        }
      }, [items, map]);
  
      return null;
    }
  
    return (
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Trip Map</h3>
              <p className="text-gray-400 text-sm">{items.filter(it => it.location).length} locations</p>
            </div>
          </div>
          
          {/* Map controls */}
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
  
        {/* Map Container */}
        <div className="relative h-96 bg-gray-900 rounded-b-lg overflow-hidden border-2 border-gray-700">
          {/* Loading overlay */}
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10 opacity-0 pointer-events-none transition-opacity">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-300">Loading map...</span>
            </div>
          </div>
  
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            {/* Clean, modern map tiles */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              className="map-tiles"
            />
  
            {items
              .filter((it) => it.location && it.location.lat && it.location.lng)
              .map((it, index) => (
                <Marker
                  key={it.id}
                  position={[it.location!.lat, it.location!.lng]}
                  icon={customIcon}
                >
                  <Popup
                    className="custom-popup"
                    closeButton={false}
                  >
                    <div className="bg-gray-800 text-white p-3 rounded-lg shadow-xl border border-gray-600 min-w-48">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm mb-1 truncate">
                            {it.title}
                          </h4>
                          {it.location?.address && (
                            <p className="text-gray-300 text-xs leading-relaxed">
                              {it.location.address}
                            </p>
                          )}
                          {it.details && (
                            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                              {it.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
  
            <FitBounds items={items} />
          </MapContainer>
  
          {/* Map overlay elements */}
          <div className="absolute bottom-4 left-4 z-20">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-300 text-xs font-medium">
                  {items.filter(it => it.location).length} stops
                </span>
              </div>
            </div>
          </div>
  
          {/* Zoom controls overlay */}
          <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1">
            <button className="w-8 h-8 bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 rounded border border-gray-600 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 rounded border border-gray-600 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
}
