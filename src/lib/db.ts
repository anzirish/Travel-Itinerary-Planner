import { openDB } from "idb";
import type { Trip } from "../Types/trip";

const DB_NAME = "travelPlanner";
const STORE = "trips";

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    },
  });
}

export async function saveTrip(trip: Trip) {
const db = await getDB();
return db.put(STORE, trip);
}

export async function getTrips() : Promise<Trip[]> {
    const db = await getDB()
    return db.getAll(STORE) as Promise<Trip[]>
}

export async function getTrip(id:string):Promise<Trip|undefined> {
    const db = await getDB()
    return db.get(STORE, id) as Promise<Trip | undefined>
}

export async function deleteTrip(id:string) {
    const db = await getDB()
    return db.delete(STORE, id)
}