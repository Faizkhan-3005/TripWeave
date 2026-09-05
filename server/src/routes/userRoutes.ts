import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

export const userRouter = Router();

userRouter.use(authenticateToken);
userRouter.get('/profile', getProfile);
userRouter.put('/profile', updateProfile);
