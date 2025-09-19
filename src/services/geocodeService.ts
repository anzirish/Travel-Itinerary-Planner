// Simple reverse geocoding using OpenStreetMap Nominatim
export async function reverseGeocode(lat: number, lon: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch address");
  const data = await res.json();
  return {
    name: data.name || data.display_name || "Unknown place",
    address: data.display_name || "",
  };
}
