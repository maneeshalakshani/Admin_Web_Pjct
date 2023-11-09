import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB, storage } from './configurations.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";


// ADD NEWS ================================================================================
const addCatalogueBtn = document.getElementById("news-add-button");
addCatalogueBtn.addEventListener("click", function () {
    const modal = document.getElementById("addModel");
    modal.style.display = "block";
});

// Close the Add catalogue modal
document.getElementById("news-close-modal").addEventListener("click", function() {
    const modal = document.getElementById("addModel");
    modal.style.display = "none";
});

// Form submission
document.getElementById("news-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    // const thumbnailUrl = document.getElementById("catalogue-thumbnail-url").value;
    const title = document.getElementById("news-title").value;
    const message = document.getElementById("catalogue-message").value;
    const newsImage = document.getElementById("newsImage").files[0];

    const applicationData = {
        title: title,
        message: message,
        imageUrl: null,
    };


    try{
        // Upload the file to a cloud storage solution (Firebase Cloud Storage)
        const storageRef = ref(storage, 'news_and_events_images/' + newsImage.name);
        const snapshot = await uploadBytes(storageRef, newsImage);

        // Get the download URL for the uploaded file
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update the application data with the download URL
        applicationData.imageUrl = downloadURL;

        // Add code to save the new food item data to Firebase Firestore here
        addToFirestore(applicationData);

        const modal = document.getElementById("addModel");
        modal.style.display = "none";
    }catch(error) {
        console.error("Error submitting application:", error);
    }
});

// Function to add a new product to Firestore
function addToFirestore(applicationData) {
    const docCollection = collection(firestoreDB, 'news_and_events'); // Use the passed collection
    addDoc(docCollection, applicationData)
        .then(() => {
            alert(`News added Successfully`);
            getNewsAndEvents();
        })
        .catch((error) => {
            console.error("Error adding news:", error);
        });
}


function getNewsAndEvents() {
    const itemsCollection = collection(firestoreDB, "news_and_events");

    getDocs(query(itemsCollection, orderBy("title")))
        .then((querySnapshot) => {
            const foodList = document.getElementById("data-list");
            foodList.innerHTML = ""; // Clear existing content

            querySnapshot.forEach((doc) => {
                const fetchData = doc.data();
                const thumbnailUrl = fetchData["imageUrl"];
                const title = fetchData["title"];
                const description = fetchData["message"];

                const dataItem = document.createElement("div");
                dataItem.classList.add("food-item");

                const foodDetails = document.createElement("div");
                foodDetails.classList.add("food-details");

                const foodInfo = document.createElement("div");
                foodInfo.style.marginLeft = "20px";

                const thumbnailElement = document.createElement("img");
                thumbnailElement.classList.add("product-img");
                thumbnailElement.src = thumbnailUrl;
                thumbnailElement.alt = "Thumbnail";
                thumbnailElement.width = 100;
                thumbnailElement.height = 80;


                const foodNameElement = document.createElement("div");
                foodNameElement.classList.add("food-name");
                foodNameElement.innerHTML = title;

                const foodDescriptionElement = document.createElement("div");
                foodDescriptionElement.classList.add("description-div");
                foodDescriptionElement.innerHTML = description;

                foodInfo.appendChild(foodNameElement);
                foodInfo.appendChild(foodDescriptionElement);

                foodDetails.appendChild(thumbnailElement);
                foodDetails.appendChild(foodInfo);

                const actionDetails = document.createElement("div");
                actionDetails.classList.add("food-action");

                //delete button ======================
                const deleteButton = document.createElement("button");
                deleteButton.classList.add("add-button");
                deleteButton.style.marginRight = '20px';
                deleteButton.style.background = 'red';
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", function () {
                    deleteItem(doc.id);
                });

                actionDetails.appendChild(deleteButton);

                //edit button 
                const editBtn = document.createElement("button");
                editBtn.classList.add("add-button");
                editBtn.style.marginRight = '20px';
                editBtn.style.background = 'green';
                editBtn.textContent = "Edit";

                editBtn.addEventListener("click", function () {
                    openEditModal(title, thumbnailUrl, description, doc.id);
                });

                actionDetails.appendChild(editBtn);

                dataItem.appendChild(foodDetails);
                dataItem.appendChild(actionDetails);

                foodList.appendChild(dataItem);
            });
        })
        .catch((error) => {
            console.error("Error getting News: ", error);
        });
} 


//================  EDIT ========================================================
function openEditModal(title, thumbnailUrl, description, docId) {
    const modal = document.getElementById("editModal");
    modal.style.display = "block";

    // Set the existing data in the modal form
    document.getElementById("edit-description").value = description;
    document.getElementById("edit-thumbnail-url").value = thumbnailUrl;
    document.getElementById("edit-title").value = title;
    document.getElementById("edit-doc-id").value = docId;
}

// Close the Update modal
document.getElementById("close-edit-modal").addEventListener("click", function() {
    const modal = document.getElementById("editModal");
    modal.style.display = "none";
});

// Form submission for editing
document.getElementById("edit-catalogue-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const thumbnailUrl = document.getElementById("edit-thumbnail-url").value;
    const title = document.getElementById("edit-title").value;
    const message = document.getElementById("edit-description").value;
    const docId = document.getElementById("edit-doc-id").value;
    const image = document.getElementById("edit-image").files[0];

    const applicationData = {
        imageUrl: thumbnailUrl,
        title: title,
        message: message,
    };

    try{
        if(image != undefined){
            // Upload the CV file to a cloud storage solution (Firebase Cloud Storage)
            const storageRef = ref(storage, 'news_and_events_images/' + image.name);
            const snapshot = await uploadBytes(storageRef, image);

            // Get the download URL for the uploaded file
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Update the application data with the download URL
            applicationData.imageUrl = downloadURL;
        } 

        updateInFirestore(applicationData, docId);

        const modal = document.getElementById("editModal");
        modal.style.display = "none";
    }catch(error) {
        console.error("Error :", error);
    }
});

// Function to update a catalogue item in Firestore
function updateInFirestore(applicationData, docId) {
    const docRef = doc(firestoreDB, "news_and_events", docId);
    
    updateDoc(docRef, applicationData)
        .then(() => {
            alert(`News updated`);
            getNewsAndEvents();
        })
        .catch((error) => {
            console.error("Error updating news:", error);
        });
}


//============ DELETE CATALOGUE ==============================================================
function deleteItem(docId) {
    const dbRef = doc(firestoreDB, "news_and_events", docId);
    deleteDoc(dbRef)
    .then(() => {
        alert("Deleted Successfully");
        getNewsAndEvents();
        console.log("Deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting", error);
    });
}  


//================= call all when page loads ===============================
window.onload = function () {
    getNewsAndEvents();
};