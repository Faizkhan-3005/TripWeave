import { Router } from 'express';
import { listTrips, createTrip, getTripDetails, updateTrip, deleteTrip, exportTripCSV, completeTrip } from '../controllers/tripController.js';
import { addStop, reorderStops, removeStop, updateStop } from '../controllers/stopController.js';
import { addActivity, updateActivity, reorderActivities, removeActivity } from '../controllers/activityController.js';
import { getTripBudgetStats, addExpense, deleteExpense } from '../controllers/budgetController.js';
import { listPackingItems, createPackingItem, updatePackingItem, deletePackingItem, applyPackingTemplate } from '../controllers/packingController.js';
import { suggestAiItinerary, applyAiSuggestions } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';

export const tripRouter = Router();

tripRouter.use(authenticateToken);

// Trip Base CRUD & Export
tripRouter.get('/', listTrips);
tripRouter.post('/', createTrip);
tripRouter.get('/:id', getTripDetails);
tripRouter.put('/:id', updateTrip);
tripRouter.put('/:id/complete', completeTrip);
tripRouter.delete('/:id', deleteTrip);
tripRouter.get('/:id/export-csv', exportTripCSV);

// AI Itinerary Assistant
tripRouter.get('/:id/ai-suggest', suggestAiItinerary);
tripRouter.post('/:id/ai-apply', applyAiSuggestions);

// Trip Stops
tripRouter.post('/:id/stops', addStop);
tripRouter.put('/:id/stops/reorder', reorderStops);
tripRouter.put('/:id/stops/:stopId', updateStop);
tripRouter.delete('/:id/stops/:stopId', removeStop);

// Trip Activities & Itinerary
tripRouter.post('/:id/activities', addActivity);
tripRouter.put('/:id/activities/reorder', reorderActivities);
tripRouter.put('/:id/activities/:activityId', updateActivity);
tripRouter.delete('/:id/activities/:activityId', removeActivity);

// Trip Budget & Expenses
tripRouter.get('/:id/expenses', getTripBudgetStats);
tripRouter.post('/:id/expenses', addExpense);
tripRouter.delete('/:id/expenses/:expenseId', deleteExpense);

// Packing Checklist
tripRouter.get('/:tripId/packing', listPackingItems);
tripRouter.post('/:tripId/packing', createPackingItem);
tripRouter.put('/:tripId/packing/:itemId', updatePackingItem);
tripRouter.delete('/:tripId/packing/:itemId', deletePackingItem);
tripRouter.post('/:tripId/packing/template', applyPackingTemplate);
