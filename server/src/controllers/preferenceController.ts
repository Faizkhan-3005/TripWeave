import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

// ── GET PREFERENCES ──────────────────────────────────────────────────────────
export const getPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let prefs = await prisma.travelerPreference.findUnique({ where: { userId: req.userId } });
    if (!prefs) {
      // Return empty defaults
      res.json({
        preferences: {
          userId: req.userId,
          travelStyles: [],
          accommodationType: null,
          budgetRange: null,
          dietaryRequirements: null,
          mobilityNeeds: null,
          preferredTransport: [],
          interests: [],
          climatePreference: null,
        },
      });
      return;
    }
    res.json({ preferences: prefs });
  } catch (err: any) {
    console.error('Get preferences error:', err);
    res.status(500).json({ error: 'Failed to retrieve preferences.' });
  }
};

// ── SAVE / UPDATE PREFERENCES ────────────────────────────────────────────────
export const savePreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { travelStyles, accommodationType, budgetRange, dietaryRequirements, mobilityNeeds, preferredTransport, interests, climatePreference } = req.body;

    const prefs = await prisma.travelerPreference.upsert({
      where: { userId: req.userId },
      update: {
        travelStyles: travelStyles || [],
        accommodationType,
        budgetRange,
        dietaryRequirements,
        mobilityNeeds,
        preferredTransport: preferredTransport || [],
        interests: interests || [],
        climatePreference,
      },
      create: {
        userId: req.userId!,
        travelStyles: travelStyles || [],
        accommodationType,
        budgetRange,
        dietaryRequirements,
        mobilityNeeds,
        preferredTransport: preferredTransport || [],
        interests: interests || [],
        climatePreference,
      },
    });
    res.json({ message: 'Preferences saved.', preferences: prefs });
  } catch (err: any) {
    console.error('Save preferences error:', err);
    res.status(500).json({ error: 'Failed to save preferences.' });
  }
};
