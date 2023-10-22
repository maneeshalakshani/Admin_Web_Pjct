import { collection, getDocs, doc, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
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
                const collectionName = inquiryData["collection"];

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

                addBtn.addEventListener("click", function () {
                    document.getElementById("collection").value = collectionName;
                    document.getElementById("collection").innerHTML = collectionName;
                    openModal(collectionName);
                });

                inquiryItem.appendChild(foodDetails);
                inquiryItem.appendChild(addBtn);

                foodList.appendChild(inquiryItem);
            });
        })
        .catch((error) => {
            console.error("Error getting inquiries:", error);
        });
} 

// Open the modal
function openModal(collectionName) {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";

    // Set the collection name in the modal form
    document.getElementById("collection").value = collectionName;
}

// Close the modal
document.getElementById("close-modal").addEventListener("click", function() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
});

// Form submission
document.getElementById("food-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const thumbnailUrl = document.getElementById("thumbnail-url").value;
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const collection = document.getElementById("collection").value; // Get collection from the form

    // Add code to save the new food item data to Firebase Firestore here
    addProductsToFirestore(thumbnailUrl, title, price, collection);

    const modal = document.getElementById("myModal");
    modal.style.display = "none";
});

// Function to add a new product to Firestore
function addProductsToFirestore(thumbnailUrl, title, price, collectionName) {
    const productCollection = collection(firestoreDB, collectionName); // Use the passed collection
    addDoc(productCollection, {
        ThumbnailUrl: thumbnailUrl,
        title: title,
        price: price,
        imageUrl: thumbnailUrl,
    })
        .then(() => {
            alert(`Item added to the ${collectionName} collection`);
        })
        .catch((error) => {
            console.error("Error adding product:", error);
        });
}


window.onload = function () {
    getAllFoodTypes();
};