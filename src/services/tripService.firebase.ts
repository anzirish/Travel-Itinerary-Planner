// tripService.firebase.ts
import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import type {
  Collaborator,
  Expense,
  ItineraryItem,
  PackingItem,
  Review,
  TravelDocument,
  Trip,
} from "../Types/trip";
import { query, where } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { auth } from "../firebaseConfig";
import { findUserByEmail } from "./userService";

function getTripsCol() {
  return collection(db, "trips");
}

// subscribe to a single trip in realtime
export function subscribeTrip(
  id: string,
  callback: (trip: Trip | undefined) => void
) {
  return onSnapshot(doc(db, "trips", id), (snap) => {
    if (snap.exists()) {
      callback(snap.data() as Trip);
    } else {
      callback(undefined);
    }
  });
}

// create new trip
export async function createTrip(data: {
  title: string;
  startDate: string;
  endDate: string;
}): Promise<Trip> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const trip: Trip = {
    id: uuid(),
    title: data.title,
    startDate: data.startDate,
    endDate: data.endDate,
    items: [],
    expenses: [],
    packingList: [],
    ownerId: user.uid,
    allowedUsers: [user.uid], // owner always has access
  };

  await setDoc(doc(getTripsCol(), trip.id), trip);
  return trip;
}

// add collaborator
export async function addCollaboratorByEmail(tripId: string, email: string) {
  const user: Collaborator | null = await findUserByEmail(email);
  if (!user) throw new Error("User not found with that email");

  const tripRef = doc(db, "trips", tripId);

  await updateDoc(tripRef, {
    allowedUsers: arrayUnion(user.uid), // ✅ works because uid is string
    collaborators: arrayUnion(user), // ✅ works because user is Collaborator
  });
}

export async function getUserById(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Remove collaborator
export async function removeCollaborator(tripId: string, uid: string) {
  const tripRef = doc(db, "trips", tripId);
  const snap = await getDoc(tripRef);
  if (!snap.exists()) throw new Error("Trip not found");

  const trip = snap.data() as Trip;

  const allowedUsers = (trip.allowedUsers || []).filter((u) => u !== uid);
  const collaborators = (trip.collaborators || []).filter((c) => c.uid !== uid);

  await updateDoc(tripRef, { allowedUsers, collaborators });
}

export function subscribeTrips(callback: (trips: Trip[]) => void) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const tripsQuery = query(
    collection(db, "trips"),
    where("allowedUsers", "array-contains", user.uid)
  );

  return onSnapshot(tripsQuery, (snap) => {
    const trips = snap.docs.map((d) => d.data() as Trip);
    callback(trips);
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

  const newExpense: Expense = {
    id: uuid(),
    category: expense.category,
    amount: expense.amount,
    note: expense.note ?? "",
    date: expense.date, // must come as ISO string
  };

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
  return true;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

// add review
export async function addReview(
  tripId: string,
  review: Omit<Review, "id" | "createdAt">
) {
  const trip = await loadTrip(tripId);
  if (!trip) throw new Error("Trip not found");

  const newReview: Review = {
    id: uuid(),
    userId: review.userId,
    rating: review.rating,
    comment: review.comment,
    createdAt: new Date().toISOString(),
  };

  trip.reviews = [...(trip.reviews ?? []), newReview];
  await saveTrip(trip);
  return newReview;
}

// delete review
export async function deleteReview(tripId: string, reviewId: string) {
  const trip = await loadTrip(tripId);
  if (!trip) throw new Error("Trip not found");

  trip.reviews = (trip.reviews ?? []).filter((r) => r.id !== reviewId);
  await saveTrip(trip);
}

// upload document (stored inline in Firestore)
export async function uploadDocument(
  tripId: string,
  file: File,
  userId: string
): Promise<TravelDocument> {
  const base64 = await fileToBase64(file);

  const newDoc: TravelDocument = {
    id: uuid(),
    name: file.name,
    base64,
    uploadedAt: new Date().toISOString(),
    uploadedBy: userId,
  };

  const trip = await loadTrip(tripId);
  if (!trip) throw new Error("Trip not found");

  trip.documents = [...(trip.documents ?? []), newDoc];
  await saveTrip(trip);

  return newDoc;
}

// delete document
export async function deleteDocument(tripId: string, docId: string) {
  const trip = await loadTrip(tripId);
  if (!trip) throw new Error("Trip not found");

  trip.documents = (trip.documents ?? []).filter((d) => d.id !== docId);
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
