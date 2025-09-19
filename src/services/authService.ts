// authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebaseConfig";

// sign up
export async function register(email: string, password: string) {
    console.log('registeer')
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  return userCred.user;
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
