import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import upload from '../middleware/upload.js';
import * as blogController from '../controllers/blogController.js';

const router = express.Router();

router.get('/', blogController.getBlogs);
router.get('/:slugOrId', blogController.getBlog);

router.post('/', authenticate, authorizeRoles('admin'), blogController.createBlog);
router.put('/:id', authenticate, authorizeRoles('admin'), blogController.updateBlog);
router.delete('/:id', authenticate, authorizeRoles('admin'), blogController.deleteBlog);

router.post(
  '/upload-image',
  authenticate,
  authorizeRoles('admin'),
  upload.single('image'),
  blogController.uploadBlogImage
);

export default router;