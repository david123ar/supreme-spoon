import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCqUTH6qNdJe89cQ2vqD8tpOk6FL9b2Zk",
  authDomain: "fir-to-firestore.firebaseapp.com",
  projectId: "firebase-to-firestore",
  storageBucket: "firebase-to-firestore.appspot.com",
  messagingSenderId: "547489165252",
  appId: "1:547489165252:web:73260715c633067075be91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
