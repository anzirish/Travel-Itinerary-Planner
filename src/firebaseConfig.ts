import { initializeApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJ_AXLqTGiz7QCOg-D6KjyJuw-zmn2PBM",
  authDomain: "travel-itinerary-ea182.firebaseapp.com",
  projectId: "travel-itinerary-ea182",
  storageBucket: "travel-itinerary-ea182.firebasestorage.app",
  messagingSenderId: "631118303406",
  appId: "1:631118303406:web:8eb832784025b6ac459d3f"
};

// initialize Firebase app
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// try to enable persistent (IndexedDB) local cache with multi-tab support.
// if that fails (browser doesn't support it or the call throws), fall back to an in-memory cache.
let db: Firestore;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      // use multi-tab manager so multiple browser tabs share the same cache
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (err) {
  // persistentLocalCache failed (e.g. unsupported environment) — fall back to memory cache
  // this keeps the app working (no IndexedDB persistence), but without offline persistence across reloads
  // check the console for the original error to debug environment-specific issues
   
  console.warn("persistentLocalCache failed, falling back to memory cache:", err);
  db = initializeFirestore(app, {
    localCache: memoryLocalCache(),
  });
}

export { app, db };