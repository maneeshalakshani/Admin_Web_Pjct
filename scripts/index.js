import { set, get, update, remove, ref, child} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js"
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { db, firestoreDB } from './configurations.js';


 var name = document.querySelector("#name");
 var email = document.querySelector("#email");
 var findName = document.querySelector("#findName");
 // var completedOrders = document.querySelector("completedOrders");

 var insertBtn = document.querySelector("#insert");
 var findBtn = document.querySelector("#find");
 var removeBtn = document.querySelector("#remove");
 var updateBtn = document.querySelector("#update");

 function insertData() {
     set(ref(db, "users/" + email.value), { 
         Name: name.value,
         Email: email.value
     })
     .then(() => {
         alert("Data added Successfully!")
     })
     .catch((error) => {
         alert(error)
     });
 }

 // function findData() {
 //     const dbRef = ref(db);
 //     get(child(dbRef, "users"))
 //     .then((snapshot) => {
 //         if(snapshot.exists()) {
 //             findName.innerHTML = "Name: " + snapshot.val().Name;
 //         } else {
 //             alert("No data found");
 //         }
 //     })
 //     .catch((error) => {
 //         alert(error);
 //     });
 // }

 function getAllOrders() {
     const dbRef = ref(db);
     const peopleRef = child(dbRef, "Orders"); // Reference to the "People" node

     get(peopleRef)
     .then((snapshot) => {
         if (snapshot.exists()) {
             // Snapshot will contain all data under the "People" node
             const data = snapshot.val();

             const size = Object.keys(data).length;
             noOfOrders.innerHTML = size;

             const table = document.getElementById("ordersTable");

             let completedOrdersCount = 0;

             // Clear existing rows (if any)
             table.innerHTML = '<tr><th>Order</th><th>Quantity</th><th>Price</th><th>Order Status</th></tr>';

             // Iterate through the data and add rows to the table
             for (const key in data) {
                 if (data.hasOwnProperty(key)) {
                     const order = data[key];

                     // Create a new row
                     const row = table.insertRow(-1); // '-1' adds the row at the end

                     // Insert cells into the row
                     const titleCell = row.insertCell(0);
                     const quantityCell = row.insertCell(1);
                     const priceCell = row.insertCell(2);
                     const orderStatusCell = row.insertCell(3);

                     // Populate the cells with data
                     titleCell.innerHTML = order.quantity+ " * " +order.title;
                     // Set a class for the orderStatusCell element
                     orderStatusCell.className = "order-status-cell";
                     orderStatusCell.innerHTML = order.orderStatus;
                     quantityCell.innerHTML = order.quantity;
                     priceCell.innerHTML = "LRK " + order.price + ".00";

                     // Check if the order is 'completed' and increment the count
                     if (order.orderStatus.toLowerCase() === 'completed') {
                         completedOrdersCount++;
                     }
                 }
             }

             completedOrders.innerHTML = completedOrdersCount;
         } else {
             alert("No data found");
         }
     })
     .catch((error) => {
         alert(error);
     });
 }

 function getAllUsers() {
     const usersCollection = collection(firestoreDB, "users");

     return getDocs(usersCollection)
         .then((querySnapshot) => {
             noOfUsers.innerHTML = querySnapshot.size;
         })
         .catch((error) => {
             console.error("Error getting number of users:", error);
             return 0; // Return 0 or handle the error as needed
         });
 }

 window.onload = function() {
     getAllOrders(); // Call getAllData when the page loads
     getAllUsers();
 }


 function removeData() {
     
 }

 function updateData() {
     
 }

 insertBtn.addEventListener('click', insertData);
 findBtn.addEventListener('click', findData);
 updateBtn.addEventListener('click', updateData);
 removeBtn.addEventListener('click', removeData);

 // function generateRandomId(length) {
 //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 //     let randomId = '';
 //     for (let i = 0; i < length; i++) {
 //         const randomIndex = Math.floor(Math.random() * characters.length);
 //         randomId += characters.charAt(randomIndex);
 //     }
 //     return randomId;
 // }