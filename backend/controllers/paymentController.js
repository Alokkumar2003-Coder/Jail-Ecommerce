import stripe from '../utils/stripe.js';
import db from '../models/index.js';

// Create payment intent
export const createPaymentIntent = async (req, res) => {
  const { amount, currency = 'usd', orderId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { orderId: orderId ? String(orderId) : '' },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Stripe webhook
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    if (orderId) {
      await db.Order.update(
        { paymentStatus: 'paid', paymentIntentId: paymentIntent.id },
        { where: { id: orderId } }
      );
    }
  }
  if (event.type === 'charge.refunded') {
    const charge = event.data.object;
    const paymentIntentId = charge.payment_intent;
    await db.Order.update(
      { paymentStatus: 'refunded' },
      { where: { paymentIntentId } }
    );
  }

  res.json({ received: true });
};

// Refund order (admin)
export const refundOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await db.Order.findByPk(orderId);
    if (!order || order.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Order not found or not paid' });
    }
    const paymentIntentId = order.paymentIntentId;
    if (!paymentIntentId) {
      return res.status(400).json({ message: 'No payment intent for this order' });
    }
    const refund = await stripe.refunds.create({ payment_intent: paymentIntentId });
    order.paymentStatus = 'refunded';
    await order.save();
    res.json({ message: 'Refund initiated', refund });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};