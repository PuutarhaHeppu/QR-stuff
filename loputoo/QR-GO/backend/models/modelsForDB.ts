import { Sequelize, DataTypes } from "sequelize"

export default (sequelize: Sequelize) => {
    const OrderDetails = sequelize.define("OrderDetails", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.NUMBER,
        },
        quantity: {
            type: DataTypes.NUMBER,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        }
    })

    return OrderDetails
}