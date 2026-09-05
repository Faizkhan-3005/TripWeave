import { Router } from 'express';
import { chatWithAi } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';

export const aiRouter = Router();

aiRouter.use(authenticateToken);

aiRouter.post('/chat', chatWithAi);
