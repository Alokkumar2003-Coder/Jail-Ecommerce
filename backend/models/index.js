import sequelize from '../config/database.js';
import User from './user.js';
import Category from './category.js';
import Product from './product.js';
import Order from './order.js';
import OrderItem from './orderItem.js';
import Review from './review.js';
import Blog from './blog.js';
import Carousel from './carousel.js';

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// Blog associations
User.hasMany(Blog, { foreignKey: 'authorId' });
Blog.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

const db = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Review,
  Blog,
  Carousel,
};

export default db;