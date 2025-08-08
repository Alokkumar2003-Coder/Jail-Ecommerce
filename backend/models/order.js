import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Order extends Model {}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    totalPrice: { type: DataTypes.FLOAT, allowNull: false },
    status: { 
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'), 
      defaultValue: 'pending' 
    },
    paymentMethod: { 
      type: DataTypes.ENUM('online', 'cod'), 
      defaultValue: 'online' 
    },
    paymentStatus: { 
      type: DataTypes.ENUM('pending', 'paid', 'failed'), 
      defaultValue: 'pending' 
    },
    shippingAddress: { type: DataTypes.TEXT, allowNull: false },
    // Additional order details
    customerName: { type: DataTypes.STRING, allowNull: false },
    customerEmail: { type: DataTypes.STRING, allowNull: false },
    customerPhone: { type: DataTypes.STRING, allowNull: true },
    shippingPhone: { type: DataTypes.STRING, allowNull: true },
    orderNotes: { type: DataTypes.TEXT, allowNull: true },
    trackingNumber: { type: DataTypes.STRING, allowNull: true },
    estimatedDelivery: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Order', timestamps: true }
);

export default Order;