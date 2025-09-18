import * as db from "../lib/db";
import type { Expense, ItineraryItem, Trip } from "../Types/trip";
import { v4 as uuid } from "uuid";

export async function listTrips(): Promise<Trip[]> {
  return db.getTrips();
}

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
  };
  await db.saveTrip(trip);
  return trip;
}

export async function loadTrip(id: string): Promise<Trip | undefined> {
  return db.getTrip(id);
}

export async function saveTrip(trip: Trip) {
  return db.saveTrip(trip);
}

export function removeTrip(id: string) {
  return db.deleteTrip(id);
}

export async function deleteItem(tripId: string, itemId: string) {
  const trip = await db.getTrip(tripId);
  if (!trip) {
    throw new Error("Trip not found");
  }
  trip.items = trip.items.filter((it) => it.id !== itemId);
  await db.saveTrip(trip);
  return true;
}

export async function addItem(tripId: string, item: Omit<ItineraryItem, "id">) {
  const trip = await db.getTrip(tripId);
  if (!trip) {
    throw new Error("Trip not found");
  }
  const newItem: ItineraryItem = { ...item, id: uuid() } as ItineraryItem;
  trip.items.push(newItem);
  await db.saveTrip(trip);
  return newItem;
}

export async function addExpense(tripId: string, expense: Omit<Expense, "id">) {
  const trip = await db.getTrip(tripId);
  if (!trip) throw new Error("Trip not found");
  const newExpense: Expense = { ...expense, id: uuid() };
  trip.expenses = [...(trip.expenses ?? []), newExpense];
  await db.saveTrip(trip);
  return newExpense;
}

export async function deleteExpense(tripId: string, expenseId: string) {
  const trip = await db.getTrip(tripId);
  if (!trip) throw new Error("Trip not found");
  trip.expenses = (trip.expenses ?? []).filter((e) => e.id !== expenseId);
  await db.saveTrip(trip);
}