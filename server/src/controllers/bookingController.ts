import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';
import crypto from 'crypto';

// ── LIST BOOKINGS ────────────────────────────────────────────────────────────
export const listBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId, status, bookingType } = req.query;
    const isOperator = req.userRole === 'OPERATOR' || req.userRole === 'ADMIN';

    const where: any = {};
    // Operators see all bookings; travelers see only their own
    if (!isOperator) where.userId = req.userId;
    if (tripId) where.tripId = tripId;
    if (status) where.status = status;
    if (bookingType) where.bookingType = bookingType;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        trip: { select: { title: true, startDate: true, endDate: true } },
        user: { select: { name: true, email: true } },
        vendor: { select: { name: true } },
        hotel: { select: { name: true, image: true, pricePerNight: true, starRating: true } },
        transport: { select: { type: true, operatorName: true, fromCityId: true, toCityId: true } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ bookings });
  } catch (err: any) {
    console.error('List bookings error:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
};

// ── GET BOOKING ──────────────────────────────────────────────────────────────
export const getBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        trip: true, user: { select: { name: true, email: true } },
        vendor: true, hotel: true, transport: true, payments: true,
      },
    });
    if (!booking) { res.status(404).json({ error: 'Booking not found.' }); return; }
    res.json({ booking });
  } catch (err: any) {
    console.error('Get booking error:', err);
    res.status(500).json({ error: 'Failed to retrieve booking.' });
  }
};

// ── CREATE BOOKING ───────────────────────────────────────────────────────────
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId, bookingType, hotelId, transportId, activityId, vendorId, totalPrice, checkIn, checkOut, guestsCount, specialRequests } = req.body;

    if (!tripId || !bookingType || !totalPrice) {
      res.status(400).json({ error: 'tripId, bookingType, and totalPrice are required.' });
      return;
    }

    const confirmationCode = `GT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const booking = await prisma.booking.create({
      data: {
        tripId,
        userId: req.userId!,
        vendorId: vendorId || null,
        bookingType,
        hotelId: hotelId || null,
        transportId: transportId || null,
        activityId: activityId || null,
        status: 'PENDING',
        totalPrice: Number(totalPrice),
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        guestsCount: Number(guestsCount) || 1,
        specialRequests: specialRequests || null,
        confirmationCode,
      },
      include: { hotel: true, transport: true },
    });

    // Create a notification for the user
    await prisma.notification.create({
      data: {
        userId: req.userId!,
        type: 'booking',
        title: 'Booking Created',
        message: `Your ${bookingType} booking (${confirmationCode}) has been submitted and is pending confirmation.`,
        actionUrl: `/app/bookings/${booking.id}`,
      },
    });

    res.status(201).json({ message: 'Booking created successfully.', booking });
  } catch (err: any) {
    console.error('Create booking error:', err);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
};

// ── UPDATE BOOKING STATUS ────────────────────────────────────────────────────
export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (!status || !['PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status.' });
      return;
    }

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
    });

    // Notify the traveler
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        type: 'booking',
        title: `Booking ${status.charAt(0) + status.slice(1).toLowerCase()}`,
        message: `Your booking ${booking.confirmationCode || booking.id} has been ${status.toLowerCase()}.`,
        actionUrl: `/app/bookings/${booking.id}`,
      },
    });

    res.json({ message: `Booking ${status.toLowerCase()} successfully.`, booking });
  } catch (err: any) {
    console.error('Update booking status error:', err);
    res.status(500).json({ error: 'Failed to update booking.' });
  }
};

// ── DELETE BOOKING ───────────────────────────────────────────────────────────
export const deleteBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.booking.delete({ where: { id: req.params.id } });
    res.json({ message: 'Booking deleted.' });
  } catch (err: any) {
    console.error('Delete booking error:', err);
    res.status(500).json({ error: 'Failed to delete booking.' });
  }
};
