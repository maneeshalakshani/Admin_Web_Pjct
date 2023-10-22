import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';

function getAllInquiries() {
    const inquiriesCollection = collection(firestoreDB, "Inquiry");

    getDocs(inquiriesCollection)
        .then((querySnapshot) => {
            const inquiryList = document.getElementById("inquiryList");
            inquiryList.innerHTML = ""; // Clear existing content

            querySnapshot.forEach((doc) => {
                const inquiryData = doc.data();
                const fname = inquiryData["First Name"];
                const lname = inquiryData["Last Name"];
                const email = inquiryData["Email Address"];
                const phone = inquiryData["Telephone Number"];
                const message = inquiryData["Inquiry"];

                const inquiryItem = document.createElement("div");
                inquiryItem.classList.add("inquiry-item");

                const inquiryDetails = document.createElement("div");
                inquiryDetails.classList.add("inquiry-details");

                const nameElement = document.createElement("p");
                nameElement.innerHTML = `<strong>Name:</strong> ${fname} ${lname}`;

                const emailElement = document.createElement("p");
                emailElement.innerHTML = `<strong>Email:</strong> ${email}`;

                const phoneElement = document.createElement("p");
                phoneElement.innerHTML = `<strong>Phone:</strong> ${phone}`;

                const messageElement = document.createElement("p");
                messageElement.innerHTML = `<strong>Message:</strong> ${message}`;

                inquiryDetails.appendChild(nameElement);
                inquiryDetails.appendChild(emailElement);
                inquiryDetails.appendChild(phoneElement);
                inquiryDetails.appendChild(messageElement);

                const inquiryActions = document.createElement("div");
                inquiryActions.classList.add("inquiry-actions");

                const replyButton = document.createElement("button");
                replyButton.classList.add("btn", "btn-primary");
                replyButton.textContent = "Reply";

                replyButton.addEventListener("click", () => {
                    const emailSubject = "Reply to Inquiry";
                    const emailRecipient = email; 
                    const emailBody = `
                        Dear ${fname},
                    `; 
                    const emailLink = `mailto:${emailRecipient}?subject=${emailSubject}&body=${emailBody}`;
                
                    // Open the user's default email client with the pre-filled information
                    window.location.href = emailLink;
                });
  

                const deleteButton = document.createElement("button");
                deleteButton.classList.add("btn", "btn-danger");
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", () => {
                    if (confirm("Are you sure you want to delete this inquiry?")) {
                        const inquiryId = doc.id;
                        deleteInquiry(inquiryId);
                        inquiryItem.remove();
                    }
                });

                inquiryActions.appendChild(replyButton);
                inquiryActions.appendChild(deleteButton);

                inquiryItem.appendChild(inquiryDetails);
                inquiryItem.appendChild(inquiryActions);

                inquiryList.appendChild(inquiryItem);
            });
        })
        .catch((error) => {
            console.error("Error getting inquiries:", error);
        });
}

// Function to delete an inquiry document by ID
function deleteInquiry(inquiryId) {
    const inquiryRef = doc(firestoreDB, "Inquiry", inquiryId);
    deleteDoc(inquiryRef)
    .then(() => {
        console.log("Inquiry deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting inquiry:", error);
    });
}      
  

window.onload = function () {
    getAllInquiries();
};