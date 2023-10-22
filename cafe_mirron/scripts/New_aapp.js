import { collection, doc, getDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB, storage } from './config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get("itemId");

    getCareer(documentId);
    addApplication(documentId);
});

async function getCareer(documentId) {
    if (documentId) {
        const documentRef = doc(firestoreDB, "Careers", documentId);
        try {
            const documentSnapshot = await getDoc(documentRef);
            
            if (documentSnapshot.exists()) {
                const data = documentSnapshot.data();
                populateJobApplicationForm(data);
            } else {
                console.log("Document not found");
            }
        } catch (error) {
            console.error("Error getting document:", error);
        }
    }
}

function addApplication(documentId) {
    const applyButton = document.getElementById("apply-button");

    applyButton.addEventListener("click", async function (event) {
        event.preventDefault(); // Prevent the form from submitting

        const firstName = document.getElementById("first-name").value;
        const lastName = document.getElementById("last-name").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        const city = document.getElementById("city").value;
        const pincode = document.getElementById("pincode").value;
        const date = document.getElementById("date").value;
        const cvFile = document.getElementById("cv").files[0];

        // Create a reference to the "Careers" document
        const careerDocumentRef = doc(firestoreDB, "Careers", documentId);

        // Prepare data to be saved in "CareersApplication" collection
        const applicationData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            address: address,
            City: city,
            pinCode: pincode,
            Date: date,
            cv: null,
            career: careerDocumentRef,
        };

        try{
            // Upload the CV file to a cloud storage solution (Firebase Cloud Storage)
            const storageRef = ref(storage, 'cv/' + cvFile.name);
            const snapshot = await uploadBytes(storageRef, cvFile);

            // Get the download URL for the uploaded file
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Update the application data with the download URL
            applicationData.cv = downloadURL;

            // Reference to the "CareerApplications" collection in Firestore
            const careerApplicationCollection = collection(firestoreDB, "CareerApplications");

            // Add a new document to the "CareerApplication" collection
            addDoc(careerApplicationCollection, applicationData)
                .then(() => {
                    alert("Application submitted successfully!");
                })
                .catch((error) => {
                    console.error("Error submitting application:", error);
                });
        }catch(error) {
            console.error("Error submitting application:", error);
        }
    });
}

function populateJobApplicationForm(data) {
    // Populate your HTML with data from Firestore
    document.getElementById("job-title").innerHTML = `Apply for ${data.title} job` || "";
}
