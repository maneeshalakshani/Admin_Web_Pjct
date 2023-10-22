import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './config.js';

function getProducts(){
    getTypeProduct("burger_types", "burger-list");
    getTypeProduct("coffee_types", "coffee-list");
    getTypeProduct("Pastry-Types", "pastry-list");
    getTypeProduct("Milkshake_Types", "milkshake-list");
    getTypeProduct("Lassi_Types", "lassie-list");
    getTypeProduct("Icecream_Types", "icecreame-list");
    getTypeProduct("Fruit_Salad_Types", "fruitSalad-list");
    getTypeProduct("Fruit_Juice_Types", "fruitJuice-list");
    getTypeProduct("Crispy_Chicken_types", "chicken-list");
}

function getTypeProduct(collectionName, htmlList) {
    const burger_type_collection = collection(firestoreDB, collectionName);

    getDocs(burger_type_collection)
        .then((querySnapshot) => {
            const inquiryList = document.getElementById(htmlList);
            inquiryList.innerHTML = ""; // Clear existing content

            querySnapshot.forEach((doc) => {
                const menuData = doc.data();
                const description = menuData["description"];
                const id = menuData["id"];
                const imageUrl = menuData["imageUrl"];
                const price = menuData["price"];
                const title = menuData["title"];

                const itemDiv = document.createElement("div");
                itemDiv.classList.add("item");

                const imageElement = document.createElement("img");
                imageElement.src = imageUrl; 
                imageElement.width = 150;
                imageElement.height = 100;

                const nameElement = document.createElement("p");
                nameElement.innerHTML = `<strong>${title}</strong>`;
                nameElement.style.color = "white";
                nameElement.classList.add("product-title");

                const priceElement = document.createElement("p");
                priceElement.innerHTML = `<strong>LRK ${price}.00</strong>`;
                priceElement.style.color = "white";

                itemDiv.appendChild(imageElement);
                itemDiv.appendChild(nameElement);
                itemDiv.appendChild(priceElement);
                

                inquiryList.appendChild(itemDiv);
            });
        })
        .catch((error) => {
            console.error("Error getting inquiries:", error);
        });
}


window.onload = function () {
    getProducts();
};