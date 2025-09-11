import { Client, Environment } from 'square'
import 'dotenv/config'

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
})

const catalogApi = client.catalogApi

async function listItems() {
  try {
    const { result } = await catalogApi.searchCatalogObjects({
      objectTypes: ['ITEM'],
    })

    const items = result.objects || []

    console.log('Your catalog items:')
    for (const item of items) {
      console.log(`id: ${item.id}, name: ${item.itemData.name}, price: ${Number(item?.itemData?.variations[0]?.itemVariationData?.priceMoney?.amount) / 100 || 0}€`)
    }
  } catch (error) {
    console.error('Failed to fetch items:', error)
  }
}

console.log(listItems())