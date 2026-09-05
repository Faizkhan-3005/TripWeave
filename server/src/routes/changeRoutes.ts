import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { listChanges, createChange, resolveChange } from '../controllers/changeController.js';

const router = Router();

router.get('/', authenticateToken, listChanges);
router.post('/', authenticateToken, createChange);
router.put('/:id/resolve', authenticateToken, resolveChange);

export const changeRouter = router;
