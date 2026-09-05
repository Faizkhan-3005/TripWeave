import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

// ── LIST REVIEWS ─────────────────────────────────────────────────────────────
export const listReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId, userId } = req.query;
    const where: any = {};
    if (tripId) where.tripId = tripId;
    if (userId) where.userId = userId;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        trip: { select: { title: true, coverImage: true } },
        user: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reviews });
  } catch (err: any) {
    console.error('List reviews error:', err);
    res.status(500).json({ error: 'Failed to retrieve reviews.' });
  }
};

// ── CREATE REVIEW ────────────────────────────────────────────────────────────
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId, rating, comment, photos } = req.body;
    if (!tripId || !rating) {
      res.status(400).json({ error: 'tripId and rating are required.' });
      return;
    }
    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Rating must be between 1 and 5.' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        tripId,
        userId: req.userId!,
        rating: Number(rating),
        comment: comment || null,
        photos: photos || [],
      },
      include: {
        trip: { select: { title: true } },
        user: { select: { name: true, avatarUrl: true } },
      },
    });
    res.status(201).json({ message: 'Review submitted.', review });
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(400).json({ error: 'You have already reviewed this trip.' });
      return;
    }
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Failed to create review.' });
  }
};

// ── DELETE REVIEW ────────────────────────────────────────────────────────────
export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ message: 'Review deleted.' });
  } catch (err: any) {
    console.error('Delete review error:', err);
    res.status(500).json({ error: 'Failed to delete review.' });
  }
};
