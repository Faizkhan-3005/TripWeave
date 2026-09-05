import { Router } from 'express';
import { getAdminTelemetry } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

export const adminRouter = Router();

adminRouter.use(authenticateToken);
adminRouter.get('/telemetry', getAdminTelemetry);
