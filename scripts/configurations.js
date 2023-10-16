// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCh9bbbl2US37adk_SYsrUIy0A7_7USwV4",
  authDomain: "cafemironapp.firebaseapp.com",
  databaseURL: "https://cafemironapp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cafemironapp",
  storageBucket: "cafemironapp.appspot.com",
  messagingSenderId: "711386017052",
  appId: "1:711386017052:web:72e9acb17d90d6c0385ed9",
  measurementId: "G-9M2F1W265L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const db = getDatabase();
const firestoreDB = getFirestore(app);
const auth = getAuth(app);

export { db, firestoreDB, auth };