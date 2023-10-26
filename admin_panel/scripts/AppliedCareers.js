import { collection, getDocs, doc, deleteDoc, updateDoc,addDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';

const pdfImage = 'https://firebasestorage.googleapis.com/v0/b/cafemironapp.appspot.com/o/pdf-image.png?alt=media&token=a60175da-1c7e-4b76-954b-243ee7c155cc&_gl=1*194sx5p*_ga*MTY1MTk2NTQyLjE2OTcwNDc2OTM.*_ga_CW55HF8NVT*MTY5ODM0ODE1OS42My4xLjE2OTgzNTQxNDAuMzcuMC4w';

function getAllDeals() {
    const inquiriesCollection = collection(firestoreDB, "CareerApplications");

    getDocs(inquiriesCollection)
        .then((querySnapshot) => {
            const dealsList = document.getElementById("deals-list");
            dealsList.innerHTML = ""; // Clear existing content

            let row = document.createElement("tr"); // Create a row
            let count = 0;

            querySnapshot.forEach(async (doc) => {
                const dealData = doc.data();
                const cvUrl = dealData["cv"];
                const docRef = dealData["career"];
                const careerName = dealData["careerName"];

                const dealItem = document.createElement("td");
                dealItem.classList.add("career-item");

                const thumbnailElement = document.createElement("img");
                thumbnailElement.classList.add("deal-img");
                thumbnailElement.src = pdfImage;
                thumbnailElement.alt = "imageUrl";

                const descriptionElement = document.createElement("div");
                descriptionElement.classList.add("career-description");
                descriptionElement.innerHTML = `<strong>Applied Position\n${careerName}</strong>`;

                const urlElement = document.createElement("a");
                urlElement.classList.add("application-url");
                urlElement.href = cvUrl;
                urlElement.textContent = "Show cv";


                dealItem.appendChild(thumbnailElement);
                dealItem.appendChild(descriptionElement);
                dealItem.appendChild(urlElement);

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


window.onload = function () {
    getAllDeals();
};