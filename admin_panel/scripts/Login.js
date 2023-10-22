import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { auth, firestoreDB } from './configurations.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");

registerButton.addEventListener("click", () => {
  const regEmail = document.getElementById("regEmail").value;
  const username = document.getElementById("username").value;
  const phone = document.getElementById("phone").value;
  const residentialAddress = document.getElementById("residentialAddress").value;
  const regPassword = document.getElementById("regPassword").value;

  // Create the user in Firebase Authentication
  createUserWithEmailAndPassword(auth, regEmail, regPassword)
    .then((userCredential) => {
      const user = userCredential.user;

      // Create a user object with additional details
      const userObject = {
        email: user.email,
        emailAddress: user.email,
        userName: username,
        phoneNumber: phone,
        residentialAddress: residentialAddress,
        password: regPassword,
        uid: user.uid,
      };

        addDoc(collection(firestoreDB, "users"), userObject)
          .then(() => {
            console.log("User data added to Firestore.");
            alert("User data added to Firestore.");
            window.location.href = "Login.html";
          })
          .catch((error) => {
            console.error("Error adding user data to Firestore:", error);
          });
    })
    .catch((error) => {
      console.error("Registration failed:", error);
    });
});

// Function to handle login
loginButton.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Sign in the user with email and password
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Login successful.");
      alert("Login successful.");
      // Redirect to another page after login
      window.location.href = "index1.html";
    })
    .catch((error) => {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    });
});
