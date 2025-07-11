import Stripe from 'stripe'
const stripe = new Stripe("sk_test_51R6cPiPqEW3s676kYdMoUAQVUGXW0QngS1vhGBrZ0AU5eef25QciuDomyCSHUMokkAcIRGFtkTJ2zMzwnvUvpYFi00YyeJSwC6")

const payment = stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'USD',
        product_data: {
          name: 'Test QR Payment',
        },
        unit_amount: 500,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'http://localhost:5000/testSuccess',
    cancel_url: 'http://localhost:5000/testFail',
});