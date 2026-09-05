import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

// ── OPERATOR DASHBOARD ───────────────────────────────────────────────────────
export const getOperatorDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Active tours
    const activeTrips = await prisma.trip.findMany({
      where: { status: { in: ['BOOKED', 'ACTIVE'] } },
      include: {
        user: { select: { name: true, email: true } },
        stops: { include: { city: true }, orderBy: { orderIndex: 'asc' } },
        _count: { select: { bookings: true, tripActivities: true } },
      },
      orderBy: { startDate: 'asc' },
      take: 20,
    });

    // Pending bookings
    const pendingBookings = await prisma.booking.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { name: true, email: true } },
        trip: { select: { title: true } },
        hotel: { select: { name: true } },
        transport: { select: { type: true, operatorName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Pending changes
    const pendingChanges = await prisma.itineraryChange.findMany({
      where: { status: 'pending' },
      include: {
        trip: { select: { title: true } },
        initiator: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Revenue metrics
    const allPayments = await prisma.payment.findMany({ where: { status: 'PAID' } });
    const totalRevenue = allPayments.reduce((sum, p) => sum + p.amount, 0);

    // Counts
    const [totalBookings, totalVendors, totalGroups, totalTravelers] = await Promise.all([
      prisma.booking.count(),
      prisma.vendor.count(),
      prisma.tourGroup.count(),
      prisma.user.count({ where: { role: 'TRAVELER' } }),
    ]);

    res.json({
      summary: {
        activeTripsCount: activeTrips.length,
        pendingBookingsCount: pendingBookings.length,
        pendingChangesCount: pendingChanges.length,
        totalRevenue,
        totalBookings,
        totalVendors,
        totalGroups,
        totalTravelers,
      },
      activeTrips,
      pendingBookings,
      pendingChanges,
    });
  } catch (err: any) {
    console.error('Operator dashboard error:', err);
    res.status(500).json({ error: 'Failed to load operator dashboard.' });
  }
};

// ── GET COORDINATORS ────────────────────────────────────────────────────────
export const getCoordinators = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coordinators = await prisma.user.findMany({
      where: { role: { in: ['COORDINATOR', 'OPERATOR', 'ADMIN'] } },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        coordinatorGroups: {
          include: {
            trip: { select: { title: true, startDate: true, endDate: true, status: true } },
            members: { select: { id: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ coordinators });
  } catch (err: any) {
    console.error('Get coordinators error:', err);
    res.status(500).json({ error: 'Failed to load coordinators.' });
  }
};

// ── ASSIGN COORDINATOR TO GROUP ─────────────────────────────────────────────
export const assignCoordinator = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { groupId, coordinatorId } = req.body;
    if (!groupId) {
      res.status(400).json({ error: 'groupId is required.' });
      return;
    }

    const updatedGroup = await prisma.tourGroup.update({
      where: { id: groupId },
      data: { coordinatorId: coordinatorId || null },
      include: {
        coordinator: { select: { id: true, name: true, email: true, avatarUrl: true } },
        trip: { select: { title: true } },
      },
    });

    res.json({ message: 'Coordinator assigned successfully.', group: updatedGroup });
  } catch (err: any) {
    console.error('Assign coordinator error:', err);
    res.status(500).json({ error: 'Failed to assign coordinator.' });
  }
};

// ── GET SCHEDULE / OPERATOR CALENDAR ────────────────────────────────────────
export const getOperatorSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        status: { in: ['BOOKED', 'ACTIVE', 'COMPLETED'] },
      },
      include: {
        user: { select: { name: true, email: true } },
        stops: {
          include: {
            city: true,
            hotel: { select: { name: true } },
            transportToNext: { select: { operatorName: true, type: true } },
          },
          orderBy: { orderIndex: 'asc' },
        },
        tourGroups: {
          include: {
            coordinator: { select: { name: true } },
            members: true,
          },
        },
        bookings: {
          select: {
            id: true,
            bookingType: true,
            status: true,
            totalPrice: true,
            checkIn: true,
            checkOut: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    res.json({ schedule: trips });
  } catch (err: any) {
    console.error('Get operator schedule error:', err);
    res.status(500).json({ error: 'Failed to load schedule.' });
  }
};

