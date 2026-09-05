import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { listNotifications, markAsRead, markAllAsRead, deleteNotification } from '../controllers/notificationController.js';

const router = Router();

router.get('/', authenticateToken, listNotifications);
router.put('/read-all', authenticateToken, markAllAsRead);
router.put('/:id/read', authenticateToken, markAsRead);
router.delete('/:id', authenticateToken, deleteNotification);

export const notificationRouter = router;
