import { Router } from 'express';
import { getPublicTrip, copyTrip } from '../controllers/shareController.js';
import { authenticateToken } from '../middleware/auth.js';

export const shareRouter = Router();

// Public trip viewing
shareRouter.get('/:shareSlug', getPublicTrip);

// Clone trip into logged-in user account
shareRouter.post('/:shareSlug/copy', authenticateToken, copyTrip);
