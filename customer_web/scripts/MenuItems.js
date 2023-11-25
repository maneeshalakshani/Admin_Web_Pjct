import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './config.js';

function getProducts(){

    // Get the collectionName parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const collectionName = urlParams.get("collectionName");

    const itemTitle = document.getElementById("item-title");
    itemTitle.innerHTML = null;

    const name = collectionName.split("_");

    console.log(name)

    if(name.length > 2){
        for(let i =0; i<name.length-1; i++){
            itemTitle.textContent += `${name[i]} `;
            console.log(itemTitle)
        }
    }else{
        itemTitle.textContent += collectionName.split("_")[0];
    }

    getTypeProduct(collectionName, "item-list");
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