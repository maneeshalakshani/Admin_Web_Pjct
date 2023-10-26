import { collection, getDocs, doc, deleteDoc, updateDoc,addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';

function getAllDeals() {
    const inquiriesCollection = collection(firestoreDB, "deals");

    getDocs(inquiriesCollection)
        .then((querySnapshot) => {
            const dealsList = document.getElementById("deals-list");
            dealsList.innerHTML = ""; // Clear existing content

            let row = document.createElement("tr"); // Create a row
            let count = 0;

            querySnapshot.forEach((doc) => {
                const dealData = doc.data();
                const imageUrl = dealData["imageUrl"];
                const description = dealData["description"];

                const dealItem = document.createElement("td"); // Create a table cell
                dealItem.classList.add("deal-item");

                const thumbnailElement = document.createElement("img");
                thumbnailElement.classList.add("deal-img");
                thumbnailElement.src = imageUrl;
                thumbnailElement.alt = "imageUrl";

                const descriptionElement = document.createElement("div");
                descriptionElement.classList.add("deal-description");
                descriptionElement.innerHTML = `<strong>${description}</strong>`;

                const dealActions = document.createElement("div"); 
                dealActions.classList.add("deal-actions");

                const editBtn = document.createElement("button");
                editBtn.classList.add("btn", "btn-primary");
                editBtn.textContent = "Edit";

                editBtn.addEventListener("click", function () {
                    openEditModal(description, imageUrl, doc.id)
                });

                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("btn", "btn-danger");
                deleteBtn.style.marginLeft = '20px';
                deleteBtn.textContent = "Delete";

                deleteBtn.addEventListener("click", function () {
                    const docId = doc.id;
                    deleteDeal(docId);
                    dealItem.remove();
                });

                dealActions.appendChild(editBtn);
                dealActions.appendChild(deleteBtn);

                dealItem.appendChild(thumbnailElement);
                dealItem.appendChild(descriptionElement);
                dealItem.appendChild(dealActions);

                row.appendChild(dealItem);
                count++;

                if (count === 3) { // Display 3 items per row
                    dealsList.appendChild(row);
                    row = document.createElement("tr");
                    count = 0;
                }
            });

            // If there are any remaining items in the last row, add it to the table
            if (count > 0) {
                dealsList.appendChild(row);
            }
        })
        .catch((error) => {
            console.error("Error getting deals:", error);
        });
}

// Function to delete an inquiry document by ID
function deleteDeal(inquiryId) {
    const dealRef = doc(firestoreDB, "deals", inquiryId);
    deleteDoc(dealRef)
    .then(() => {
        console.log("Deal deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting deal", error);
    });
}      
  



// ======== EDIT ==============================================================
function openEditModal(description, imageUrl, docId) {
    const modal = document.getElementById("editModal");
    modal.style.display = "block";

    // Set the existing data in the modal form
    document.getElementById("edit-description").value = description;
    document.getElementById("edit-imageUrl").value = imageUrl;
    document.getElementById("edit-doc-id").value = docId;

}

// Close the Update modal
document.getElementById("close-edit-modal").addEventListener("click", function() {
    const modal = document.getElementById("editModal");
    modal.style.display = "none";
});

// Form submission for editing
document.getElementById("edit-faq-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const description = document.getElementById("edit-description").value;
    const imageUrl = document.getElementById("edit-imageUrl").value;
    const docId = document.getElementById("edit-doc-id").value;

    updateDealInFirestore(description, imageUrl, docId);

    const modal = document.getElementById("editModal");
    modal.style.display = "none";
});

// Function to update a catalogue item in Firestore
function updateDealInFirestore(description, imageUrl, docId) {
    const docRef = doc(firestoreDB, "deals", docId);
    
    updateDoc(docRef, {
        description: description,
        imageUrl: imageUrl,
    })
        .then(() => {
            // alert(`Deal updated`);
            getAllDeals();
        })
        .catch((error) => {
            console.error("Error updating Deal:", error);
        });
}


//============= ADD DEALS ==================================================
const addCatalogueBtn = document.getElementById("deal-add-button");
addCatalogueBtn.addEventListener("click", function () {
    const modal = document.getElementById("addDealModal");
    modal.style.display = "block";
});

// Close the Add deal modal
document.getElementById("close-add-modal").addEventListener("click", function() {
    const modal = document.getElementById("addDealModal");
    modal.style.display = "none";
});

// Form submission
document.getElementById("add-deals-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const thumbnailUrl = document.getElementById("add-imageUrl").value;
    const description = document.getElementById("add-description").value;

    // Add code to save the new deal data to Firebase Firestore
    addDealToFirestore(thumbnailUrl, description, 'deals');

    const modal = document.getElementById("addDealModal");
    modal.style.display = "none";
});

// Function to add a new deals to Firestore
function addDealToFirestore(thumbnailUrl, description, collectionName) {
    const productCollection = collection(firestoreDB, collectionName); // Use the passed collection
    addDoc(productCollection, {
        imageUrl: thumbnailUrl,
        description: description,
    })
        .then(() => {
            // alert(`Menu Deal added to the ${collectionName} collection`);
            getAllDeals();
        })
        .catch((error) => {
            console.error("Error adding deal:", error);
        });
}


window.onload = function () {
    getAllDeals();
};