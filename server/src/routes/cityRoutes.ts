import { Router } from 'express';
import { listCities, getCityById, listActivities, toggleSaveCity } from '../controllers/cityController.js';
import { authenticateToken } from '../middleware/auth.js';

export const cityRouter = Router();

// Public City & Activity discovery
cityRouter.get('/', listCities);
cityRouter.get('/:id', getCityById);

// Authenticated wishlist toggle
cityRouter.post('/:id/save', authenticateToken, toggleSaveCity);
