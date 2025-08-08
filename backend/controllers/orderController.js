import db from '../models/index.js';

// Create order
export const createOrder = async (req, res) => {
  try {
    const { 
      items, 
      shippingAddress, 
      totalPrice, 
      paymentMethod, 
      paymentStatus,
      customerName,
      customerEmail,
      customerPhone,
      shippingPhone,
      orderNotes
    } = req.body;
    
    console.log('Creating order with payment method:', paymentMethod);
    console.log('Payment status:', paymentStatus);

    // Get user details
    const user = await db.User.findByPk(req.user.id);

    const order = await db.Order.create({
      userId: req.user.id,
      totalPrice,
      status: 'pending',
      paymentMethod: paymentMethod || 'online',
      paymentStatus: paymentStatus || 'pending',
      shippingAddress: JSON.stringify(shippingAddress),
      customerName: customerName || user.name,
      customerEmail: customerEmail || user.email,
      customerPhone: customerPhone || user.phone,
      shippingPhone: shippingPhone || customerPhone || user.phone,
      orderNotes: orderNotes || null,
    });

    // Create order items
    for (const item of items) {
      await db.OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // Update product stock
    for (const item of items) {
      const product = await db.Product.findByPk(item.productId);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: db.OrderItem,
          include: [{ model: db.Product, attributes: ['id', 'title', 'images'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    console.log('Fetching all orders for admin...');
    
    // First, let's check if we have any orders at all
    const orderCount = await db.Order.count();
    console.log('Total orders in database:', orderCount);
    
    if (orderCount === 0) {
      console.log('No orders found in database');
      return res.json([]);
    }
    
    // Try to get orders with includes
    const orders = await db.Order.findAll({
      include: [
        { 
          model: db.User, 
          attributes: ['id', 'name', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'],
          required: false // Make it a LEFT JOIN
        },
        {
          model: db.OrderItem,
          include: [{ 
            model: db.Product, 
            attributes: ['id', 'title', 'images', 'price'],
            required: false // Make it a LEFT JOIN
          }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    
    console.log('Orders found with includes:', orders.length);
    if (orders.length > 0) {
      console.log('First order structure:', {
        id: orders[0].id,
        hasUser: !!orders[0].User,
        hasOrderItems: !!orders[0].OrderItems,
        userData: orders[0].User,
        orderItemsCount: orders[0].OrderItems?.length || 0
      });
    }
    
    res.json(orders);
  } catch (err) {
    console.error('Error in getAllOrders:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await db.Order.findByPk(id, {
      include: [
        { model: db.User, attributes: ['id', 'name', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'] },
        {
          model: db.OrderItem,
          include: [{ model: db.Product, attributes: ['id', 'title', 'images', 'price'] }],
        },
      ],
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, trackingNumber, estimatedDelivery } = req.body;
    
    const order = await db.Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
    
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};