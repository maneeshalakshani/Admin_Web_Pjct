import { get, ref, child, set, query } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { db, firestoreDB, auth } from './configurations.js';


// BACK BUTTON =====================================================================================
// Add an event listener to the back button
const backButton = document.getElementById("backButton");

backButton.addEventListener("click", () => {
    // Navigate to the previous page
    window.history.back();
});






//================ GET ALL PENDING ORDERS ===========================================================================
function getAllDeliveredOrders() {
    const dbRef = ref(db);
    const peopleRef = child(dbRef, "Orders"); 

    get(peopleRef)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();

            const table = document.getElementById("ordersTable");

            table.innerHTML = `
            <tr>
                <th>Order</th>
                <th>Username</th>
                <th>Address</th>
                <th>Price</th>
                <th>Delivery Option</th>
                <th>Order Status</th>
                <th>Order Date</th>
            </tr>`;

            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const order = data[key];


                    const usersCollection = collection(firestoreDB, "users");
                    const userDocRef = doc(usersCollection, order.userid);

                    if(order.orderStatus == 'delivered'){
                        getDoc(userDocRef)
                        .then((docSnapshot) => {
                            if (docSnapshot.exists()) {
                                const userData = docSnapshot.data();
                                if (userData && userData.userName) {
                                    const userName = userData.userName;
                                    const userAddress = userData.residentialAddress;
                                    
                                    const row = table.insertRow(-1);

                                    const titleCell = row.insertCell(0);
                                    const userNameCell = row.insertCell(1);
                                    const addressCell = row.insertCell(2);
                                    const priceCell = row.insertCell(3);
                                    const deliveryOptionCell = row.insertCell(4);
                                    const orderStatusCell = row.insertCell(5);
                                    const orderDateCell = row.insertCell(6);

                                    titleCell.innerHTML = order.quantity + " * " + order.title;
                                    userNameCell.innerHTML = userName;
                                    addressCell.innerHTML = userAddress;

                                    const statusText = document.createElement("p");
                                    statusText.innerHTML = order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1);
                                    statusText.style.color = 'green';
                                    orderStatusCell.appendChild(statusText);

                                    deliveryOptionCell.innerHTML = order.selectedDeliveryOption;
                                    orderDateCell.innerHTML = order.timestamp.split(" ")[0];
                                    priceCell.innerHTML = "LRK " + order.price + ".00";
                                } else {
                                    console.log("User data does not contain a 'userName' field.");
                                }
                            } else {
                                console.log("No user found with the provided ID.");
                            }
                        })
                        .catch((error) => {
                            console.error("Error getting user by ID:", error);
                        });
                    }
                }
            }
        } else {
            alert("No data found");
        }
    })
    .catch((error) => {
        alert(error);
    });
}

// function updateOrderStatus(orderId, newStatus) {
//     const orderRef = ref(db, `Orders/${orderId}/orderStatus`);
//     set(orderRef, newStatus)
//     .then(() => {
//         // alert("Order status updated successfully");
//         getAllPendingOrders(); // Refresh the orders list
//     })
//     .catch((error) => {
//         alert("Error updating order status: " + error);
//     });
// }


window.onload = function() {
    getAllDeliveredOrders();
}
