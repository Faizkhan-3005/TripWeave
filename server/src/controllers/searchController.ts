import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

export const globalSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, category, continent, maxCost } = req.query;
    const queryStr = q ? String(q).trim() : '';

    const cityWhere: any = {};
    if (queryStr) {
      cityWhere.OR = [
        { name: { contains: queryStr, mode: 'insensitive' } },
        { country: { contains: queryStr, mode: 'insensitive' } },
        { description: { contains: queryStr, mode: 'insensitive' } },
      ];
    }
    if (continent && continent !== 'all') {
      cityWhere.continent = { equals: String(continent), mode: 'insensitive' };
    }

    const activityWhere: any = {};
    if (queryStr) {
      activityWhere.OR = [
        { name: { contains: queryStr, mode: 'insensitive' } },
        { description: { contains: queryStr, mode: 'insensitive' } },
        { city: { name: { contains: queryStr, mode: 'insensitive' } } },
        { city: { country: { contains: queryStr, mode: 'insensitive' } } },
      ];
    }
    if (category && category !== 'all') {
      activityWhere.category = { equals: String(category), mode: 'insensitive' };
    }
    if (maxCost) {
      activityWhere.cost = { lte: Number(maxCost) };
    }

    const [cities, activities] = await Promise.all([
      prisma.city.findMany({
        where: cityWhere,
        take: 12,
        orderBy: { popularity: 'desc' },
        include: {
          _count: { select: { activities: true } },
        },
      }),
      prisma.activity.findMany({
        where: activityWhere,
        take: 20,
        orderBy: { rating: 'desc' },
        include: { city: true },
      }),
    ]);

    res.json({
      query: queryStr,
      resultsCount: cities.length + activities.length,
      cities,
      activities,
    });
  } catch (err: any) {
    console.error('Global search error:', err);
    res.status(500).json({ error: 'Search failed.' });
  }
};
