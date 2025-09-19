// authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// sign up
export async function register(email: string, password: string) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;
  // save user profile in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
  });
  return user;
}

import { getDocs, collection, query, where } from "firebase/firestore";

export async function findUserByEmail(email: string): Promise<string | null> {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].id; // UID
}


// login
export async function login(email: string, password: string) {
    console.log('logging')
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

// logout
export async function logout() {
  await signOut(auth);
}

// subscribe to auth state
export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
