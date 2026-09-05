import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireOperator } from '../middleware/roleAuth.js';
import { listPayments, createPayment, refundPayment } from '../controllers/paymentController.js';

const router = Router();

router.get('/', authenticateToken, requireOperator, listPayments);
router.post('/', authenticateToken, createPayment);
router.put('/:id/refund', authenticateToken, requireOperator, refundPayment);

export const paymentRouter = router;
