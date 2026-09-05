import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

export const getUserAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const trips = await prisma.trip.findMany({
      where: { userId },
      include: {
        stops: { include: { city: true } },
        tripActivities: { include: { activity: true } },
        expenses: true,
      },
    });

    const totalTrips = trips.length;
    let totalBudgetSum = 0;
    let totalSpentSum = 0;
    let totalDaysSum = 0;

    const visitedCityNames = new Set<string>();
    const visitedCountries = new Set<string>();
    const categorySpending: Record<string, number> = {
      Transport: 0,
      Accommodation: 0,
      Activities: 0,
      Meals: 0,
      Other: 0,
    };
    const activityCategoryCount: Record<string, number> = {};

    trips.forEach((t) => {
      totalBudgetSum += t.budget;
      const tripSpent = t.expenses.reduce((sum, e) => sum + e.amount, 0);
      totalSpentSum += tripSpent;

      const duration = Math.max(
        1,
        Math.ceil((new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / (1000 * 3600 * 24))
      );
      totalDaysSum += duration;

      t.stops.forEach((s) => {
        visitedCityNames.add(s.city.name);
        visitedCountries.add(s.city.country);
      });

      t.expenses.forEach((e) => {
        const cat = categorySpending[e.category] !== undefined ? e.category : 'Other';
        categorySpending[cat] += e.amount;
      });

      t.tripActivities.forEach((a) => {
        const cat = a.category || 'Sightseeing';
        activityCategoryCount[cat] = (activityCategoryCount[cat] || 0) + 1;
      });
    });

    const averageTripDuration = totalTrips > 0 ? Math.round((totalDaysSum / totalTrips) * 10) / 10 : 0;
    const averageSpendingPerTrip = totalTrips > 0 ? Math.round(totalSpentSum / totalTrips) : 0;

    // Format for Recharts
    const spendingByCategory = Object.keys(categorySpending).map((cat) => ({
      category: cat,
      amount: categorySpending[cat],
    }));

    const activitiesByCategory = Object.keys(activityCategoryCount).map((cat) => ({
      category: cat,
      count: activityCategoryCount[cat],
    }));

    const tripComparison = trips.map((t) => {
      const spent = t.expenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        name: t.title.length > 15 ? t.title.substring(0, 15) + '...' : t.title,
        budget: t.budget,
        spent,
      };
    });

    res.json({
      totalTrips,
      uniqueCitiesPlanned: visitedCityNames.size,
      uniqueCountriesPlanned: visitedCountries.size,
      totalTravelDays: totalDaysSum,
      averageTripDuration,
      totalEstimatedBudget: totalBudgetSum,
      totalSpent: totalSpentSum,
      averageSpendingPerTrip,
      spendingByCategory,
      activitiesByCategory,
      tripComparison,
    });
  } catch (err: any) {
    console.error('User analytics error:', err);
    res.status(500).json({ error: 'Failed to compute analytics.' });
  }
};
