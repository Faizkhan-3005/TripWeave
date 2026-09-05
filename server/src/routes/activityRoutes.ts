import { Router } from 'express';
import { listActivities } from '../controllers/cityController.js';

export const activityRouter = Router();

activityRouter.get('/', listActivities);
