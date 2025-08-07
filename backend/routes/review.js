import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, reviewController.addReview);
router.put('/:id', authenticate, reviewController.editReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

export default router;