import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import { tripRouter } from './routes/tripRoutes.js';
import { cityRouter } from './routes/cityRoutes.js';
import { activityRouter } from './routes/activityRoutes.js';
import { searchRouter } from './routes/searchRoutes.js';
import { analyticsRouter } from './routes/analyticsRoutes.js';
import { shareRouter } from './routes/shareRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
// PS7: New route imports
import { hotelRouter } from './routes/hotelRoutes.js';
import { transportRouter } from './routes/transportRoutes.js';
import { vendorRouter } from './routes/vendorRoutes.js';
import { bookingRouter } from './routes/bookingRoutes.js';
import { paymentRouter } from './routes/paymentRoutes.js';
import { tourGroupRouter } from './routes/tourGroupRoutes.js';
import { changeRouter } from './routes/changeRoutes.js';
import { notificationRouter } from './routes/notificationRoutes.js';
import { reviewRouter } from './routes/reviewRoutes.js';
import { operatorRouter } from './routes/operatorRoutes.js';
import { preferenceRouter } from './routes/preferenceRoutes.js';
import { aiRouter } from './routes/aiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Tripweave PS7 API',
  });
});

// ── Existing API Routes ──────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/trips', tripRouter);
app.use('/api/cities', cityRouter);
app.use('/api/activities', activityRouter);
app.use('/api/search', searchRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/share', shareRouter);
app.use('/api/admin', adminRouter);

// ── PS7: New API Routes ─────────────────────────────────────────────────────
app.use('/api/hotels', hotelRouter);
app.use('/api/transport', transportRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/tour-groups', tourGroupRouter);
app.use('/api/changes', changeRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/operator', operatorRouter);
app.use('/api/preferences', preferenceRouter);
app.use('/api/ai', aiRouter);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Tripweave PS7 API running on http://localhost:${PORT}`);
  console.log(`🔌 Database: PostgreSQL with Prisma ORM`);
  console.log(`📡 Routes: 20 API modules registered`);
});
