import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

// ── LIST NOTIFICATIONS ───────────────────────────────────────────────────────
export const listNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { unreadOnly } = req.query;
    const where: any = { userId: req.userId };
    if (unreadOnly === 'true') where.isRead = false;

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.userId, isRead: false },
    });

    res.json({ notifications, unreadCount });
  } catch (err: any) {
    console.error('List notifications error:', err);
    res.status(500).json({ error: 'Failed to retrieve notifications.' });
  }
};

// ── MARK AS READ ─────────────────────────────────────────────────────────────
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json({ message: 'Notification marked as read.' });
  } catch (err: any) {
    console.error('Mark notification read error:', err);
    res.status(500).json({ error: 'Failed to update notification.' });
  }
};

// ── MARK ALL AS READ ─────────────────────────────────────────────────────────
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.userId, isRead: false },
      data: { isRead: true },
    });
    res.json({ message: 'All notifications marked as read.' });
  } catch (err: any) {
    console.error('Mark all read error:', err);
    res.status(500).json({ error: 'Failed to update notifications.' });
  }
};

// ── DELETE NOTIFICATION ──────────────────────────────────────────────────────
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.notification.delete({ where: { id: req.params.id } });
    res.json({ message: 'Notification deleted.' });
  } catch (err: any) {
    console.error('Delete notification error:', err);
    res.status(500).json({ error: 'Failed to delete notification.' });
  }
};
