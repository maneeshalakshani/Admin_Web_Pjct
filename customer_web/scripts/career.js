
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './config.js';

function getAll(){
    getCareers("Careers", "career-list");
}

function getCareers(collectionName, htmlList) {
    const burger_type_collection = collection(firestoreDB, collectionName);

    getDocs(burger_type_collection)
        .then((querySnapshot) => {
            const inquiryList = document.getElementById(htmlList);
            inquiryList.innerHTML = ""; // Clear existing content

            querySnapshot.forEach((doc) => {
                const menuData = doc.data();
                const name = menuData["title"];
                const qualifications = menuData["qualification"];
                const yearsOfExperience = menuData["yearsOfExperience"];

                const itemDiv = document.createElement("div");
                itemDiv.classList.add("career-box");

                const nameElement = document.createElement("p");
                nameElement.innerHTML = `<strong>Job Position: ${name}</strong>`;
                nameElement.style.color = "white";
                nameElement.classList.add("careerRow");
                nameElement.classList.add("position");

                const qualificationsElement = document.createElement("p");
                qualificationsElement.innerHTML = `<strong>Qualifications: ${qualifications}</strong>`;
                qualificationsElement.style.color = "white";
                qualificationsElement.classList.add("careerRow");
                qualificationsElement.classList.add("fontNormal");

                const yearsOfExperienceElement = document.createElement("p");
                yearsOfExperienceElement.innerHTML = `<strong>Years of Experience: ${yearsOfExperience}</strong>`;
                yearsOfExperienceElement.style.color = "white";
                yearsOfExperienceElement.classList.add("careerRow");
                qualificationsElement.classList.add("fontNormal");

                const applyButton = document.createElement("button");
                applyButton.classList.add("btn", "btn-primary", "alignment");
                applyButton.textContent = "Apply";

                // Add a click event listener to the applyButton
                applyButton.addEventListener("click", function() {
                    // Get the item ID associated with this item
                    const itemId = doc.id;

                    // Construct the URL of the other page with the item ID as a query parameter
                    const otherPageURL = `new_aapp.html?itemId=${itemId}`;
                    window.location.href = otherPageURL;
                });

                itemDiv.appendChild(nameElement);
                itemDiv.appendChild(qualificationsElement);
                itemDiv.appendChild(yearsOfExperienceElement);
                itemDiv.appendChild(applyButton);
                

                inquiryList.appendChild(itemDiv);
            });
        })
        .catch((error) => {
            console.error("Error getting careers:", error);
        });
}


window.onload = function () {
    getAll();
};