<template>
  <div class="container mt-5">
    <h2>Send Order to Table</h2>

    <div class="form-group mb-3">
      <label for="tableSelect">Select Table:</label>
      <select v-model="selectedTable" class="form-select">
        <option v-for="table in tables" :key="table" :value="table">{{ table }}</option>
      </select>
    </div>

    <div v-if="catalog.length > 0">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price (€)</th>
            <th>Quantity</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in catalog" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ (item.price / 100).toFixed(2) }}</td>
            <td>
              <input type="number" v-model.number="item.quantity" min="1" class="form-control" />
            </td>
            <td>
              <button class="btn btn-primary" @click="addToOrder(item)">Add</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="orderItems.length">
        <h4 class="mt-4">Items to send:</h4>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in orderItems" :key="item.id">
              <td>{{ getItemName(item.id) }}</td>
              <td>{{ item.quantity }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click="removeFromOrder(item.id)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        class="btn btn-success mt-3"
        @click="submitOrder()"
        :disabled="orderItems.length === 0 || !selectedTable"
      >
        Send Order to Table
      </button>
    </div>
    <div v-else>
      <p>Loading catalog...</p>
    </div>

    <Table1 />
    <Table2 />
    
  </div>
</template>
<!-- This file is made to mimic the restaurant order system. It is purely for testing purposes. -->
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Table1 from './tables/Table1.vue'
import Table2 from './tables/Table2.vue'

const catalog = ref([])
const orderItems = ref([])
const selectedTable = ref('')
const tables = ref(['Table 1', 'Table 2'])

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/catalog')
    catalog.value = res.data.map(item => ({
      ...item,
      quantity: 1 // default to 1 for easier testing
    }))
  } catch (error) {
    console.error('Failed to load catalog:', error)
  }
})

const addToOrder = (item) => {
  if (!item.quantity || item.quantity <= 0) {
    alert('Please enter a quantity greater than 0')
    return
  }

  const existing = orderItems.value.find(i => i.id === item.id)
  if (existing) {
    existing.quantity += item.quantity
  } else {
    orderItems.value.push({ id: item.id, quantity: item.quantity })
  }

  item.quantity = 1 // reset input field
}

const removeFromOrder = (id) => {
  orderItems.value = orderItems.value.filter(item => item.id !== id)

  // Reset the quantity in the catalog UI as well
  const catItem = catalog.value.find(i => i.id === id)
  if (catItem) catItem.quantity = 1
}

const getItemName = (id) => {
  const item = catalog.value.find(i => i.id === id)
  return item ? item.name : 'Unknown'
}

const submitOrder = async () => {
  try {
    const payload = {
      items: orderItems.value
    }
    await axios.post(`http://localhost:5000/api/order/new/${selectedTable.value}`, payload)
    alert(`Order sent to ${selectedTable.value}`)
  } catch (error) {
    console.error('Failed to send order:', error)
    alert('Failed to send order')
  }
}
</script>


<style scoped>
.container {
  max-width: 800px;
}
</style>
