import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';

// Function to open the "Add Career" form
function openAddCareerForm() {
    // Display the add form and hide the edit form
    const addCareerForm = document.getElementById("addCareerForm");
    addCareerForm.style.display = "block";

    // Clear the input fields in the "Add Career" form
    document.getElementById("addUsername").value = "";
    document.getElementById("addEmail").value = "";
    document.getElementById("addPhone").value = "";
}

// Function to add a new career
function addCareer() {
    const title = document.getElementById("addUsername").value;
    const yearsOfExperience = document.getElementById("addEmail").value;
    const qualification = document.getElementById("addPhone").value;

    if (title && yearsOfExperience && qualification) {
        // Add the new career to Firestore
        addDoc(collection(firestoreDB, "Careers"), {
            title: title,
            yearsOfExperience: yearsOfExperience,
            qualification: qualification,
        })
            .then(() => {
                console.log("Career added successfully");
                alert("Career added successfully");
                // Hide the add form after adding
                const addCareerForm = document.getElementById("addCareerForm");
                addCareerForm.style.display = "none";

                // Refresh the career list
                getAllUsers();
            })
            .catch((error) => {
                console.error("Error adding career: ", error);
            });
    } else {
        // Display an error message if any of the fields is empty
        document.getElementById("addCareerErrorMessage").textContent = "Please fill in all the fields.";
    }
}

// Event listener for the "Add Career" button
const addCareerButton = document.getElementById("addCareerButton");
addCareerButton.addEventListener("click", openAddCareerForm);

// Event listener for the "Add" button in the "Add Career" form
const addCareerFormSubmitButton = document.getElementById("addCareerFormSubmitButton");
addCareerFormSubmitButton.addEventListener("click", addCareer);

// Event listener for the "Cancel" button in the "Add Career" form
const cancelAddCareerButton = document.getElementById("cancelAddCareerButton");
cancelAddCareerButton.addEventListener("click", () => {
    const addCareerForm = document.getElementById("addCareerForm");
    addCareerForm.style.display = "none";
});

function getAllUsers() {
    const inquiriesCollection = collection(firestoreDB, "Careers");

    getDocs(inquiriesCollection)
        .then((querySnapshot) => {
            const inquiryList = document.getElementById("career-list");
            inquiryList.innerHTML = ""; // Clear existing content

            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                const title = userData.title;
                const yearsOfExperience = userData.yearsOfExperience;
                const qualification = userData.qualification;

                const inquiryItem = document.createElement("div");
                inquiryItem.classList.add("career-item");

                const userDetails = document.createElement("div");
                userDetails.classList.add("career-details");

                const usernameElement = document.createElement("p");
                usernameElement.innerHTML = `<strong>Position: </strong> ${title}`;

                const emailElement = document.createElement("p");
                emailElement.innerHTML = `<strong>Needed Years of Experience: </strong> ${yearsOfExperience}`;

                const phoneElement = document.createElement("p");
                phoneElement.innerHTML = `<strong>Qualifications: </strong> ${qualification}`;

                userDetails.appendChild(usernameElement);
                userDetails.appendChild(emailElement);
                userDetails.appendChild(phoneElement);

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
                    document.getElementById("editUsername").value = title;
                    document.getElementById("editEmail").value = yearsOfExperience;
                    document.getElementById("editPhone").value = qualification;

                    // Add an event listener to the "Update" button
                    const updateUserButton = document.getElementById("updateUserButton");
                    updateUserButton.addEventListener("click", () => {
                        // Retrieve updated data from the form
                        const updatedUsername = document.getElementById("editUsername").value;
                        const updatedEmail = document.getElementById("editEmail").value;
                        const updatedPhone = document.getElementById("editPhone").value;

                        // Get the career's document ID
                        const careerId = doc.id;

                        // Call the update function (updateUser) with the document ID
                        updateUser(careerId, updatedUsername, updatedEmail, updatedPhone);

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
            console.error("Error getting careers:", error);
        });
}

// Function to delete an inquiry document by ID
function deleteUser(userId) {
    const inquiryRef = doc(firestoreDB, "Careers", userId);
    deleteDoc(inquiryRef)
    .then(() => {
        console.log("User deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting user: ", error);
    });
}    

function updateUser(userId, updatedUsername, updatedEmail, updatedPhone) {
    const userRef = doc(firestoreDB, "Careers", userId);
    updateDoc(userRef, {
        title: updatedUsername,
        yearsOfExperience: updatedEmail,
        qualification: updatedPhone,
    })
        .then(() => {
            console.log("Career updated successfully");
            // refresh the user list
            getAllUsers()
        })
        .catch((error) => {
            console.error("Error updating career: ", error);
        });
}



window.onload = function () {
    getAllUsers();
};