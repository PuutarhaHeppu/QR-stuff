// import { SquareClient, SquareEnvironment } from "square";
// import {idKey} from "./idempotencyKeyGenerator.js"

// const url = SquareEnvironment.Sandbox

// async function main() {
//     const client = new SquareClient({
//         environment: SquareEnvironment.Sandbox,
//         token: "EAAAl1au-pCEdEqpawEP_iC_TRmXH8JJv7BG7pf_ZNV2r3ETsn-w14vfQQFrI3Eh",
//     });
//     await client.payments.create({
//         amountMoney: {
//             amount: BigInt("12"),
//             currency: "USD",
//         },
//         idempotencyKey: idKey.toString('hex'),
//         sourceId: "cnon:card-nonce-ok",
//         teamMemberId: "TMga2w6nSLEkJlzY",
//         autocomplete: true,
//     });
//   }
// main()

// Replace with your actual POS API endpoint
const apiEndpoint = 'localhost:5000/api/orderDetails'; // Example endpoint

// Fetch order details from the API
async function fetchOrderDetails() {
    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }
        const orderData = await response.json();
        displayOrderDetails(orderData);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('order-details').innerHTML = '<p class="text-danger">Failed to load order details. Please try again later.</p>';
    }
}

// Display order details on the page
function displayOrderDetails(orderData) {
    const orderDetailsDiv = document.getElementById('order-details');
    const test123 = document.getElementById('test');
    if (orderData && orderData.items && orderData.items.length > 0) {
        const orderList = orderData.items.map(items => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${items.name}</h5>
                    <p id="test" class="card-text">Quantity: ${items.quantity}</p>
                    <p class="card-text">Summa: $${items.price.toFixed(2)}</p>
                </div>
            </div>
        `).join('');
        orderDetailsDiv.innerHTML = orderList;
    } else {
        orderDetailsDiv.innerHTML = '<p class="text-warning">No items found in your order.</p>';
    }
    if (orderData && orderData.items && orderData.items.length > 0) {
        const test456 = orderData.item.map(item => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p id="test" class="card-text">Quantity: ${item.quantity}</p>
                    <p class="card-text">Summa: $${item.price.toFixed(2)}</p>
                </div>
            </div>
        `).join('');
        test123.innerHTML = test456;
    } else {
        test123.innerHTML = '<p class="text-warning">No items found in your order.</p>';
    }
}

// Call the function to fetch and display order details
export default fetchOrderDetails();