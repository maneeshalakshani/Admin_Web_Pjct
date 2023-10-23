import { collection, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';

const food_types_div = document.getElementById("food-types-div");

function getAllFoodTypes() {
    const Fcollection = collection(firestoreDB, "food_types");
    getDocs(Fcollection)
        .then((querySnapshot) => {
            
            querySnapshot.forEach((doc) => {
                const inquiryData = doc.data();
                const title = inquiryData["title"];
                const newCollection = inquiryData["collection"];

                const creatingCollection = collection(firestoreDB, newCollection);

                getAllInquiries(creatingCollection, `${title}-list`, title, newCollection);
            });
        })
        .catch((error) => {
            console.error("Error getting inquiries:", error);
        });
}

function getAllInquiries(collection, listId, title, newCollection) {
    getDocs(collection)
        .then((querySnapshot) => {
            const mainDiv = document.createElement("div");

            const fTitle = document.createElement("div");
            fTitle.innerHTML = `<h3>${title}</h3>`;
            mainDiv.appendChild(fTitle);

            querySnapshot.forEach((doc) => {
                const inquiryData = doc.data();
                const thumbnailUrl = inquiryData["ThumbnailUrl"];
                const title = inquiryData["title"];
                const price = inquiryData["price"];

                const inquiryItem = document.createElement("div");
                inquiryItem.classList.add("inquiry-item");

                const inquiryDetails = document.createElement("div");
                inquiryDetails.classList.add("inquiry-details");

                const itemTextDetailDiv = document.createElement("div");
                itemTextDetailDiv.style.marginLeft = "20px";

                const nameElement = document.createElement("p");
                nameElement.innerHTML = `<strong>Title:</strong> ${title}`;

                const priceElement = document.createElement("p");
                priceElement.innerHTML = `<strong>Price:</strong> Rs. ${price}.00`;

                itemTextDetailDiv.appendChild(nameElement);
                itemTextDetailDiv.appendChild(priceElement);

                const thumbnailElement = document.createElement("img");
                inquiryDetails.classList.add("product-img");
                thumbnailElement.src = thumbnailUrl;
                thumbnailElement.alt = "Thumbnail";
                thumbnailElement.width = 100;
                thumbnailElement.height = 80;

                inquiryDetails.appendChild(thumbnailElement);
                inquiryDetails.appendChild(itemTextDetailDiv);

                const inquiryActions = document.createElement("div");
                inquiryActions.classList.add("inquiry-actions");

                // const replyButton = document.createElement("button");
                // replyButton.classList.add("btn", "btn-primary");
                // replyButton.textContent = "Edit";

                const editBtn = document.createElement("button");
                editBtn.classList.add("btn", "btn-success");
                editBtn.style.marginRight = '20px';
                editBtn.textContent = "Edit";

                editBtn.addEventListener("click", function () {
                    openEditModal(newCollection, title, thumbnailUrl, price, doc.id);
                });

                const deleteButton = document.createElement("button");
                deleteButton.classList.add("btn", "btn-danger");
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", () => {
                    if (confirm("Are you sure you want to delete this inquiry?")) {
                        const inquiryId = doc.id;
                        deleteInquiry(inquiryId, collection);
                        inquiryItem.remove();
                    }
                });
  

                inquiryActions.appendChild(editBtn);
                inquiryActions.appendChild(deleteButton);

                inquiryItem.appendChild(inquiryDetails);
                inquiryItem.appendChild(inquiryActions);

                mainDiv.appendChild(inquiryItem);

                food_types_div.appendChild(mainDiv);
            });
        })
        .catch((error) => {
            console.error("Error getting inquiries:", error);
        });
}

// Function to delete an inquiry document by ID
function deleteInquiry(inquiryId, collection) {
    const inquiryRef = doc(firestoreDB, collection.id, inquiryId);
    deleteDoc(inquiryRef)
    .then(() => {
        console.log("Deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting : ", error);
    });
}   



function openEditModal(collectionName, title, thumbnailUrl, price, docId) {
    const modal = document.getElementById("editModal");
    modal.style.display = "block";

    // Set the existing data in the modal form
    document.getElementById("editCollection").innerHTML = collectionName;
    document.getElementById("edit-thumbnail-url").value = thumbnailUrl;
    document.getElementById("edit-price").value = price;
    document.getElementById("edit-title").value = title;
    document.getElementById("edit-collection").value = collectionName;
    document.getElementById("edit-doc-id").value = docId;
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
    const price = document.getElementById("edit-price").value;
    const docId = document.getElementById("edit-doc-id").value;
    const newCollection = document.getElementById("edit-collection").value;

    updateCatalogueInFirestore(newCollection, thumbnailUrl, title, price, docId);

    const modal = document.getElementById("editModal");
    modal.style.display = "none";
});

// Function to update a catalogue item in Firestore
function updateCatalogueInFirestore(collectionName, thumbnailUrl, title, price, docId) {
    const docRef = doc(firestoreDB, collectionName, docId);
    
    updateDoc(docRef, {
        thumbnailUrl: thumbnailUrl,
        title: title,
        price: price,
        imageUrl: thumbnailUrl,
    })
        .then(() => {
            alert(`Product item updated in the ${collectionName} collection`);
            getAllFoodTypes();
        })
        .catch((error) => {
            console.error("Error updating catalogue item:", error);
        });
}


window.onload = function () {
    // callAll();
    getAllFoodTypes();
};