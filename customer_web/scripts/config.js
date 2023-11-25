import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCh9bbbl2US37adk_SYsrUIy0A7_7USwV4",
    authDomain: "cafemironapp.firebaseapp.com",
    databaseURL: "https://cafemironapp-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cafemironapp",
    storageBucket: "cafemironapp.appspot.com",
    messagingSenderId: "711386017052",
    appId: "1:711386017052:web:3b4fea68f38dd797385ed9",
    measurementId: "G-2M0LXYWPRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();
const firestoreDB = getFirestore(app);
const storage = getStorage(app);

export { db, firestoreDB, storage };