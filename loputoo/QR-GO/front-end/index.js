import fetchOrderDetails from '../backend/order.js'


const foodOrder = fetchOrderDetails()
const orderDetailsDiv = document.getElementById('order-details');



$(document).ready(function() {
    $('#pay-button').click(function() {
        // Simulate a payment process
        console.log('Payment process started!');
        // Here you would typically call your payment API
    });
});