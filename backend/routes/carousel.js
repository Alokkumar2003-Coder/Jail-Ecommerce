import express from 'express';
import * as carouselController from '../controllers/carouselController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', carouselController.getCarouselItems);

// Admin routes
router.get('/all', authenticate, authorizeRoles('admin'), carouselController.getAllCarouselItems);
router.get('/:id', authenticate, authorizeRoles('admin'), carouselController.getCarouselItem);
router.post('/', authenticate, authorizeRoles('admin'), carouselController.createCarouselItem);
router.put('/:id', authenticate, authorizeRoles('admin'), carouselController.updateCarouselItem);
router.delete('/:id', authenticate, authorizeRoles('admin'), carouselController.deleteCarouselItem);
router.post('/upload-image', authenticate, authorizeRoles('admin'), upload.single('image'), carouselController.uploadCarouselImage);
router.put('/order/update', authenticate, authorizeRoles('admin'), carouselController.updateCarouselOrder);

export default router;