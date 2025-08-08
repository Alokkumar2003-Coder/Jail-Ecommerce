import db from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

// Summary endpoint - matches frontend expectation
export const getSummary = async (req, res) => {
  try {
    const totalOrders = await db.Order.count();
    const totalRevenue = await db.Order.sum('totalPrice', { where: { paymentStatus: 'paid' } });
    
    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayOrders = await db.Order.count({
      where: {
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      }
    });
    
    const todayRevenue = await db.Order.sum('totalPrice', {
      where: {
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        },
        paymentStatus: 'paid'
      }
    });
    
    // Get this month's stats
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const monthOrders = await db.Order.count({
      where: {
        createdAt: {
          [Op.gte]: thisMonth
        }
      }
    });
    
    const monthRevenue = await db.Order.sum('totalPrice', {
      where: {
        createdAt: {
          [Op.gte]: thisMonth
        },
        paymentStatus: 'paid'
      }
    });
    
    // Get pending orders
    const pendingOrders = await db.Order.count({
      where: { paymentStatus: 'pending' }
    });
    
    res.json({ 
      totalOrders, 
      totalRevenue: totalRevenue || 0,
      todayOrders,
      todayRevenue: todayRevenue || 0,
      monthOrders,
      monthRevenue: monthRevenue || 0,
      pendingOrders
    });
  } catch (err) {
    console.error('Error in getSummary:', err);
    res.status(500).json({ message: err.message });
  }
};

// Keep the old function for backward compatibility
export const getSalesSummary = async (req, res) => {
  return getSummary(req, res);
};

export const getSalesByDay = async (req, res) => {
  try {
    const sales = await db.Order.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('SUM', col('totalPrice')), 'total'],
        [fn('COUNT', col('id')), 'orders'],
      ],
      where: {
        createdAt: {
          [Op.gte]: literal('DATE_SUB(NOW(), INTERVAL 30 DAY)'),
        },
        paymentStatus: 'paid',
      },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
    });
    res.json(sales);
  } catch (err) {
    console.error('Error in getSalesByDay:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await db.OrderItem.findAll({
      attributes: [
        'productId',
        [fn('SUM', col('quantity')), 'totalSold'],
        [fn('SUM', literal('quantity * price')), 'totalRevenue'],
      ],
      include: [{ model: db.Product, attributes: ['title', 'price'] }],
      group: ['productId', 'Product.id'],
      order: [[fn('SUM', col('quantity')), 'DESC']],
      limit: 10,
    });
    res.json(topProducts);
  } catch (err) {
    console.error('Error in getTopProducts:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getCategoryStats = async (req, res) => {
  try {
    const categoryStats = await db.OrderItem.findAll({
      attributes: [
        [fn('SUM', col('quantity')), 'totalSold'],
        [fn('SUM', literal('quantity * price')), 'totalRevenue'],
      ],
      include: [
        { 
          model: db.Product, 
          attributes: ['categoryId'],
          include: [{ model: db.Category, attributes: ['name'] }]
        }
      ],
      group: ['Product.categoryId', 'Product.Category.id'],
      order: [[fn('SUM', literal('quantity * price')), 'DESC']],
    });
    res.json(categoryStats);
  } catch (err) {
    console.error('Error in getCategoryStats:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await db.Order.findAll({
      include: [
        { model: db.User, attributes: ['name', 'email'] },
        { model: db.OrderItem, include: [{ model: db.Product, attributes: ['title'] }] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    res.json(recentOrders);
  } catch (err) {
    console.error('Error in getRecentOrders:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getInventoryStats = async (req, res) => {
  try {
    const totalProducts = await db.Product.count();
    const outOfStock = await db.Product.count({ where: { stock: 0 } });
    const lowStock = await db.Product.count({ where: { stock: { [Op.lte]: 10 } } });
    const totalValue = await db.Product.sum(literal('stock * price'));
    
    res.json({
      totalProducts,
      outOfStock,
      lowStock,
      totalValue: totalValue || 0,
      stockUtilization: totalProducts > 0 ? ((totalProducts - outOfStock) / totalProducts * 100).toFixed(1) : '0.0'
    });
  } catch (err) {
    console.error('Error in getInventoryStats:', err);
    res.status(500).json({ message: err.message });
  }
};