import express from 'express'
import Stripe from 'stripe'
const stripe = new Stripe('sk_test_51R6cPiPqEW3s676kYdMoUAQVUGXW0QngS1vhGBrZ0AU5eef25QciuDomyCSHUMokkAcIRGFtkTJ2zMzwnvUvpYFi00YyeJSwC6');

const app = express()
const url = `http://localhost:${port}/`
const port = 5000

app.use(express.static('front-end'));
app.use(express.json());

app.get("/", (req, res) => {
    try {
        res.sendStatus(200)
    }
    catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
})

app.get("/testSuccess", (req, res) => {
    try {
        res.send(payment)
    }
    catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
})

app.get("/testPayment", (req, res) => {
    try {
        res.send(payment)
    }
    catch (e) {
        res.redirect("/testFail")
        console.log(e)
    }
})

app.get("/testFail", (req, res) => {
    res.send("Payment failed")
})

app.listen(port, () => {
    console.log(`API up at: ${url}${port}`)
})