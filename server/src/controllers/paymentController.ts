import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

// ── LIST PAYMENTS ────────────────────────────────────────────────────────────
export const listPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, status } = req.query;
    const where: any = {};
    if (bookingId) where.bookingId = bookingId;
    if (status) where.status = status;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        booking: {
          include: {
            user: { select: { name: true, email: true } },
            trip: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ payments });
  } catch (err: any) {
    console.error('List payments error:', err);
    res.status(500).json({ error: 'Failed to retrieve payments.' });
  }
};

// ── CREATE PAYMENT ───────────────────────────────────────────────────────────
export const createPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, amount, method } = req.body;
    if (!bookingId || !amount) {
      res.status(400).json({ error: 'bookingId and amount are required.' });
      return;
    }

    // Simulate payment processing (for hackathon demo)
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: Number(amount),
        method: method || 'card',
        status: 'PAID',
        transactionId,
        paidAt: new Date(),
      },
    });

    // Auto-confirm the booking on successful payment
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    });

    // Notify user
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (booking) {
      await prisma.notification.create({
        data: {
          userId: booking.userId,
          type: 'payment',
          title: 'Payment Successful',
          message: `Payment of $${amount} processed (${transactionId}). Your booking is confirmed!`,
          actionUrl: `/app/bookings/${bookingId}`,
        },
      });
    }

    res.status(201).json({ message: 'Payment processed successfully.', payment });
  } catch (err: any) {
    console.error('Create payment error:', err);
    res.status(500).json({ error: 'Failed to process payment.' });
  }
};

// ── REFUND PAYMENT ───────────────────────────────────────────────────────────
export const refundPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { status: 'REFUNDED' },
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'REFUNDED' },
    });

    res.json({ message: 'Payment refunded.', payment });
  } catch (err: any) {
    console.error('Refund payment error:', err);
    res.status(500).json({ error: 'Failed to refund payment.' });
  }
};
