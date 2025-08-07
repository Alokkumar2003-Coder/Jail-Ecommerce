import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorizeRoles('admin'));

router.get('/', userController.getUsers);
router.get('/stats', userController.getUserStats);
router.get('/:id', userController.getUser);
router.put('/:id/role', userController.updateUserRole);
router.delete('/:id', userController.deleteUser);

export default router;

