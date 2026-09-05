import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

export const addStop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId } = req.params;
    const { cityId, arrivalDate, departureDate, notes } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
      include: { stops: true },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    const orderIndex = trip.stops.length;
    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId,
        orderIndex,
        arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
        departureDate: departureDate ? new Date(departureDate) : null,
        notes: notes?.trim() || '',
      },
      include: {
        city: {
          include: { activities: true },
        },
      },
    });

    res.status(201).json({ message: 'Stop added successfully.', stop });
  } catch (err: any) {
    console.error('Add stop error:', err);
    res.status(500).json({ error: 'Failed to add stop.' });
  }
};

export const reorderStops = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId } = req.params;
    const { stops } = req.body; // Array of { stopId, orderIndex }

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    if (!Array.isArray(stops)) {
      res.status(400).json({ error: 'Stops array is required.' });
      return;
    }

    // Update orders in transaction
    await prisma.$transaction(
      stops.map((s: { stopId: string; orderIndex: number }) =>
        prisma.tripStop.update({
          where: { id: s.stopId },
          data: { orderIndex: s.orderIndex },
        })
      )
    );

    const updatedStops = await prisma.tripStop.findMany({
      where: { tripId },
      orderBy: { orderIndex: 'asc' },
      include: { city: true },
    });

    res.json({ message: 'Stops reordered successfully.', stops: updatedStops });
  } catch (err: any) {
    console.error('Reorder stops error:', err);
    res.status(500).json({ error: 'Failed to reorder stops.' });
  }
};

export const removeStop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId, stopId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    await prisma.tripStop.delete({
      where: { id: stopId },
    });

    // Re-index remaining stops
    const remaining = await prisma.tripStop.findMany({
      where: { tripId },
      orderBy: { orderIndex: 'asc' },
    });

    await prisma.$transaction(
      remaining.map((s, idx) =>
        prisma.tripStop.update({
          where: { id: s.id },
          data: { orderIndex: idx },
        })
      )
    );

    res.json({ message: 'Stop removed successfully.' });
  } catch (err: any) {
    console.error('Remove stop error:', err);
    res.status(500).json({ error: 'Failed to remove stop.' });
  }
};

export const updateStop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId, stopId } = req.params;
    const { hotelId, transportToNextId, arrivalDate, departureDate, notes } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    const data: any = {};
    if (hotelId !== undefined) data.hotelId = hotelId;
    if (transportToNextId !== undefined) data.transportToNextId = transportToNextId;
    if (arrivalDate !== undefined) data.arrivalDate = arrivalDate ? new Date(arrivalDate) : null;
    if (departureDate !== undefined) data.departureDate = departureDate ? new Date(departureDate) : null;
    if (notes !== undefined) data.notes = notes;

    const updated = await prisma.tripStop.update({
      where: { id: stopId },
      data,
      include: {
        city: true,
        hotel: { include: { vendor: true } },
        transportToNext: { include: { fromCity: true, toCity: true, vendor: true } },
      },
    });

    res.json({ message: 'Stop updated successfully.', stop: updated });
  } catch (err: any) {
    console.error('Update stop error:', err);
    res.status(500).json({ error: 'Failed to update stop.' });
  }
};
