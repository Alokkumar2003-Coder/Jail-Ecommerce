import express from 'express';
import * as productController from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

router.post('/', authenticate, authorizeRoles('admin'), productController.createProduct);
router.put('/:id', authenticate, authorizeRoles('admin'), productController.updateProduct);
router.delete('/:id', authenticate, authorizeRoles('admin'), productController.deleteProduct);

router.post(
  '/upload-image',
  authenticate,
  authorizeRoles('admin'),
  upload.single('image'),
  productController.uploadProductImage
);

export default router;