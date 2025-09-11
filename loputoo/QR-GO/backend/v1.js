import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import Stripe from 'stripe'
import { Client, Environment } from 'square'
import { idKey } from './idempotencyKeyGenerator.js'
import { connectToMongo, getDb } from './db.ts'

await connectToMongo()

const stripe = new Stripe(process.env.STRIPE_SK)
const app = express()
app.use(cors())
app.use(express.json())

const db = getDb()

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
})

const ordersApi = squareClient.ordersApi
const catalogApi = squareClient.catalogApi
const LOCATION_ID = process.env.LOCATION_ID

//Create new order
app.post('/api/order/new/:tableNumber', async (req, res) => {
  const { items } = req.body
  const { tableNumber } = req.params

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing or empty items list' })
  }

  try {
    const lineItems = []
    const orderItems = []

    for (const { id: itemId, quantity } of items) {
      const { result } = await catalogApi.retrieveCatalogObject(itemId, true)
      const variation = result.object

      if (!variation || variation.type !== 'ITEM_VARIATION') {
        return res.status(400).json({ error: `Invalid variation: ${itemId}` })
      }

      const item = result.relatedObjects?.find(obj => obj.type === 'ITEM')
      const priceMoney = variation.itemVariationData.priceMoney

      lineItems.push({
        quantity: quantity.toString(),
        catalogObjectId: variation.id,
      })

      orderItems.push({
        item: item.itemData.name,
        quantity: parseInt(quantity),
        amount: Number(priceMoney.amount),
        currency: priceMoney.currency,
      })
    }

    const orderId = uuidv4()
    await ordersApi.createOrder({
      idempotencyKey: idKey.toString('hex'),
      order: {
        locationId: LOCATION_ID,
        referenceId: `order-${orderId}`.slice(0, 40),
        lineItems,
      },
    })

    await db.collection('TableOrders').insertOne({
      tableNumber,
      orderId: orderId,
      items: orderItems,
      paid: false
    })

    res.json({ orderId, items: orderItems })
  } catch (error) {
    console.error('Failed to create order:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

//Get order details
app.get('/api/order/new/:tableNumber', async (req, res) => {
  const { tableNumber } = req.params
  const order = await db.collection('TableOrders').findOne({ tableNumber })
  if (!order) return res.status(404).json({ error: 'No order for this table' })
  res.json(order)
})

//Stripe Checkout
app.post('/api/order/new/:tableNumber/pay', async (req, res) => {
  const { tableNumber } = req.params
  const order = await db.collection('TableOrders').findOne({ tableNumber })

  if (!order || !order.items || order.items.length === 0) {
    return res.status(404).json({ error: 'Order not found or empty' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.items.map(item => ({
        price_data: {
          currency: item.currency.toLowerCase(),
          product_data: { name: item.item },
          unit_amount: item.amount,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.URL}/order/success.html`,
      cancel_url: `${process.env.URL}/order/cancel.html`,
    })

    res.json({ checkoutUrl: session.url })
  } catch (error) {
    console.error('Stripe session failed:', error)
    res.status(500).json({ error: 'Stripe payment error' })
  }
})

//when user is directed here mark the order as paid in the db
app.get('/order/success.html', async (req, res) => {
  const { orderId } = req.query
  await db.collection('TableOrdersDone').insertOne(
    { orderId, paid: true }
  )
  await db.collection('TableOrders').deleteOne({ orderId })
  res.send('Payment successful!')
})

app.get('/order/cancel.html', (req, res) => {
  const tableNumber = req.query.tableNumber
  res.redirect(`/api/order/new/${tableNumber}`)
})

// get menu items 
app.get('/api/catalog', async (_, res) => {
  try {
    const result = await squareClient.catalogApi.listCatalog(undefined, 'ITEM,ITEM_VARIATION')
    const items = result.result.objects
      .filter(obj => obj.type === 'ITEM')
      .map(item => {
        const variation = item.itemData.variations[0]
        return {
          id: variation.id,
          name: item?.itemData?.name,
          price: Number(variation?.itemVariationData?.priceMoney?.amount)
        }
      })
    res.json(items)
  } catch (error) {
    console.error('Failed to fetch catalog:', error)
    res.status(500).json({ error: 'Failed to fetch catalog' })
  }
})

//Start server
const PORT = 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
