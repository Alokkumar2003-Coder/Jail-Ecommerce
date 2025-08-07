import db from '../models/index.js';

// Get all orders (admin) or user’s own orders
export const getOrders = async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const orders = await db.Order.findAll({
      where,
      include: [
        { model: db.OrderItem, include: [db.Product] },
        { model: db.User, attributes: ['id', 'name', 'email'] },
      ],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await db.Order.findByPk(req.params.id, {
      include: [
        { model: db.OrderItem, include: [db.Product] },
        { model: db.User, attributes: ['id', 'name', 'email'] },
      ],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'admin' && order.userId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create order (checkout)
export const createOrder = async (req, res) => {
  const { items, shippingAddress, totalPrice, paymentIntentId } = req.body;
  try {
    const order = await db.Order.create(
      {
        userId: req.user.id,
        shippingAddress,
        totalPrice,
        paymentIntentId,
        OrderItems: items,
      },
      { include: [db.OrderItem] }
    );
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await db.Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status ?? order.status;
    order.paymentStatus = req.body.paymentStatus ?? order.paymentStatus;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};