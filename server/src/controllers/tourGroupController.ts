import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

// ── LIST TOUR GROUPS ─────────────────────────────────────────────────────────
export const listTourGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId, status } = req.query;
    const where: any = {};
    if (tripId) where.tripId = tripId;
    if (status) where.status = status;

    const groups = await prisma.tourGroup.findMany({
      where,
      include: {
        trip: { select: { title: true, startDate: true, endDate: true } },
        coordinator: { select: { id: true, name: true, email: true, avatarUrl: true } },
        members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ groups });
  } catch (err: any) {
    console.error('List tour groups error:', err);
    res.status(500).json({ error: 'Failed to retrieve tour groups.' });
  }
};

// ── CREATE TOUR GROUP ────────────────────────────────────────────────────────
export const createTourGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, tripId, coordinatorId, maxSize } = req.body;
    if (!name || !tripId) {
      res.status(400).json({ error: 'Name and tripId are required.' });
      return;
    }
    const group = await prisma.tourGroup.create({
      data: {
        name, tripId,
        coordinatorId: coordinatorId || null,
        maxSize: Number(maxSize) || 20,
      },
      include: { trip: true, coordinator: true },
    });
    res.status(201).json({ message: 'Tour group created.', group });
  } catch (err: any) {
    console.error('Create tour group error:', err);
    res.status(500).json({ error: 'Failed to create tour group.' });
  }
};

// ── ADD MEMBER TO GROUP ──────────────────────────────────────────────────────
export const addGroupMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { groupId } = req.params;
    const { userId, role } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'userId is required.' });
      return;
    }

    const group = await prisma.tourGroup.findUnique({ where: { id: groupId }, include: { members: true } });
    if (!group) { res.status(404).json({ error: 'Tour group not found.' }); return; }
    if (group.members.length >= group.maxSize) {
      res.status(400).json({ error: 'Tour group is at maximum capacity.' });
      return;
    }

    const member = await prisma.tourGroupMember.create({
      data: { tourGroupId: groupId, userId, role: role || 'member' },
      include: { user: { select: { name: true, email: true } } },
    });

    // Notify the added member
    await prisma.notification.create({
      data: {
        userId,
        type: 'system',
        title: 'Added to Tour Group',
        message: `You have been added to the tour group "${group.name}".`,
      },
    });

    res.status(201).json({ message: 'Member added.', member });
  } catch (err: any) {
    console.error('Add group member error:', err);
    res.status(500).json({ error: 'Failed to add member.' });
  }
};

// ── REMOVE MEMBER FROM GROUP ─────────────────────────────────────────────────
export const removeGroupMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { groupId, memberId } = req.params;
    await prisma.tourGroupMember.delete({ where: { id: memberId } });
    res.json({ message: 'Member removed from group.' });
  } catch (err: any) {
    console.error('Remove group member error:', err);
    res.status(500).json({ error: 'Failed to remove member.' });
  }
};

// ── UPDATE TOUR GROUP ────────────────────────────────────────────────────────
export const updateTourGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const group = await prisma.tourGroup.update({ where: { id: req.params.id }, data: req.body });
    res.json({ message: 'Tour group updated.', group });
  } catch (err: any) {
    console.error('Update tour group error:', err);
    res.status(500).json({ error: 'Failed to update tour group.' });
  }
};

// ── DELETE TOUR GROUP ────────────────────────────────────────────────────────
export const deleteTourGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.tourGroup.delete({ where: { id: req.params.id } });
    res.json({ message: 'Tour group deleted.' });
  } catch (err: any) {
    console.error('Delete tour group error:', err);
    res.status(500).json({ error: 'Failed to delete tour group.' });
  }
};
