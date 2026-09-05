import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getPreferences, savePreferences } from '../controllers/preferenceController.js';

const router = Router();

router.get('/', authenticateToken, getPreferences);
router.put('/', authenticateToken, savePreferences);

export const preferenceRouter = router;
