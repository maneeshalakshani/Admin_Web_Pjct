import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './config.js';

function getNews(){
    getTypes("news_and_events", "news-section-container");
}

function getTypes(collectionName, htmlList) {
    const burger_type_collection = collection(firestoreDB, collectionName);

    getDocs(burger_type_collection)
        .then((querySnapshot) => {
            const inquiryList = document.getElementById(htmlList);
            inquiryList.innerHTML = ""; // Clear existing content

            querySnapshot.forEach((doc) => {
                const menuData = doc.data();
                const collection = menuData["collection"];
                const thumbnailUrl = menuData["imageUrl"];
                const title = menuData["title"];
                const message = menuData["message"];

                const itemDiv = document.createElement("div");
                itemDiv.classList.add("category");
                
                const nameElement = document.createElement("p");
                nameElement.innerHTML = `<strong>${title}</strong>`;
                nameElement.classList.add("category-title");

                const imageElement = document.createElement("img");
                imageElement.src = thumbnailUrl; 
                imageElement.width = 250;
                imageElement.height = 180;
                imageElement.classList.add("main-image");

                const descriptionElement = document.createElement("p");
                descriptionElement.innerHTML = `<strong>${message}</strong>`;
                descriptionElement.classList.add("category-description");

                // const buttonElement = document.createElement("a");
                // buttonElement.href = "burger.html";
                // buttonElement.href = `burger.html?collectionName=${collection}`;
                // buttonElement.classList.add("menu_btn");
                // buttonElement.text = "View List";

                itemDiv.appendChild(nameElement);
                itemDiv.appendChild(imageElement);
                itemDiv.appendChild(descriptionElement);

                inquiryList.appendChild(itemDiv);
            });
        })
        .catch((error) => {
            console.error("Error getting data:", error);
        });
}


window.onload = function () {
    getNews();
};