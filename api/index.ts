import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from '../server/src/routes/authRoutes.js';
import { userRouter } from '../server/src/routes/userRoutes.js';
import { tripRouter } from '../server/src/routes/tripRoutes.js';
import { cityRouter } from '../server/src/routes/cityRoutes.js';
import { activityRouter } from '../server/src/routes/activityRoutes.js';
import { searchRouter } from '../server/src/routes/searchRoutes.js';
import { analyticsRouter } from '../server/src/routes/analyticsRoutes.js';
import { shareRouter } from '../server/src/routes/shareRoutes.js';
import { adminRouter } from '../server/src/routes/adminRoutes.js';
import { errorHandler } from '../server/src/middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/trips', tripRouter);
app.use('/api/cities', cityRouter);
app.use('/api/activities', activityRouter);
app.use('/api/search', searchRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/share', shareRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Tripweave Serverless API on Vercel' });
});

app.use(errorHandler);

export default app;
