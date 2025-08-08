import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Carousel extends Model {}

Carousel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    link: { type: DataTypes.STRING, allowNull: true }, // URL to redirect to
    description: { type: DataTypes.TEXT, allowNull: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    order: { type: DataTypes.INTEGER, defaultValue: 0 }, // For ordering carousel items
  },
  { sequelize, modelName: 'Carousel', timestamps: true }
);

export default Carousel;