import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = express.Router();

router.get('/summary', authenticate, authorizeRoles('admin'), analyticsController.getSalesSummary);
router.get('/sales-by-day', authenticate, authorizeRoles('admin'), analyticsController.getSalesByDay);
router.get('/top-products', authenticate, authorizeRoles('admin'), analyticsController.getTopProducts);
router.get('/category-stats', authenticate, authorizeRoles('admin'), analyticsController.getCategoryStats);
router.get('/recent-orders', authenticate, authorizeRoles('admin'), analyticsController.getRecentOrders);
router.get('/inventory-stats', authenticate, authorizeRoles('admin'), analyticsController.getInventoryStats);

export default router;