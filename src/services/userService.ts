import { collection, query, where, getDocs } from "firebase/firestore";
import type { Collaborator } from "../Types/trip";
import { db } from "../firebaseConfig";

export async function findUserByEmail(email: string): Promise<Collaborator | null> {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const data = snap.docs[0].data();

  return {
    uid: data.uid as string,
    email: data.email as string,
  };
}
