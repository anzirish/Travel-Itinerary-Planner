import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { ItineraryItem } from "../../Types/trip";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon path
// Use TS-ignore for this untyped property
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapPanelProps {
  items: ItineraryItem[];
  center?: [number, number];
  zoom?: number;
}

export default function MapPanel({
  items,
  center = [0, 0],
  zoom = 2,
}: MapPanelProps) {
  const markers = items.filter((it) => it.location);

  return (
    <div className="h-96 w-full rounded overflow-hidden shadow-sm">
      <MapContainer center={center} zoom={zoom} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map((it) => (
          <Marker
            key={it.id}
            position={
              [it.location!.lat, it.location!.lng] as L.LatLngExpression
            }
          >
            <Popup>
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-gray-500">{it.type}</div>
              {it.location?.address && (
                <div className="text-sm text-gray-400">
                  {it.location.address}
                </div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
