import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

export const getTripBudgetStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
      include: {
        expenses: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    const totalBudget = trip.budget;
    const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBudget = totalBudget - totalSpent;
    const percentUsed = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
    const isOverBudget = totalSpent > totalBudget;

    const durationDays = Math.max(
      1,
      Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 3600 * 24))
    );

    const dailyAverageSpent = Math.round(totalSpent / durationDays);
    const remainingDailyAllowance = durationDays > 0 ? Math.max(0, Math.round(remainingBudget / durationDays)) : 0;

    // Category breakdown
    const categoryTotals: Record<string, number> = {
      Transport: 0,
      Accommodation: 0,
      Activities: 0,
      Meals: 0,
      Other: 0,
    };

    trip.expenses.forEach((e) => {
      const cat = categoryTotals[e.category] !== undefined ? e.category : 'Other';
      categoryTotals[cat] += e.amount;
    });

    const categoryBreakdown = Object.keys(categoryTotals).map((cat) => ({
      category: cat,
      amount: categoryTotals[cat],
      percentage: totalSpent > 0 ? Math.round((categoryTotals[cat] / totalSpent) * 100) : 0,
    }));

    // Daily spending trend
    const dayMap: Record<string, number> = {};
    trip.expenses.forEach((e) => {
      const dayStr = new Date(e.date).toISOString().split('T')[0];
      dayMap[dayStr] = (dayMap[dayStr] || 0) + e.amount;
    });

    const spendingTrend = Object.keys(dayMap)
      .sort()
      .map((date) => ({
        date,
        amount: dayMap[date],
      }));

    // Find highest spending day
    let highestSpendingDay = null;
    if (spendingTrend.length > 0) {
      const sortedByAmount = [...spendingTrend].sort((a, b) => b.amount - a.amount);
      highestSpendingDay = sortedByAmount[0];
    }

    res.json({
      totalBudget,
      totalSpent,
      remainingBudget,
      percentUsed,
      isOverBudget,
      durationDays,
      dailyAverageSpent,
      remainingDailyAllowance,
      highestSpendingDay,
      categoryBreakdown,
      spendingTrend,
      expenses: trip.expenses,
    });
  } catch (err: any) {
    console.error('Get budget stats error:', err);
    res.status(500).json({ error: 'Failed to compute budget analytics.' });
  }
};

export const addExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId } = req.params;
    const { title, category, amount, date, notes, attachmentUrl, attachmentName } = req.body;

    if (!title || amount === undefined) {
      res.status(400).json({ error: 'Title and amount are required.' });
      return;
    }

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    const expense = await prisma.expense.create({
      data: {
        tripId,
        title: title.trim(),
        category: category || 'Other',
        amount: Math.abs(Number(amount)),
        date: date ? new Date(date) : new Date(),
        notes: notes?.trim() || '',
        attachmentUrl: attachmentUrl || null,
        attachmentName: attachmentName || null,
      },
    });

    res.status(201).json({ message: 'Expense added successfully.', expense });
  } catch (err: any) {
    console.error('Add expense error:', err);
    res.status(500).json({ error: 'Failed to add expense.' });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId, expenseId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    res.json({ message: 'Expense deleted successfully.' });
  } catch (err: any) {
    console.error('Delete expense error:', err);
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
};
