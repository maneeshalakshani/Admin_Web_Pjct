import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';

const pdfImage = 'https://firebasestorage.googleapis.com/v0/b/cafemironapp.appspot.com/o/pdf-image.png?alt=media&token=a60175da-1c7e-4b76-954b-243ee7c155cc&_gl=1*194sx5p*_ga*MTY1MTk2NTQyLjE2OTcwNDc2OTM.*_ga_CW55HF8NVT*MTY5ODM0ODE1OS42My4xLjE2OTgzNTQxNDAuMzcuMC4w';




// BACK BUTTON =====================================================================================
// Add an event listener to the back button
const backButton = document.getElementById("backButton");

backButton.addEventListener("click", () => {
    // Navigate to the previous page
    window.history.back();
});






function getAllJobs() {
    const collectionRef = collection(firestoreDB, "Careers");

    getDocs(collectionRef)
        .then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                const docData = doc.data();
                const careerTitle = docData["title"];

                getAppliedCareers(careerTitle);
            });
        })
        .catch((error) => {
            console.error("Error getting careers:", error);
        });
} 





function getAppliedCareers(careerTitle) {
    const inquiriesCollection = collection(firestoreDB, "CareerApplications");

    getDocs(query(inquiriesCollection, orderBy("firstName")))
        .then((querySnapshot) => {

            const careerDiv = document.getElementById("careerDiv");

            let table = document.createElement("table"); // Create a table

            let dealsList = document.createElement("tbody"); // Create a tbody

            let row = document.createElement("tr"); // Create a row
            let count = 0;

            const appliedCareerName = document.createElement("h1");
            appliedCareerName.textContent = `Career Name: ${careerTitle}`;
            appliedCareerName.classList.add("career-title");


            querySnapshot.forEach(async (doc) => {
                const dealData = doc.data();
                const cvUrl = dealData["cv"];
                const docRef = dealData["career"];
                const careerName = dealData["careerName"];
                const firstName = dealData["firstName"];
                const lastName = dealData["lastName"];
                const email = dealData["email"];

                if(careerName == careerTitle){

                    const dealItem = document.createElement("td");
                    dealItem.classList.add("career-item");

                    // const thumbnailElement = document.createElement("img");
                    // thumbnailElement.classList.add("career-img");
                    // thumbnailElement.src = pdfImage;
                    // thumbnailElement.alt = "imageUrl";

                    const descriptionElement = document.createElement("div");
                    descriptionElement.classList.add("career-description");

                    const nameElement = document.createElement("p");
                    nameElement.innerHTML = `<strong>${firstName} ${lastName}</strong>`;

                    const emailElement = document.createElement("p");
                    emailElement.innerHTML = email;

                    descriptionElement.appendChild(nameElement);
                    descriptionElement.appendChild(emailElement);

                    const urlElement = document.createElement("a");
                    urlElement.classList.add("application-url");
                    urlElement.href = cvUrl;
                    urlElement.textContent = "Show cv";


                    // dealItem.appendChild(thumbnailElement);
                    dealItem.appendChild(descriptionElement);
                    dealItem.appendChild(urlElement);

                    row.appendChild(dealItem);
                    count++;

                    if (count === 5) { // Display 3 items per row
                        dealsList.appendChild(row);
                        table.append(dealsList);
                        careerDiv.append(appliedCareerName);
                        careerDiv.append(table);
                        row = document.createElement("tr");
                        count = 0;
                    }
                }
            });

            // If there are any remaining items in the last row, add it to the table
            if (count > 0) {
                dealsList.appendChild(row);
                table.append(dealsList);
                careerDiv.append(appliedCareerName);
                careerDiv.append(table);
            }
        })
        .catch((error) => {
            console.error("Error getting career:", error);
        });
} 


window.onload = function () {
    getAllJobs();
};