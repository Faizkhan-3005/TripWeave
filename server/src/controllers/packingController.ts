import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

// Preset templates for quick packing list population
const PACKING_TEMPLATES: { label: string; category: string }[] = [
  // Documents
  { label: 'Passport', category: 'Documents' },
  { label: 'Travel Insurance', category: 'Documents' },
  { label: 'Flight Tickets', category: 'Documents' },
  { label: 'Hotel Booking Confirmation', category: 'Documents' },
  { label: 'Visa / Entry Permit', category: 'Documents' },
  { label: 'Driver\'s License', category: 'Documents' },
  { label: 'Emergency Contacts List', category: 'Documents' },
  // Clothing
  { label: 'T-Shirts (x5)', category: 'Clothing' },
  { label: 'Underwear & Socks (x7)', category: 'Clothing' },
  { label: 'Jeans / Trousers', category: 'Clothing' },
  { label: 'Comfortable Walking Shoes', category: 'Clothing' },
  { label: 'Light Jacket / Windbreaker', category: 'Clothing' },
  { label: 'Formal Outfit', category: 'Clothing' },
  { label: 'Sleepwear', category: 'Clothing' },
  { label: 'Swimwear', category: 'Clothing' },
  { label: 'Sunglasses', category: 'Clothing' },
  { label: 'Hat / Cap', category: 'Clothing' },
  // Electronics
  { label: 'Phone Charger', category: 'Electronics' },
  { label: 'Power Bank', category: 'Electronics' },
  { label: 'Universal Travel Adapter', category: 'Electronics' },
  { label: 'Earphones / Headphones', category: 'Electronics' },
  { label: 'Laptop / Tablet', category: 'Electronics' },
  { label: 'Camera', category: 'Electronics' },
  { label: 'Memory Cards', category: 'Electronics' },
  // Health & Safety
  { label: 'Prescription Medications', category: 'Health' },
  { label: 'Pain Reliever (Paracetamol)', category: 'Health' },
  { label: 'Antidiarrheal Tablets', category: 'Health' },
  { label: 'Sunscreen SPF 50+', category: 'Health' },
  { label: 'Insect Repellent', category: 'Health' },
  { label: 'Hand Sanitizer', category: 'Health' },
  { label: 'Face Masks', category: 'Health' },
  { label: 'First Aid Kit', category: 'Health' },
  // Toiletries
  { label: 'Toothbrush & Toothpaste', category: 'Toiletries' },
  { label: 'Shampoo & Conditioner', category: 'Toiletries' },
  { label: 'Deodorant', category: 'Toiletries' },
  { label: 'Razor & Shaving Cream', category: 'Toiletries' },
  { label: 'Moisturizer', category: 'Toiletries' },
  // General
  { label: 'Reusable Water Bottle', category: 'General' },
  { label: 'Travel Pillow', category: 'General' },
  { label: 'Snacks for Journey', category: 'General' },
  { label: 'Travel Locks', category: 'General' },
];

export const listPackingItems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;

    // Verify ownership
    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.userId } });
    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    const items = await prisma.packingItem.findMany({
      where: { tripId },
      orderBy: [{ category: 'asc' }, { createdAt: 'asc' }],
    });
    res.json({ items });
  } catch (err: any) {
    console.error('List packing items error:', err);
    res.status(500).json({ error: 'Failed to load packing list.' });
  }
};

export const createPackingItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;
    const { label, category } = req.body;

    if (!label?.trim()) {
      res.status(400).json({ error: 'Item label is required.' });
      return;
    }

    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.userId } });
    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    const item = await prisma.packingItem.create({
      data: { tripId, label: label.trim(), category: category || 'General' },
    });
    res.status(201).json({ item });
  } catch (err: any) {
    console.error('Create packing item error:', err);
    res.status(500).json({ error: 'Failed to create packing item.' });
  }
};

export const updatePackingItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId, itemId } = req.params;
    const { isPacked, label, category } = req.body;

    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.userId } });
    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    const item = await prisma.packingItem.updateMany({
      where: { id: itemId, tripId },
      data: {
        ...(isPacked !== undefined && { isPacked }),
        ...(label && { label: label.trim() }),
        ...(category && { category }),
      },
    });
    res.json({ updated: item.count });
  } catch (err: any) {
    console.error('Update packing item error:', err);
    res.status(500).json({ error: 'Failed to update packing item.' });
  }
};

export const deletePackingItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId, itemId } = req.params;

    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.userId } });
    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    await prisma.packingItem.deleteMany({ where: { id: itemId, tripId } });
    res.json({ success: true });
  } catch (err: any) {
    console.error('Delete packing item error:', err);
    res.status(500).json({ error: 'Failed to delete packing item.' });
  }
};

export const applyPackingTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;

    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.userId } });
    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    // Delete existing items to avoid duplicates, then re-insert template
    await prisma.packingItem.deleteMany({ where: { tripId } });
    await prisma.packingItem.createMany({
      data: PACKING_TEMPLATES.map((t) => ({ ...t, tripId })),
    });

    const items = await prisma.packingItem.findMany({
      where: { tripId },
      orderBy: [{ category: 'asc' }, { createdAt: 'asc' }],
    });
    res.json({ items, message: `Loaded ${items.length} items from travel template.` });
  } catch (err: any) {
    console.error('Apply template error:', err);
    res.status(500).json({ error: 'Failed to apply template.' });
  }
};
