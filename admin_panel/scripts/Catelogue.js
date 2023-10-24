import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';

const addCatalogueBtn = document.getElementById("catalogue-add-button");
addCatalogueBtn.addEventListener("click", function () {
    const modal = document.getElementById("addCatelogueModel");
    modal.style.display = "block";
});

// Close the Add catalogue modal
document.getElementById("catalogue-close-modal").addEventListener("click", function() {
    const modal = document.getElementById("addCatelogueModel");
    modal.style.display = "none";
});

// Form submission
document.getElementById("catalogue-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const thumbnailUrl = document.getElementById("catalogue-thumbnail-url").value;
    const title = document.getElementById("catalogue-title").value;
    const newCollection = `${title}_types`;

    // Add code to save the new food item data to Firebase Firestore here
    addCatalogueToFirestore(thumbnailUrl, title, 'food_types', newCollection);

    const modal = document.getElementById("addCatelogueModel");
    modal.style.display = "none";
});

// Function to add a new product to Firestore
function addCatalogueToFirestore(thumbnailUrl, title, collectionName, newCollection) {
    const productCollection = collection(firestoreDB, collectionName); // Use the passed collection
    addDoc(productCollection, {
        thumbnailUrl: thumbnailUrl,
        title: title,
        collection: newCollection,
    })
        .then(() => {
            alert(`Menu Item added to the ${collectionName} collection`);
            getAllFoodTypes();
        })
        .catch((error) => {
            console.error("Error adding menu item:", error);
        });
}


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

                foodDetails.appendChild(foodNameElement);

                const actionDetails = document.createElement("div");
                foodDetails.classList.add("food-action");

                const editBtn = document.createElement("button");
                editBtn.classList.add("add-button");
                editBtn.style.marginRight = '20px';
                editBtn.style.background = 'green';
                editBtn.textContent = "Edit";

                editBtn.addEventListener("click", function () {
                    openEditModal(collectionName, title, thumbnailUrl, doc.id);
                });

                inquiryItem.appendChild(editBtn);

                const addBtn = document.createElement("button");
                addBtn.classList.add("add-button");
                addBtn.textContent = "Add";  

                addBtn.addEventListener("click", function () {
                    document.getElementById("collection").value = collectionName;
                    document.getElementById("collection").innerHTML = collectionName;
                    // document.getElementById("addProductCollection").value = title;
                    document.getElementById("addProductCollection").innerHTML = title;
                    openModal(collectionName);
                });

                actionDetails.appendChild(editBtn);
                actionDetails.appendChild(addBtn);

                inquiryItem.appendChild(foodDetails);
                inquiryItem.appendChild(actionDetails);

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
    const productCollection = collection(firestoreDB, collectionName);
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

function openEditModal(collectionName, title, thumbnailUrl, docId) {
    const modal = document.getElementById("editModal");
    modal.style.display = "block";

    // Set the existing data in the modal form
    document.getElementById("editCollection").innerHTML = collectionName;
    document.getElementById("editCollectionName").innerHTML = title;
    document.getElementById("edit-thumbnail-url").value = thumbnailUrl;
    document.getElementById("edit-title").value = title;
    document.getElementById("edit-type-id").value = docId;
}

// Close the Update modal
document.getElementById("close-edit-modal").addEventListener("click", function() {
    const modal = document.getElementById("editModal");
    modal.style.display = "none";
});

// Form submission for editing
document.getElementById("edit-catalogue-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const thumbnailUrl = document.getElementById("edit-thumbnail-url").value;
    const title = document.getElementById("edit-title").value;
    const collection = document.getElementById("editCollection").value;
    const docId = document.getElementById("edit-type-id").value;

    updateCatalogueInFirestore(collection, thumbnailUrl, title, docId);

    const modal = document.getElementById("editModal");
    modal.style.display = "none";
});

// Function to update a catalogue item in Firestore
function updateCatalogueInFirestore(collectionName, thumbnailUrl, title, docId) {
    const docRef = doc(firestoreDB, "food_types", docId);
    
    updateDoc(docRef, {
        thumbnailUrl: thumbnailUrl,
        title: title,
    })
        .then(() => {
            alert(`Catalogue item updated`);
            getAllFoodTypes();
        })
        .catch((error) => {
            console.error("Error updating catalogue item:", error);
        });
}


window.onload = function () {
    getAllFoodTypes();
};