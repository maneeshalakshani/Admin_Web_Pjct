import { get, ref, child, set } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { db, firestoreDB, auth } from './configurations.js';

//========== LOGOUT HANDLE ================================================================
const logoutButton = document.getElementById("userAccount-logout");
const logoutModal = document.getElementById("logoutModal");
const confirmLogoutButton = document.getElementById("confirmLogoutButton");
const cancelLogoutButton = document.getElementById("cancelLogoutButton");

// Function to open the logout confirmation modal
logoutButton.addEventListener("click", () => {
  logoutModal.style.display = "block";
});

// Function to close the logout confirmation modal
const closeModal = () => {
  logoutModal.style.display = "none";
};

// Handle the "Logout" button click in the modal
confirmLogoutButton.addEventListener("click", () => {
  // Sign out the user
  signOut(auth)
    .then(() => {
      window.location.href = "Login.html";
    })
    .catch((error) => {
      console.error("Error during sign-out:", error);
    });

  // Close the modal
  closeModal();
});

// Handle the "Cancel" button click in the modal
cancelLogoutButton.addEventListener("click", () => {
  // Close the modal
  closeModal();
});


//================ GET ALL ORDERS ===========================================================================
function getAllOrders() {
    const dbRef = ref(db);
    const peopleRef = child(dbRef, "Orders"); 

    get(peopleRef)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const size = Object.keys(data).length;
            noOfOrders.innerHTML = size;

            const table = document.getElementById("ordersTable");

            let completedOrdersCount = 0;

            table.innerHTML = `
            <tr>
                <th>Order</th>
                <th>Username</th>
                <th>Address</th>
                <th>Delivery Option</th>
                <th>Order Status</th>
                <th>Action</th>
            </tr>`;

            const ordersArray = [];

            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const order = data[key];

                    if (order.orderStatus.toLowerCase() !== 'delivered') {
                        ordersArray.push(order);
                    }
                }
            }

            // Sort orders by timestamp (oldest to newest)
            ordersArray.sort((a, b) => {
                const timestampA = new Date(a.timestamp);
                const timestampB = new Date(b.timestamp);
                return timestampA - timestampB;
            });

            for (const order of ordersArray) {
                const usersCollection = collection(firestoreDB, "users");
                const userDocRef = doc(usersCollection, order.userid);

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
                            const orderStatusCell = row.insertCell(4);
                            const actionCell = row.insertCell(5);

                            titleCell.innerHTML = order.quantity + " * " + order.title;
                            userNameCell.innerHTML = userName;
                            addressCell.innerHTML = userAddress;

                            const statusText = document.createElement("p");
                            statusText.innerHTML = order.orderStatus == 'out_for_delivery' 
                                ? "Out For Delivery" 
                                : order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1);
                            statusText.style.color = order.orderStatus == "completed" ? 'green' : order.orderStatus == 'pending' ? 'orange' : order.orderStatus == 'out_for_delivery' ? '#339FFF' : order.orderStatus == 'delivered' ? '#E64A19' : 'purple';
                            orderStatusCell.appendChild(statusText);

                            // quantityCell.innerHTML = order.quantity;
                            priceCell.innerHTML = order.selectedDeliveryOption;

                            const StatusChangeDiv = document.createElement("div");

                            // Create a dropdown for changing order status
                            const orderStatusDropdown = document.createElement("select");
                            orderStatusDropdown.className = "order-status-dropdown";

                            const orderStatuses = ['pending', 'processing', 'completed', 'out_for_delivery', 'delivered'];
                            const currentStatusIndex = orderStatuses.indexOf(order.orderStatus.toLowerCase());

                            orderStatusDropdown.innerHTML = orderStatuses
                            .map((status, index) => {
                                if (index < currentStatusIndex) {
                                return `<option value="${status}" disabled>${status}</option>`;
                                } else {
                                return `<option value="${status}" ${index === currentStatusIndex ? 'selected' : ''}>${status}</option>`;
                                }
                            })
                            .join('');

                            // Button to update order status
                            const updateStatusButton = document.createElement("button");
                            updateStatusButton.textContent = "Update Status";
                            updateStatusButton.classList.add("btn", "btn-primary", "update-status-button"); // Add classes for styling
                            updateStatusButton.addEventListener("click", () => {
                                const newStatus = orderStatusDropdown.value;
                                updateOrderStatus(key, newStatus);
                            });

                            StatusChangeDiv.appendChild(orderStatusDropdown);
                            StatusChangeDiv.appendChild(updateStatusButton)

                            actionCell.appendChild(StatusChangeDiv);

                            if (order.orderStatus.toLowerCase() === 'completed') {
                                completedOrdersCount++;
                            }
                        } else {
                            console.log("User data does not contain a 'userName' field.");
                        }
                    } else {
                        console.log("No user found with the provided ID.");
                    }
                    completedOrders.innerHTML = completedOrdersCount;
                })
                .catch((error) => {
                    console.error("Error getting user by ID:", error);
                });
            }
        } else {
            alert("No data found");
        }
    })
    .catch((error) => {
        alert(error);
    });
}


function toCamelCase(word) {
    return word.replace(/[-_](.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}

function updateOrderStatus(orderId, newStatus) {
    const orderRef = ref(db, `Orders/${orderId}/orderStatus`);
    set(orderRef, newStatus)
    .then(() => {
        // alert("Order status updated successfully");
        getAllOrders(); // Refresh the orders list
    })
    .catch((error) => {
        alert("Error updating order status: " + error);
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
            return 0; 
        });
}

function getAllInquiries() {
    const usersCollection = collection(firestoreDB, "Inquiry");

    return getDocs(usersCollection)
        .then((querySnapshot) => {
            noOfInquiries.innerHTML = querySnapshot.size;
        })
        .catch((error) => {
            console.error("Error getting number of inquiries:", error);
            return 0; 
        });
}

window.onload = function() {
    getAllOrders();
    getAllUsers();
    getAllInquiries()
}
