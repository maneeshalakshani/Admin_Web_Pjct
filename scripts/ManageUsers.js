import { collection, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';

function getAllUsers() {
    const inquiriesCollection = collection(firestoreDB, "users");

    getDocs(inquiriesCollection)
        .then((querySnapshot) => {
            const inquiryList = document.getElementById("user-list");
            inquiryList.innerHTML = ""; // Clear existing content

            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                const username = userData.userName;
                const uid = userData.uid;
                const address = userData.residentialAddress;
                const phone = userData.phoneNumber;
                const pw = userData.password;
                const email = userData.emailAddress;

                const inquiryItem = document.createElement("div");
                inquiryItem.classList.add("career-item");

                const userDetails = document.createElement("div");
                userDetails.classList.add("career-details");

                const usernameElement = document.createElement("p");
                usernameElement.innerHTML = `<strong>Username:</strong> ${username}`;

                const emailElement = document.createElement("p");
                emailElement.innerHTML = `<strong>Email:</strong> ${email}`;

                const phoneElement = document.createElement("p");
                phoneElement.innerHTML = `<strong>Phone:</strong> ${phone}`;

                const addressElement = document.createElement("p");
                addressElement.innerHTML = `<strong>Address:</strong> ${address}`;

                const passwordElement = document.createElement("p");
                passwordElement.innerHTML = `<strong>Password:</strong> ${pw}`;

                userDetails.appendChild(usernameElement);
                userDetails.appendChild(emailElement);
                userDetails.appendChild(phoneElement);
                userDetails.appendChild(addressElement);
                userDetails.appendChild(passwordElement);

                const inquiryActions = document.createElement("div");
                inquiryActions.classList.add("career-actions");

                const replyButton = document.createElement("button");
                replyButton.classList.add("btn", "btn-primary");
                replyButton.textContent = "Edit";

                replyButton.addEventListener("click", () => {
                    // Display the edit form
                    const editUserForm = document.getElementById("editUserForm");
                    editUserForm.style.display = "block";
                
                    // Prefill the form with user data
                    document.getElementById("editUsername").value = username;
                    document.getElementById("editEmail").value = email;
                    document.getElementById("editPhone").value = phone;
                    document.getElementById("editAddress").value = address;
                    document.getElementById("editPassword").value = pw;
                
                    // Add an event listener to the "Update" button
                    const updateUserButton = document.getElementById("updateUserButton");
                    updateUserButton.addEventListener("click", () => {
                        // Retrieve updated data from the form
                        const updatedUsername = document.getElementById("editUsername").value;
                        const updatedEmail = document.getElementById("editEmail").value;
                        const updatedPhone = document.getElementById("editPhone").value;
                        const updatedAddress = document.getElementById("editAddress").value;
                        const updatedPassword = document.getElementById("editPassword").value;
                
                        // Call the update function (e.g., updateUser) to update the data in Firestore
                        updateUser(doc.id, updatedUsername, updatedEmail, updatedPhone, updatedAddress, updatedPassword);
                
                        // Hide the edit form after updating
                        editUserForm.style.display = "none";
                    });
                
                    // Add an event listener to the "Cancel" button
                    const cancelEditButton = document.getElementById("cancelEditButton");
                    cancelEditButton.addEventListener("click", () => {
                        editUserForm.style.display = "none";
                    });
                });
                

                const deleteButton = document.createElement("button");
                deleteButton.classList.add("btn", "btn-danger");
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", () => {
                    if (confirm("Are you sure you want to delete this User?")) {
                        const userId = doc.id;
                        deleteUser(userId);
                        inquiryItem.remove();
                    }
                });
  

                inquiryActions.appendChild(replyButton);
                inquiryActions.appendChild(deleteButton);

                inquiryItem.appendChild(userDetails);
                inquiryItem.appendChild(inquiryActions);

                inquiryList.appendChild(inquiryItem);
            });
        })
        .catch((error) => {
            console.error("Error getting users:", error);
        });
}

// Function to delete an inquiry document by ID
function deleteUser(userId) {
    const inquiryRef = doc(firestoreDB, "users", userId);
    deleteDoc(inquiryRef)
    .then(() => {
        console.log("User deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting user: ", error);
    });
}    

function updateUser(userId, updatedUsername, updatedEmail, updatedPhone, updatedAddress, updatedPassword) {
    const userRef = doc(firestoreDB, "users", userId);
    updateDoc(userRef, {
        userName: updatedUsername,
        email: updatedEmail,
        phoneNumber: updatedPhone,
        residentialAddress: updatedAddress,
        password: updatedPassword
    })
        .then(() => {
            console.log("User updated successfully");
            // You may want to refresh the user list here by calling getAllUsers again.
            getAllUsers()
        })
        .catch((error) => {
            console.error("Error updating user: ", error);
        });
}



window.onload = function () {
    getAllUsers();
};