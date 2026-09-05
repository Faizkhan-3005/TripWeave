import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireOperator } from '../middleware/roleAuth.js';
import { listHotels, getHotel, createHotel, updateHotel, deleteHotel } from '../controllers/hotelController.js';

const router = Router();

router.get('/', authenticateToken, listHotels);
router.get('/:id', authenticateToken, getHotel);
router.post('/', authenticateToken, requireOperator, createHotel);
router.put('/:id', authenticateToken, requireOperator, updateHotel);
router.delete('/:id', authenticateToken, requireOperator, deleteHotel);

export const hotelRouter = router;
