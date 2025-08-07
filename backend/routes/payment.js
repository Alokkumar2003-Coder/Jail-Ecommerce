import express from 'express';
import { createPaymentIntent, stripeWebhook, refundOrder } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = express.Router();

router.post('/create-payment-intent', authenticate, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.post('/refund', authenticate, authorizeRoles('admin'), refundOrder);

export default router;