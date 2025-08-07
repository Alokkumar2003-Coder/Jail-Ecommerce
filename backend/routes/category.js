import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

router.post('/', authenticate, authorizeRoles('admin'), categoryController.createCategory);
router.put('/:id', authenticate, authorizeRoles('admin'), categoryController.updateCategory);
router.delete('/:id', authenticate, authorizeRoles('admin'), categoryController.deleteCategory);

router.post(
  '/upload-image',
  authenticate,
  authorizeRoles('admin'),
  upload.single('image'),
  categoryController.uploadCategoryImage
);

export default router;