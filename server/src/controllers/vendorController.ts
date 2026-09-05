import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

// ── LIST VENDORS ─────────────────────────────────────────────────────────────
export const listVendors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, search, verified } = req.query;
    const where: any = {};
    if (type) where.type = type;
    if (verified === 'true') where.isVerified = true;
    if (search) where.name = { contains: search as string, mode: 'insensitive' };

    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        _count: { select: { hotels: true, transports: true, activities: true, bookings: true } },
      },
      orderBy: { rating: 'desc' },
    });
    res.json({ vendors });
  } catch (err: any) {
    console.error('List vendors error:', err);
    res.status(500).json({ error: 'Failed to retrieve vendors.' });
  }
};

// ── GET VENDOR ───────────────────────────────────────────────────────────────
export const getVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.id },
      include: { hotels: true, transports: true, activities: true },
    });
    if (!vendor) { res.status(404).json({ error: 'Vendor not found.' }); return; }
    res.json({ vendor });
  } catch (err: any) {
    console.error('Get vendor error:', err);
    res.status(500).json({ error: 'Failed to retrieve vendor.' });
  }
};

// ── CREATE VENDOR ────────────────────────────────────────────────────────────
export const createVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, type, email, phone, website, logo } = req.body;
    if (!name || !type) {
      res.status(400).json({ error: 'Name and type are required.' });
      return;
    }
    const vendor = await prisma.vendor.create({
      data: { name, type, email, phone, website, logo },
    });
    res.status(201).json({ message: 'Vendor created.', vendor });
  } catch (err: any) {
    console.error('Create vendor error:', err);
    res.status(500).json({ error: 'Failed to create vendor.' });
  }
};

// ── UPDATE VENDOR ────────────────────────────────────────────────────────────
export const updateVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendor = await prisma.vendor.update({ where: { id: req.params.id }, data: req.body });
    res.json({ message: 'Vendor updated.', vendor });
  } catch (err: any) {
    console.error('Update vendor error:', err);
    res.status(500).json({ error: 'Failed to update vendor.' });
  }
};

// ── DELETE VENDOR ────────────────────────────────────────────────────────────
export const deleteVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.vendor.delete({ where: { id: req.params.id } });
    res.json({ message: 'Vendor deleted.' });
  } catch (err: any) {
    console.error('Delete vendor error:', err);
    res.status(500).json({ error: 'Failed to delete vendor.' });
  }
};
