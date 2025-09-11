export type mealDetails = {
    id: string
    name: string
    price: number
    quantity: number
    totalSum: number
}

export type Order = {
    id: string
    locationId: string
    createdAt: Date
    updatedAt: Date
}