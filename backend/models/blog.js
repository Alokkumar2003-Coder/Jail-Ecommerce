import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Blog extends Model {}

Blog.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true, allowNull: false },
    excerpt: { type: DataTypes.TEXT, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    coverImage: { type: DataTypes.STRING, allowNull: true },
    images: { type: DataTypes.JSON, allowNull: true }, // optional gallery
    tags: { type: DataTypes.JSON, allowNull: true },   // array of strings
    published: { type: DataTypes.BOOLEAN, defaultValue: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: 'Blog', timestamps: true }
);

export default Blog;