import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { ItineraryItem } from "../../Types/trip";
import L from "leaflet";
import { useEffect } from "react";

interface MapPanelProps {
  items: ItineraryItem[];
}

// Helper component: fit map bounds to markers
function FitBounds({ items }: { items: ItineraryItem[] }) {
  const map = useMap();

  useEffect(() => {
    const bounds: L.LatLngTuple[] = items
      .filter((it) => it.location && it.location.lat && it.location.lng)
      .map((it) => [it.location!.lat, it.location!.lng]);

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [items, map]);

  return null;
}

// Default Leaflet marker fix (React-Leaflet needs explicit icon setup sometimes)
const defaultIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export default function MapPanel({ items }: MapPanelProps) {
  return (
    <div className="h-96 border rounded overflow-hidden">
      <MapContainer
        center={[20, 0]} // Default center (world view)
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
        />

        {items
          .filter((it) => it.location && it.location.lat && it.location.lng)
          .map((it) => (
            <Marker
              key={it.id}
              position={[it.location!.lat, it.location!.lng]}
              icon={defaultIcon}
            >
              <Popup>
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-gray-600">{it.location?.address}</div>
              </Popup>
            </Marker>
          ))}

        <FitBounds items={items} />
      </MapContainer>
    </div>
  );
}
