import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireOperator } from '../middleware/roleAuth.js';
import { getOperatorDashboard, getCoordinators, assignCoordinator, getOperatorSchedule } from '../controllers/operatorController.js';

const router = Router();

router.get('/dashboard', authenticateToken, requireOperator, getOperatorDashboard);
router.get('/coordinators', authenticateToken, requireOperator, getCoordinators);
router.post('/assign-coordinator', authenticateToken, requireOperator, assignCoordinator);
router.get('/schedule', authenticateToken, requireOperator, getOperatorSchedule);

export const operatorRouter = router;
