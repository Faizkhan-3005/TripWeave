import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

export const suggestAiItinerary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
      include: {
        stops: {
          orderBy: { orderIndex: 'asc' },
          include: {
            city: {
              include: {
                activities: true,
              },
            },
          },
        },
        tripActivities: true,
      },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    const durationDays = Math.max(
      1,
      Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 3600 * 24))
    );

    const existingActivityIds = new Set(
      trip.tripActivities.map((a) => a.activityId).filter(Boolean)
    );

    const suggestions: Array<{
      dayNumber: number;
      scheduledTime: string;
      title: string;
      category: string;
      estimatedCost: number;
      cityName: string;
      tripStopId?: string;
      activityId?: string;
      reason: string;
    }> = [];

    const defaultTimes = ['09:30', '14:00', '19:00'];

    // Map each day to a stop
    for (let day = 1; day <= durationDays; day++) {
      let targetStop = trip.stops[0];
      if (trip.stops.length > 1) {
        const stopIndex = Math.min(
          trip.stops.length - 1,
          Math.floor(((day - 1) / durationDays) * trip.stops.length)
        );
        targetStop = trip.stops[stopIndex];
      }

      if (targetStop && targetStop.city) {
        const cityActs = targetStop.city.activities || [];
        const unassignedActs = cityActs.filter((a) => !existingActivityIds.has(a.id));
        const pool = unassignedActs.length > 0 ? unassignedActs : cityActs;

        if (pool.length > 0) {
          // Suggest 2 activities for this day
          const act1 = pool[(day * 2 - 2) % pool.length];
          const act2 = pool[(day * 2 - 1) % pool.length];

          suggestions.push({
            dayNumber: day,
            scheduledTime: defaultTimes[0],
            title: act1.name,
            category: act1.category,
            estimatedCost: act1.cost,
            cityName: targetStop.city.name,
            tripStopId: targetStop.id,
            activityId: act1.id,
            reason: `Top-rated ${act1.category.toLowerCase()} experience in ${targetStop.city.name}`,
          });

          if (act2 && act2.id !== act1.id) {
            suggestions.push({
              dayNumber: day,
              scheduledTime: defaultTimes[1],
              title: act2.name,
              category: act2.category,
              estimatedCost: act2.cost,
              cityName: targetStop.city.name,
              tripStopId: targetStop.id,
              activityId: act2.id,
              reason: `Recommended afternoon exploration in ${targetStop.city.name}`,
            });
          }
        }
      } else {
        // Fallback generic suggestion if trip has no specific stops attached
        suggestions.push({
          dayNumber: day,
          scheduledTime: defaultTimes[0],
          title: `Day ${day} Scenic Walking & Discovery Tour`,
          category: 'Sightseeing',
          estimatedCost: 35,
          cityName: trip.title,
          reason: 'Curated historic landmark discovery',
        });
        suggestions.push({
          dayNumber: day,
          scheduledTime: defaultTimes[2],
          title: `Evening Culinary Dining Experience`,
          category: 'Food',
          estimatedCost: 55,
          cityName: trip.title,
          reason: 'Authentic local regional gastronomy',
        });
      }
    }

    res.json({
      tripTitle: trip.title,
      durationDays,
      totalSuggested: suggestions.length,
      suggestions,
    });
  } catch (err: any) {
    console.error('AI Suggest Itinerary error:', err);
    res.status(500).json({ error: 'Failed to generate AI itinerary suggestions.' });
  }
};

export const applyAiSuggestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: tripId } = req.params;
    const { suggestions } = req.body;

    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      res.status(400).json({ error: 'No suggestions provided to apply.' });
      return;
    }

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found.' });
      return;
    }

    // Insert all selected suggestions
    const created = await Promise.all(
      suggestions.map(async (s: any, idx: number) => {
        return prisma.tripActivity.create({
          data: {
            tripId,
            tripStopId: s.tripStopId || null,
            activityId: s.activityId || null,
            customTitle: s.title,
            dayNumber: Number(s.dayNumber) || 1,
            scheduledTime: s.scheduledTime || '10:00',
            estimatedCost: Number(s.estimatedCost) || 0,
            category: s.category || 'Sightseeing',
            orderIndex: idx,
            notes: s.reason ? `AI Suggestion: ${s.reason}` : '',
          },
        });
      })
    );

    res.status(201).json({
      message: `Successfully added ${created.length} AI suggested activities to your itinerary!`,
      count: created.length,
    });
  } catch (err: any) {
    console.error('Apply AI suggestions error:', err);
    res.status(500).json({ error: 'Failed to apply AI suggestions.' });
  }
};

// ── CONVERSATIONAL TRAVEL CONCIERGE (PREBUILT CURATED ENGINE) ────────────────
export const chatWithAi = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId, userMessage } = req.body;
    let tripTitle = 'Your Tour Itinerary';

    if (tripId) {
      const trip = await prisma.trip.findUnique({ where: { id: tripId }, select: { title: true } });
      if (trip?.title) tripTitle = trip.title;
    }

    const { getCuratedAnswer } = await import('../services/curatedTravelEngine.js');
    const reply = getCuratedAnswer(userMessage || 'Hello', tripTitle);

    res.json({ reply });
  } catch (err: any) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Failed to generate response.' });
  }
};

