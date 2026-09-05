import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

export const addActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId } = req.params;
    const { activityId, tripStopId, customTitle, dayNumber, scheduledTime, estimatedCost, category, notes } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    let defaultCost = Number(estimatedCost) || 0;
    let defaultCategory = category || 'Sightseeing';
    let defaultTitle = customTitle;

    if (activityId) {
      const template = await prisma.activity.findUnique({ where: { id: activityId } });
      if (template) {
        if (defaultCost === 0) defaultCost = template.cost;
        if (!category) defaultCategory = template.category;
        if (!defaultTitle) defaultTitle = template.name;
      }
    }

    const tripActivity = await prisma.tripActivity.create({
      data: {
        tripId,
        tripStopId: tripStopId || null,
        activityId: activityId || null,
        customTitle: defaultTitle,
        dayNumber: Number(dayNumber) || 1,
        scheduledTime: scheduledTime || '10:00',
        estimatedCost: defaultCost,
        category: defaultCategory,
        notes: notes?.trim() || '',
      },
      include: {
        activity: true,
        tripStop: { include: { city: true } },
      },
    });

    res.status(201).json({ message: 'Activity added to itinerary.', tripActivity });
  } catch (err: any) {
    console.error('Add activity error:', err);
    res.status(500).json({ error: 'Failed to add activity.' });
  }
};

export const updateActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId, activityId } = req.params;
    const { customTitle, dayNumber, scheduledTime, estimatedCost, category, notes, isCompleted, tripStopId } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    const updated = await prisma.tripActivity.update({
      where: { id: activityId },
      data: {
        customTitle: customTitle !== undefined ? customTitle.trim() : undefined,
        dayNumber: dayNumber !== undefined ? Number(dayNumber) : undefined,
        scheduledTime: scheduledTime !== undefined ? scheduledTime : undefined,
        estimatedCost: estimatedCost !== undefined ? Number(estimatedCost) : undefined,
        category: category !== undefined ? category : undefined,
        notes: notes !== undefined ? notes.trim() : undefined,
        isCompleted: isCompleted !== undefined ? Boolean(isCompleted) : undefined,
        tripStopId: tripStopId !== undefined ? tripStopId : undefined,
      },
      include: {
        activity: true,
        tripStop: { include: { city: true } },
      },
    });

    res.json({ message: 'Activity updated successfully.', tripActivity: updated });
  } catch (err: any) {
    console.error('Update activity error:', err);
    res.status(500).json({ error: 'Failed to update activity.' });
  }
};

export const reorderActivities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId } = req.params;
    const { activities } = req.body; // Array of { id, dayNumber, orderIndex }

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    if (!Array.isArray(activities)) {
      res.status(400).json({ error: 'Activities array required.' });
      return;
    }

    await prisma.$transaction(
      activities.map((a: { id: string; dayNumber?: number; orderIndex?: number }) =>
        prisma.tripActivity.update({
          where: { id: a.id },
          data: {
            dayNumber: a.dayNumber !== undefined ? a.dayNumber : undefined,
            orderIndex: a.orderIndex !== undefined ? a.orderIndex : undefined,
          },
        })
      )
    );

    res.json({ message: 'Activities reordered successfully.' });
  } catch (err: any) {
    console.error('Reorder activities error:', err);
    res.status(500).json({ error: 'Failed to reorder activities.' });
  }
};

export const removeActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId, activityId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    await prisma.tripActivity.delete({
      where: { id: activityId },
    });

    res.json({ message: 'Activity removed from itinerary.' });
  } catch (err: any) {
    console.error('Remove activity error:', err);
    res.status(500).json({ error: 'Failed to remove activity.' });
  }
};
