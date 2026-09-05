import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { listReviews, createReview, deleteReview } from '../controllers/reviewController.js';

const router = Router();

router.get('/', authenticateToken, listReviews);
router.post('/', authenticateToken, createReview);
router.delete('/:id', authenticateToken, deleteReview);

export const reviewRouter = router;
