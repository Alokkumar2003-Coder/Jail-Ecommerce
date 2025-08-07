import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Product extends Model {}

Product.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    discount: { type: DataTypes.FLOAT, defaultValue: 0 },
    images: { type: DataTypes.JSON, allowNull: true }, // Array of image URLs
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: 'Product', timestamps: true }
);

export default Product;