import { MongoClient } from 'mongodb'
import 'dotenv/config'

const client = new MongoClient(process.env.MONGO_URI)
let db: any

export async function connectToMongo() {
  try {
    await client.connect()
    db = client.db()
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export function getDb() {
  if (!db) throw new Error('DB not connected. Call connectToMongo()')
  return db
}
