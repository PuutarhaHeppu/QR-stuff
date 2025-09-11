<template>
  <div class="container mt-5 text-center">
    <h1>Order for {{ tableNumber }}</h1>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="orders.length">
      <table class="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Amount €</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.item }}</td>
            <td>{{ (order.amount / 100).toFixed(2) }}</td>
            <td>{{ order.quantity }}</td>
          </tr>
        </tbody>
      </table>

      <h4 class="mt-3">
        Total: €{{ (orders.reduce((sum, order) => sum + order.amount * order.quantity, 0) / 100).toFixed(2) }}
      </h4>

      <button class="btn btn-primary mt-2" @click="payOrder">Pay Now</button>
    </div>

    <div v-else>
      <p>No orders found for this table.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tableNumber = 'Table 2'
const orders = ref([])
const error = ref('')

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/order/new/${encodeURIComponent(tableNumber)}`)
    const data = res.data
    orders.value = data.items || []
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  }
})

const payOrder = async () => {
  try {
    const res = await axios.post(`http://localhost:5000/api/order/new/${encodeURIComponent(tableNumber)}/pay`)
    window.location.href = res.data.checkoutUrl
  } catch (error) {
    console.error('Payment error:', error)
    alert('Payment failed.')
  }
}
</script>

<style scoped>
.table {
  margin: 20px auto;
  max-width: 800px;
  border: 2px solid #ccc;
}
</style>
