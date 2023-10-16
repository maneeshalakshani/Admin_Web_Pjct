import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';

function getAllFoodTypes() {
    const inquiriesCollection = collection(firestoreDB, "food_types");

    getDocs(inquiriesCollection)
        .then((querySnapshot) => {
            const foodList = document.getElementById("food-list");
            foodList.innerHTML = ""; // Clear existing content

            querySnapshot.forEach((doc) => {
                const inquiryData = doc.data();
                const thumbnailUrl = inquiryData["thumbnailUrl"];
                const title = inquiryData["title"];

                const inquiryItem = document.createElement("div");
                inquiryItem.classList.add("food-item");

                const foodDetails = document.createElement("div");
                foodDetails.classList.add("food-detail");

                const foodNameElement = document.createElement("div");
                foodNameElement.classList.add("food-name");
                foodNameElement.innerHTML = title;

                const foodDescriptionElement = document.createElement("div");
                foodDescriptionElement.classList.add("food-description");
                foodDescriptionElement.innerHTML = thumbnailUrl;

                foodDetails.appendChild(foodNameElement);
                foodDetails.appendChild(foodDescriptionElement);

                const addBtn = document.createElement("button");
                addBtn.classList.add("add-button");
                addBtn.textContent = "Add";  

                inquiryItem.appendChild(foodDetails);
                inquiryItem.appendChild(addBtn);

                foodList.appendChild(inquiryItem);
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
    getAllFoodTypes();
};