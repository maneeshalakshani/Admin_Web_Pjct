import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';

const CCCollection = collection(firestoreDB, "Crispy_Chicken_types");
const FJCollection = collection(firestoreDB, "Fruit_Juice_Types");
const FSCollection = collection(firestoreDB, "Fruit_Salad_Types");
const ICCollection = collection(firestoreDB, "Icecream_Types");
const LCollection = collection(firestoreDB, "Lassi_Types");
const MSCollection = collection(firestoreDB, "Milkshake_Types");
const PCollection = collection(firestoreDB, "Pastry-Types");
const CCollection = collection(firestoreDB, "coffee_types");
const BCollection = collection(firestoreDB, "burger_types");

function callAll(){
    getAllInquiries(CCCollection, "crispy-chicken-list", "Crispy Chickens");
    getAllInquiries(FJCollection, "fruit-juice-list", "Fruit Juices");
    getAllInquiries(FSCollection, "fruit-salad-list", "Fruit Salads");
    getAllInquiries(ICCollection, "icecreame-list", "Ice creams");
    getAllInquiries(LCollection, "lassi-list", "Lassies");
    getAllInquiries(MSCollection, "milkshake-list", "Milk Shakes");
    getAllInquiries(PCollection, "pastry-list", "Pastries");
    getAllInquiries(CCollection, "cofee-list", "Coffees");
    getAllInquiries(BCollection, "burgers-list","Burgers");
}

function getAllInquiries(collection, listId, title) {
    getDocs(collection)
        .then((querySnapshot) => {
            const inquiryList = document.getElementById(listId);
            inquiryList.innerHTML = "";

            inquiryList.innerHTML = `<div style='margin-left: 10px; text-decoration: underline;'><h3>${title}</h3></div>`;

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

                inquiryList.appendChild(inquiryItem);
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
    callAll();
};