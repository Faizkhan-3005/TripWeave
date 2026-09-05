import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

export const getPublicTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shareSlug } = req.params;

    const trip = await prisma.trip.findFirst({
      where: {
        shareSlug,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        stops: {
          orderBy: { orderIndex: 'asc' },
          include: { city: true },
        },
        tripActivities: {
          orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }],
          include: {
            activity: true,
            tripStop: { include: { city: true } },
          },
        },
        expenses: {
          select: { category: true, amount: true },
        },
      },
    });

    if (!trip) {
      res.status(404).json({ error: 'Public trip not found or link has expired.' });
      return;
    }

    const totalSpent = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const durationDays = Math.max(
      1,
      Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 3600 * 24))
    );

    res.json({
      trip: {
        ...trip,
        durationDays,
        totalSpent,
      },
    });
  } catch (err: any) {
    console.error('Get public trip error:', err);
    res.status(500).json({ error: 'Failed to retrieve public trip.' });
  }
};

export const copyTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shareSlug } = req.params;
    const userId = req.userId!;

    const sourceTrip = await prisma.trip.findFirst({
      where: {
        shareSlug,
        isPublic: true,
      },
      include: {
        stops: {
          orderBy: { orderIndex: 'asc' },
        },
        tripActivities: {
          orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }],
        },
      },
    });

    if (!sourceTrip) {
      res.status(404).json({ error: 'Source trip not found.' });
      return;
    }

    // Create cloned trip for the new user
    const clonedTrip = await prisma.trip.create({
      data: {
        userId,
        title: `Copy of ${sourceTrip.title}`,
        description: sourceTrip.description,
        coverImage: sourceTrip.coverImage,
        startDate: sourceTrip.startDate,
        endDate: sourceTrip.endDate,
        budget: sourceTrip.budget,
        currency: sourceTrip.currency,
        isPublic: true,
      },
    });

    // Map old stop IDs to new stop IDs
    const stopIdMap: Record<string, string> = {};

    for (const stop of sourceTrip.stops) {
      const newStop = await prisma.tripStop.create({
        data: {
          tripId: clonedTrip.id,
          cityId: stop.cityId,
          orderIndex: stop.orderIndex,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          notes: stop.notes,
        },
      });
      stopIdMap[stop.id] = newStop.id;
    }

    // Clone activities
    for (const act of sourceTrip.tripActivities) {
      await prisma.tripActivity.create({
        data: {
          tripId: clonedTrip.id,
          tripStopId: act.tripStopId ? stopIdMap[act.tripStopId] || null : null,
          activityId: act.activityId,
          customTitle: act.customTitle,
          dayNumber: act.dayNumber,
          scheduledTime: act.scheduledTime,
          estimatedCost: act.estimatedCost,
          category: act.category,
          orderIndex: act.orderIndex,
          notes: act.notes,
        },
      });
    }

    res.status(201).json({
      message: 'Trip copied successfully to your account! ✈️',
      tripId: clonedTrip.id,
    });
  } catch (err: any) {
    console.error('Copy trip error:', err);
    res.status(500).json({ error: 'Failed to copy trip.' });
  }
};
