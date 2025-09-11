import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InsertOrder from '@/views/InsertOrder.vue'
import Table1 from '@/views/tables/Table1.vue'
import TableExample from '@/views/Tables/TableExample.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'TableExample',
      component: TableExample
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/Order',
      name: 'InsertOrder',
      component: InsertOrder
    },
    {
      path: '/tables/table1',
      name: 'Table1',
      component: Table1
    }
  ],
})

export default router
