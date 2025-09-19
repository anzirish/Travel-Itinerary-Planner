export type ItineraryItemType = "flight" | "hotel" | "activity" | "note";

export interface ItineraryItem {
  id: string;
  type: ItineraryItemType;
  title: string;
  start: string;
  end?: string;
  location?: { name: string; lng: number; lat: number; address: string } | null;
  details?: Record<string, unknown>;
}

export interface PackingItem {
  id: string;
  name: string;
  packed: boolean;
}

export interface WeatherForecast {
  date: string;       // ISO date
  temp: number;       // Celsius
  description: string; 
}

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  items: ItineraryItem[];
  expenses?: Expense[];
  packingList?: PackingItem[];
  weather?: WeatherForecast[]; // optional forecast data
  documents?: TravelDocument[];
  reviews?: Review[];
}

export interface Expense {
  id: string;
  category: "flight" | "hotel" | "food" | "activity" | "transport" | "other";
  amount: number;
  note?: string;
  date: string; // ISO date
}

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  items: ItineraryItem[];
  expenses?: Expense[];
}