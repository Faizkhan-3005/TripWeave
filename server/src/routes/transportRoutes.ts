import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireOperator } from '../middleware/roleAuth.js';
import { listTransport, getTransport, createTransport, updateTransport, deleteTransport } from '../controllers/transportController.js';

const router = Router();

router.get('/', authenticateToken, listTransport);
router.get('/:id', authenticateToken, getTransport);
router.post('/', authenticateToken, requireOperator, createTransport);
router.put('/:id', authenticateToken, requireOperator, updateTransport);
router.delete('/:id', authenticateToken, requireOperator, deleteTransport);

export const transportRouter = router;
