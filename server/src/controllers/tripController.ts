import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';
import { generateTripCSV } from '../services/csvService.js';

export const listTrips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.userId },
      orderBy: { startDate: 'asc' },
      include: {
        stops: {
          orderBy: { orderIndex: 'asc' },
          include: { city: true },
        },
        _count: {
          select: {
            tripActivities: true,
            expenses: true,
          },
        },
        expenses: {
          select: { amount: true },
        },
      },
    });

    const formatted = trips.map((t) => {
      const totalSpent = t.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const remainingBudget = t.budget - totalSpent;
      const durationDays = Math.max(
        1,
        Math.ceil((new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / (1000 * 3600 * 24))
      );

      return {
        id: t.id,
        title: t.title,
        description: t.description,
        coverImage: t.coverImage,
        startDate: t.startDate,
        endDate: t.endDate,
        durationDays,
        budget: t.budget,
        currency: t.currency,
        shareSlug: t.shareSlug,
        isPublic: t.isPublic,
        stopsCount: t.stops.length,
        activitiesCount: t._count.tripActivities,
        totalSpent,
        remainingBudget,
        cities: t.stops.map((s) => s.city.name),
        stops: t.stops,
      };
    });

    res.json({ trips: formatted });
  } catch (err: any) {
    console.error('List trips error:', err);
    res.status(500).json({ error: 'Failed to retrieve trips.' });
  }
};

export const createTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, coverImage, startDate, endDate, budget, currency, cityIds } = req.body;

    if (!title || !startDate || !endDate) {
      res.status(400).json({ error: 'Title, start date, and end date are required.' });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      res.status(400).json({ error: 'End date cannot be before start date.' });
      return;
    }

    // Default image if none provided
    let finalCover = coverImage;
    if (!finalCover && cityIds && cityIds.length > 0) {
      const firstCity = await prisma.city.findUnique({ where: { id: cityIds[0] } });
      if (firstCity) finalCover = firstCity.image;
    }
    if (!finalCover) {
      finalCover = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
    }

    // Prepare stops creation
    const stopsData = (cityIds || []).map((cId: string, idx: number) => ({
      cityId: cId,
      orderIndex: idx,
    }));

    const trip = await prisma.trip.create({
      data: {
        userId: req.userId!,
        title: title.trim(),
        description: description?.trim() || '',
        coverImage: finalCover,
        startDate: start,
        endDate: end,
        budget: Number(budget) || 0,
        currency: currency || 'USD',
        stops: {
          create: stopsData,
        },
      },
      include: {
        stops: {
          include: { city: true },
        },
      },
    });

    res.status(201).json({ message: 'Trip created successfully.', trip });
  } catch (err: any) {
    console.error('Create trip error:', err);
    res.status(500).json({ error: 'Failed to create trip.' });
  }
};

export const getTripDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id, userId: req.userId },
      include: {
        stops: {
          orderBy: { orderIndex: 'asc' },
          include: {
            city: {
              include: { activities: true },
            },
          },
        },
        tripActivities: {
          orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }],
          include: {
            activity: true,
            tripStop: { include: { city: true } },
          },
        },
        expenses: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
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
        remainingBudget: trip.budget - totalSpent,
      },
    });
  } catch (err: any) {
    console.error('Get trip details error:', err);
    res.status(500).json({ error: 'Failed to load trip.' });
  }
};

export const updateTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, coverImage, startDate, endDate, budget, currency, isPublic } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id, userId: req.userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        coverImage: coverImage !== undefined ? coverImage : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        budget: budget !== undefined ? Number(budget) : undefined,
        currency: currency !== undefined ? currency : undefined,
        isPublic: isPublic !== undefined ? Boolean(isPublic) : undefined,
      },
    });

    res.json({ message: 'Trip updated successfully.', trip: updated });
  } catch (err: any) {
    console.error('Update trip error:', err);
    res.status(500).json({ error: 'Failed to update trip.' });
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id, userId: req.userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    await prisma.trip.delete({ where: { id } });

    res.json({ message: 'Trip deleted successfully.' });
  } catch (err: any) {
    console.error('Delete trip error:', err);
    res.status(500).json({ error: 'Failed to delete trip.' });
  }
};

export const exportTripCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id, userId: req.userId },
      include: {
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
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    const csvContent = generateTripCSV(trip);
    const filename = `Tripweave_${trip.title.replace(/[^a-z0-9]/gi, '_')}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (err: any) {
    console.error('Export trip CSV error:', err);
    res.status(500).json({ error: 'Failed to export CSV.' });
  }
};
