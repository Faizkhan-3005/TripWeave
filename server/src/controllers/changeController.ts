import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

// ── LIST CHANGES ─────────────────────────────────────────────────────────────
export const listChanges = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId, status, changeType } = req.query;
    const where: any = {};
    if (tripId) where.tripId = tripId;
    if (status) where.status = status;
    if (changeType) where.changeType = changeType;

    const changes = await prisma.itineraryChange.findMany({
      where,
      include: {
        trip: { select: { title: true } },
        initiator: { select: { name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ changes });
  } catch (err: any) {
    console.error('List changes error:', err);
    res.status(500).json({ error: 'Failed to retrieve changes.' });
  }
};

// ── CREATE CHANGE REQUEST ────────────────────────────────────────────────────
export const createChange = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId, changeType, description, oldValue, newValue, reason } = req.body;
    if (!tripId || !changeType || !description) {
      res.status(400).json({ error: 'tripId, changeType, and description are required.' });
      return;
    }

    // Compute impact (simplified — Phase 4 will add real Gemini-powered impact analysis)
    let impact = '{}';
    if (changeType === 'cancellation') {
      impact = JSON.stringify({
        affectedItems: 'Subsequent activities may need rescheduling',
        costImpact: 'Potential refund required',
        severity: 'medium',
      });
    } else if (changeType === 'reschedule') {
      impact = JSON.stringify({
        affectedItems: 'Transport connections and hotel dates may shift',
        costImpact: 'Possible price difference',
        severity: 'low',
      });
    } else if (changeType === 'weather') {
      impact = JSON.stringify({
        affectedItems: 'Outdoor activities on affected dates',
        costImpact: 'Alternative indoor activities may differ in cost',
        severity: 'low',
      });
    }

    const change = await prisma.itineraryChange.create({
      data: {
        tripId,
        changeType,
        description,
        oldValue: oldValue || null,
        newValue: newValue || null,
        reason: reason || null,
        impact,
        status: 'pending',
        initiatedBy: req.userId!,
      },
      include: { trip: true, initiator: { select: { name: true } } },
    });

    // Notify trip owner if change was initiated by someone else
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (trip && trip.userId !== req.userId) {
      await prisma.notification.create({
        data: {
          userId: trip.userId,
          type: 'change',
          title: 'Itinerary Change Requested',
          message: `A ${changeType} change has been requested for "${trip.title}": ${description}`,
          actionUrl: `/operator/changes`,
        },
      });
    }

    res.status(201).json({ message: 'Change request created.', change });
  } catch (err: any) {
    console.error('Create change error:', err);
    res.status(500).json({ error: 'Failed to create change request.' });
  }
};

// ── RESOLVE CHANGE (approve/reject) ──────────────────────────────────────────
export const resolveChange = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body; // approved | rejected
    if (!status || !['approved', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'Status must be "approved" or "rejected".' });
      return;
    }

    const change = await prisma.itineraryChange.update({
      where: { id: req.params.id },
      data: {
        status,
        resolvedBy: req.userId,
        resolvedAt: new Date(),
      },
    });

    // Notify the initiator
    await prisma.notification.create({
      data: {
        userId: change.initiatedBy,
        type: 'change',
        title: `Change ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your ${change.changeType} change request has been ${status}.`,
        actionUrl: `/app/trips/${change.tripId}/builder`,
      },
    });

    res.json({ message: `Change ${status}.`, change });
  } catch (err: any) {
    console.error('Resolve change error:', err);
    res.status(500).json({ error: 'Failed to resolve change.' });
  }
};
