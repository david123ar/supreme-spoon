// firebase.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore if needed
import { getAuth } from "firebase/auth"; // Import Auth if needed
import { getStorage } from "firebase/storage"; // Import Storage if needed

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRX40ECHTwjtEfEYFdjcWG6R4_lyJwibM",
  authDomain: "oppo-53ea5.firebaseapp.com",
  projectId: "oppo-53ea5",
  storageBucket: "oppo-53ea5.appspot.com",
  messagingSenderId: "848670914715",
  appId: "1:848670914715:web:8be3ce5f45d4e4ed2f2e3e",
  measurementId: "G-BHE64YS3QH"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Optional: Initialize analytics if needed (ensure this is used only in the browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Optionally export other Firebase services
const db = getFirestore(app); // Firestore
const auth = getAuth(app); // Firebase Auth
const storage = getStorage(app); // Firebase Storage

export { app, analytics, db, auth, storage };
