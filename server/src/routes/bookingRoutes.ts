import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireOperator } from '../middleware/roleAuth.js';
import { listBookings, getBooking, createBooking, updateBookingStatus, deleteBooking } from '../controllers/bookingController.js';

const router = Router();

router.get('/', authenticateToken, listBookings);
router.get('/:id', authenticateToken, getBooking);
router.post('/', authenticateToken, createBooking);
router.put('/:id/status', authenticateToken, requireOperator, updateBookingStatus);
router.delete('/:id', authenticateToken, requireOperator, deleteBooking);

export const bookingRouter = router;
