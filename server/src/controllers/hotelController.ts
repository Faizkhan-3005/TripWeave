import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

// ── LIST HOTELS ──────────────────────────────────────────────────────────────
export const listHotels = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { cityId, minPrice, maxPrice, minStars, search } = req.query;

    const where: any = {};
    if (cityId) where.cityId = cityId;
    if (minStars) where.starRating = { gte: Number(minStars) };
    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) where.pricePerNight.gte = Number(minPrice);
      if (maxPrice) where.pricePerNight.lte = Number(maxPrice);
    }
    if (search) where.name = { contains: search as string, mode: 'insensitive' };

    const hotels = await prisma.hotel.findMany({
      where,
      include: { city: true, vendor: true },
      orderBy: { pricePerNight: 'asc' },
    });

    res.json({ hotels });
  } catch (err: any) {
    console.error('List hotels error:', err);
    res.status(500).json({ error: 'Failed to retrieve hotels.' });
  }
};

// ── GET HOTEL ────────────────────────────────────────────────────────────────
export const getHotel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: req.params.id },
      include: { city: true, vendor: true },
    });
    if (!hotel) { res.status(404).json({ error: 'Hotel not found.' }); return; }
    res.json({ hotel });
  } catch (err: any) {
    console.error('Get hotel error:', err);
    res.status(500).json({ error: 'Failed to retrieve hotel.' });
  }
};

// ── CREATE HOTEL (Operator) ──────────────────────────────────────────────────
export const createHotel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, cityId, vendorId, starRating, pricePerNight, amenities, address, image, description, latitude, longitude } = req.body;
    if (!name || !cityId || !pricePerNight) {
      res.status(400).json({ error: 'Name, cityId, and pricePerNight are required.' });
      return;
    }
    const hotel = await prisma.hotel.create({
      data: {
        name, cityId, vendorId: vendorId || null,
        starRating: Number(starRating) || 3,
        pricePerNight: Number(pricePerNight),
        amenities: amenities || [],
        address, image, description,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
      },
      include: { city: true },
    });
    res.status(201).json({ message: 'Hotel created.', hotel });
  } catch (err: any) {
    console.error('Create hotel error:', err);
    res.status(500).json({ error: 'Failed to create hotel.' });
  }
};

// ── UPDATE HOTEL ─────────────────────────────────────────────────────────────
export const updateHotel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hotel = await prisma.hotel.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ message: 'Hotel updated.', hotel });
  } catch (err: any) {
    console.error('Update hotel error:', err);
    res.status(500).json({ error: 'Failed to update hotel.' });
  }
};

// ── DELETE HOTEL ─────────────────────────────────────────────────────────────
export const deleteHotel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.hotel.delete({ where: { id: req.params.id } });
    res.json({ message: 'Hotel deleted.' });
  } catch (err: any) {
    console.error('Delete hotel error:', err);
    res.status(500).json({ error: 'Failed to delete hotel.' });
  }
};
