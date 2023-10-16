import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB,auth } from './configurations.js';


async function registerUser() {
    const regEmail = document.getElementById("regEmail").value;
    const username = document.getElementById("username").value;
    const phone = document.getElementById("phone").value;
    const regPassword = document.getElementById("regPassword").value;
    const residentialAddress = document.getElementById("residentialAddress").value;
  
    // Perform client-side form validation (you can customize this part)
    if (!regEmail || !username || !phone || !regPassword || !residentialAddress) {
      alert("All fields are required.");
      return;
    }
  
    // Register the user with Firebase Authentication
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const user = userCredential.user;
  
      // User registration successful, now add user data to Firestore
      const usersCollection = collection(firestoreDB, "users");
      await addDoc(usersCollection, {
        uid: user.uid,
        email: regEmail,
        username: username,
        phone: phone,
        residentialAddress: residentialAddress
      });
  
      alert("User registered successfully!");
    } catch (error) {
      alert("Registration failed. " + error.message);
    }
  }

// Add a click event listener to the Register button
document.getElementById("register-button").addEventListener("click", registerUser);
