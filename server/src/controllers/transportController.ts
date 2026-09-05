import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

// ── LIST TRANSPORT OPTIONS ───────────────────────────────────────────────────
export const listTransport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fromCityId, toCityId, type, maxPrice } = req.query;

    const where: any = {};
    if (fromCityId) where.fromCityId = fromCityId;
    if (toCityId) where.toCityId = toCityId;
    if (type) where.type = type;
    if (maxPrice) where.price = { lte: Number(maxPrice) };

    const transports = await prisma.transport.findMany({
      where,
      include: { fromCity: true, toCity: true, vendor: true },
      orderBy: { price: 'asc' },
    });

    res.json({ transports });
  } catch (err: any) {
    console.error('List transport error:', err);
    res.status(500).json({ error: 'Failed to retrieve transport options.' });
  }
};

// ── GET TRANSPORT ────────────────────────────────────────────────────────────
export const getTransport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transport = await prisma.transport.findUnique({
      where: { id: req.params.id },
      include: { fromCity: true, toCity: true, vendor: true },
    });
    if (!transport) { res.status(404).json({ error: 'Transport not found.' }); return; }
    res.json({ transport });
  } catch (err: any) {
    console.error('Get transport error:', err);
    res.status(500).json({ error: 'Failed to retrieve transport.' });
  }
};

// ── CREATE TRANSPORT (Operator) ──────────────────────────────────────────────
export const createTransport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, operatorName, vendorId, fromCityId, toCityId, price, departureTime, arrivalTime, durationHours } = req.body;
    if (!type || !operatorName || !fromCityId || !toCityId || !price) {
      res.status(400).json({ error: 'type, operatorName, fromCityId, toCityId, and price are required.' });
      return;
    }
    const transport = await prisma.transport.create({
      data: {
        type, operatorName,
        vendorId: vendorId || null,
        fromCityId, toCityId,
        price: Number(price),
        departureTime: departureTime || '08:00',
        arrivalTime: arrivalTime || '12:00',
        durationHours: Number(durationHours) || 4,
      },
      include: { fromCity: true, toCity: true },
    });
    res.status(201).json({ message: 'Transport created.', transport });
  } catch (err: any) {
    console.error('Create transport error:', err);
    res.status(500).json({ error: 'Failed to create transport.' });
  }
};

// ── UPDATE TRANSPORT ─────────────────────────────────────────────────────────
export const updateTransport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transport = await prisma.transport.update({ where: { id: req.params.id }, data: req.body });
    res.json({ message: 'Transport updated.', transport });
  } catch (err: any) {
    console.error('Update transport error:', err);
    res.status(500).json({ error: 'Failed to update transport.' });
  }
};

// ── DELETE TRANSPORT ─────────────────────────────────────────────────────────
export const deleteTransport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.transport.delete({ where: { id: req.params.id } });
    res.json({ message: 'Transport deleted.' });
  } catch (err: any) {
    console.error('Delete transport error:', err);
    res.status(500).json({ error: 'Failed to delete transport.' });
  }
};
