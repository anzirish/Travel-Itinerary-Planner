// tripService.firebase.ts
import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import type { Expense, ItineraryItem, PackingItem, Trip } from "../Types/trip";
import { v4 as uuid } from "uuid";
import { auth } from "../firebaseConfig";

function getTripsCol() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return collection(db, "users", user.uid, "trips");
}

// subscribe to all trips
export function subscribeTrips(callback: (trips: Trip[]) => void) {
  return onSnapshot(getTripsCol(), (snap) => {
    const trips = snap.docs.map((d) => d.data() as Trip);
    callback(trips);
  });
}

// create new trip
export async function createTrip(data: {
  title: string;
  startDate: string;
  endDate: string;
}): Promise<Trip> {
  const trip: Trip = {
    id: uuid(),
    title: data.title,
    startDate: data.startDate,
    endDate: data.endDate,
    items: [],
    expenses: [],
    packingList: [],
  };
  await setDoc(doc(getTripsCol(), trip.id), trip);
  return trip;
}

// subscribe to single trip
export function subscribeTrip(
  id: string,
  callback: (trip: Trip | undefined) => void
) {
  return onSnapshot(doc(getTripsCol(), id), (snap) => {
    if (snap.exists()) {
      callback(snap.data() as Trip);
    } else {
      callback(undefined);
    }
  });
}

// load once (not realtime, just helper)
export async function loadTrip(id: string): Promise<Trip | undefined> {
  const ref = doc(getTripsCol(), id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as Trip) : undefined;
}

// save/update trip
export async function saveTrip(trip: Trip) {
  await setDoc(doc(getTripsCol(), trip.id), trip);
}

// delete trip
export async function removeTrip(id: string) {
  await deleteDoc(doc(getTripsCol(), id));
}

// delete itinerary item
export async function deleteItem(tripId: string, itemId: string) {
  const trip = await loadTrip(tripId);
  if (!trip) throw new Error("Trip not found");
  trip.items = trip.items.filter((it) => it.id !== itemId);
  await saveTrip(trip);
  return true;
}

// add itinerary item
export async function addItem(tripId: string, item: Omit<ItineraryItem, "id">) {
  const trip = await loadTrip(tripId);
  if (!trip) throw new Error("Trip not found");
  const newItem: ItineraryItem = { ...item, id: uuid() } as ItineraryItem;
  trip.items.push(newItem);
  await saveTrip(trip);
  return newItem;
}

// add expense
export async function addExpense(tripId: string, expense: Omit<Expense, "id">) {
  const trip = await loadTrip(tripId);
  if (!trip) throw new Error("Trip not found");
  const newExpense: Expense = { ...expense, id: uuid() };
  trip.expenses = [...(trip.expenses ?? []), newExpense];
  await saveTrip(trip);
  return newExpense;
}

// delete expense
export async function deleteExpense(tripId: string, expenseId: string) {
  const trip = await loadTrip(tripId);
  if (!trip) throw new Error("Trip not found");
  trip.expenses = (trip.expenses ?? []).filter((e) => e.id !== expenseId);
  await saveTrip(trip);
}

// add packing item
export async function addPackingItem(tripId: string, name: string) {
  const trip = await loadTrip(tripId);
  if (!trip) throw new Error("Trip not found");
  const newItem: PackingItem = { id: uuid(), name, packed: false };
  trip.packingList = [...(trip.packingList ?? []), newItem];
  await saveTrip(trip);
  return newItem;
}

// toggle packing item
export async function togglePackingItem(tripId: string, itemId: string) {
  const trip = await loadTrip(tripId);
  if (!trip) throw new Error("Trip not found");
  trip.packingList = (trip.packingList ?? []).map((item) =>
    item.id === itemId ? { ...item, packed: !item.packed } : item
  );
  await saveTrip(trip);
}

// remove packing item
export async function removePackingItem(tripId: string, itemId: string) {
  const trip = await loadTrip(tripId);
  if (!trip) throw new Error("Trip not found");
  trip.packingList = (trip.packingList ?? []).filter((i) => i.id !== itemId);
  await saveTrip(trip);
}
