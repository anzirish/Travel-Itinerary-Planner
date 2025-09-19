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

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  items: ItineraryItem[];
  expenses?: Expense[];
  packingList?: PackingItem[];   //  to be used next
  documents?: TravelDocument[];  //  later
  reviews?: Review[];            //  later
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