export type ItineraryItemType = "flight" | "hotel" | "activity" | "note";

export interface ItineraryItem {
  id: string;
  type: ItineraryItemType;
  title: string;
  start: string;
  end?: string;
  location?: { name: string; lan: number; lat: number; address: string } | null;
  details?: Record<string, unknown>;
}

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  items: ItineraryItem[];
}