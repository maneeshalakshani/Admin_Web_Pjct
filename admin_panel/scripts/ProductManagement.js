import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
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

                getAllInquiries(creatingCollection, `${title}-list`, title);
            });
        })
        .catch((error) => {
            console.error("Error getting inquiries:", error);
        });
}

function getAllInquiries(collection, listId, title) {
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

                const inquiryItem = document.createElement("div");
                inquiryItem.classList.add("inquiry-item");

                const inquiryDetails = document.createElement("div");
                inquiryDetails.classList.add("inquiry-details");

                const nameElement = document.createElement("p");
                nameElement.innerHTML = `<strong>Title:</strong> ${title}`;

                const thumbnailElement = document.createElement("img");
                inquiryDetails.classList.add("product-img");
                thumbnailElement.src = thumbnailUrl;
                thumbnailElement.alt = "Thumbnail";
                thumbnailElement.width = 100;
                thumbnailElement.height = 80;

                inquiryDetails.appendChild(thumbnailElement);
                inquiryDetails.appendChild(nameElement);

                const inquiryActions = document.createElement("div");
                inquiryActions.classList.add("inquiry-actions");

                // const replyButton = document.createElement("button");
                // replyButton.classList.add("btn", "btn-primary");
                // replyButton.textContent = "Edit";

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
  

                // inquiryActions.appendChild(replyButton);
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


window.onload = function () {
    // callAll();
    getAllFoodTypes();
};