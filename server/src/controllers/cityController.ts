import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

export const listCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { country, continent, minCost, maxCost, search } = req.query;

    const where: any = {};

    if (country) {
      where.country = { contains: String(country), mode: 'insensitive' };
    }
    if (continent) {
      where.continent = { equals: String(continent), mode: 'insensitive' };
    }
    if (minCost || maxCost) {
      where.costIndex = {
        gte: minCost ? Number(minCost) : 1,
        lte: maxCost ? Number(maxCost) : 5,
      };
    }
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { country: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const cities = await prisma.city.findMany({
      where,
      orderBy: { popularity: 'desc' },
      include: {
        _count: {
          select: { activities: true },
        },
      },
    });

    res.json({ cities });
  } catch (err: any) {
    console.error('List cities error:', err);
    res.status(500).json({ error: 'Failed to retrieve cities.' });
  }
};

export const getCityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { rating: 'desc' },
        },
      },
    });

    if (!city) {
      res.status(404).json({ error: 'City not found.' });
      return;
    }

    res.json({ city });
  } catch (err: any) {
    console.error('Get city details error:', err);
    res.status(500).json({ error: 'Failed to retrieve city.' });
  }
};

export const listActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cityId, category, maxCost, search } = req.query;

    const where: any = {};

    if (cityId) {
      where.cityId = String(cityId);
    }
    if (category && category !== 'all') {
      where.category = { equals: String(category), mode: 'insensitive' };
    }
    if (maxCost) {
      where.cost = { lte: Number(maxCost) };
    }
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: { rating: 'desc' },
      include: { city: true },
    });

    res.json({ activities });
  } catch (err: any) {
    console.error('List activities error:', err);
    res.status(500).json({ error: 'Failed to retrieve activities.' });
  }
};

export const toggleSaveCity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: cityId } = req.params;
    const userId = req.userId!;

    const existing = await prisma.savedDestination.findUnique({
      where: {
        userId_cityId: {
          userId,
          cityId,
        },
      },
    });

    if (existing) {
      await prisma.savedDestination.delete({
        where: { id: existing.id },
      });
      res.json({ message: 'Destination removed from wishlist.', isSaved: false });
    } else {
      await prisma.savedDestination.create({
        data: { userId, cityId },
      });
      res.json({ message: 'Destination saved to wishlist! ❤️', isSaved: true });
    }
  } catch (err: any) {
    console.error('Toggle save city error:', err);
    res.status(500).json({ error: 'Failed to update saved destination.' });
  }
};
