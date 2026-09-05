import { Router } from 'express';
import { getUserAnalytics } from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/auth.js';

export const analyticsRouter = Router();

analyticsRouter.use(authenticateToken);
analyticsRouter.get('/', getUserAnalytics);
