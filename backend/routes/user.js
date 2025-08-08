import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/stats', authenticate, authorizeRoles('admin'), userController.getUserStats);

// Protected routes
router.get('/me', authenticate, userController.getCurrentUser);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/avatar', authenticate, upload.single('avatar'), userController.uploadAvatar);

// Admin routes
router.get('/', authenticate, authorizeRoles('admin'), userController.getUsers);
router.get('/:id', authenticate, authorizeRoles('admin'), userController.getUser);
router.put('/:id/role', authenticate, authorizeRoles('admin'), userController.updateUserRole);
router.delete('/:id', authenticate, authorizeRoles('admin'), userController.deleteUser);

export default router;