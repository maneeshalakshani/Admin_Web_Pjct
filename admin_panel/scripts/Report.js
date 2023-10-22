import { ref, onChildAdded, query, equalTo, orderByChild } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { db } from './configurations.js';

// Function to fetch and display completed orders in the table
function fetchAndDisplayCompletedOrders() {
  // Reference to the 'Orders' node in the Realtime Database
  const ordersRef = ref(db, 'Orders');

  // Reference to the HTML table
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  table.appendChild(thead);
  table.appendChild(tbody);

  // Create a query to filter orders with "orderStatus" equal to "Completed"
  const completedOrdersQuery = query(
    ordersRef,
    orderByChild("orderStatus"),
    equalTo("completed")
  );

  // Define table headers
  thead.innerHTML = `
    <tr>
      <th>Order ID</th>
      <th>Title</th>
      <th>Quantity</th>
      <th>Price</th>
      <th>Delivery Option</th>
      <th>Order Status</th>
    </tr>
  `;

  // Function to add a new row to the table
  function addOrderToTable(order) {
    const newRow = document.createElement("tr");

    const orderIdCell = document.createElement("td");
    orderIdCell.textContent = order.key;

    const titleCell = document.createElement("td");
    titleCell.textContent = order.val().title;

    const quantityCell = document.createElement("td");
    quantityCell.textContent = order.val().quantity;

    const priceCell = document.createElement("td");
    priceCell.textContent = order.val().price;

    const deliveryOptionCell = document.createElement("td");
    deliveryOptionCell.textContent = order.val().deliveryOption;

    const orderStatusCell = document.createElement("td");
    orderStatusCell.textContent = order.val().orderStatus;

    newRow.appendChild(orderIdCell);
    newRow.appendChild(titleCell);
    newRow.appendChild(quantityCell);
    newRow.appendChild(priceCell);
    newRow.appendChild(deliveryOptionCell);
    newRow.appendChild(orderStatusCell);

    tbody.appendChild(newRow);
  }

  // Event listener for the 'child_added' event to dynamically update the table
  onChildAdded(completedOrdersQuery, (childSnapshot) => {
    addOrderToTable(childSnapshot);
  });

  // Append the table to the report-table div
  const reportTableDiv = document.getElementById("report-table");
  reportTableDiv.innerHTML = "";
  reportTableDiv.appendChild(table);
}

// Define a function to generate the PDF report
function generatePDFReport() {
    document.getElementById('generatePdfButton').onclick = function() {
        
        var element = `<div>
            <table>
            <thead>
                <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                    <th>Column 3</th>
                    <th>Column 4</th>
                    <th>Column 5</th>
                    <th>Column 6</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Row 1, Cell 1</td>
                    <td>Row 1, Cell 2</td>
                    <td>Row 1, Cell 3</td>
                    <td>Row 1, Cell 4</td>
                    <td>Row 1, Cell 5</td>
                    <td>Row 1, Cell 6</td>
                </tr>
                <tr>
                    <td>Row 2, Cell 1</td>
                    <td>Row 2, Cell 2</td>
                    <td>Row 2, Cell 3</td>
                    <td>Row 2, Cell 4</td>
                    <td>Row 2, Cell 5</td>
                    <td>Row 2, Cell 6</td>
                </tr>
                <tr>
                    <td>Row 3, Cell 1</td>
                    <td>Row 3, Cell 2</td>
                    <td>Row 3, Cell 3</td>
                    <td>Row 3, Cell 4</td>
                    <td>Row 3, Cell 5</td>
                    <td>Row 3, Cell 6</td>
                </tr>
            </tbody>
        </table>
        </div>`;

        var opt = {
            margin: 1,
            filename: 'report.pdf',
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: {scale: 2},
            jsPDF: {unit: 'in', format: 'letter', 'orientation': 'portrait'}
        };

        html2pdf(element, opt);
    };
}

document.getElementById('generatePdfButton').onclick = function () {
    generatePDFReport();
  };



window.onload = function () {
  fetchAndDisplayCompletedOrders();
};

