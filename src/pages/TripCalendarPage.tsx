import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, Clock, MapPin, DollarSign, 
  ArrowLeft, ChevronLeft, ChevronRight, Tag, CheckCircle2, ArrowRight
} from 'lucide-react';
import { TripModel, TripActivityModel } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const TripCalendarPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<TripModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    if (tripId) {
      loadTrip(tripId);
    }
  }, [tripId]);

  const loadTrip = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.trips.get(id);
      setTrip(res.trip);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load calendar.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !trip) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const duration = trip.durationDays || 7;
  const daysArray = Array.from({ length: duration }, (_, i) => i + 1);

  const getDayDate = (dayIndex: number) => {
    const start = new Date(trip.startDate);
    start.setDate(start.getDate() + (dayIndex - 1));
    return start.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to={`/app/trips/${trip.id}/builder`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary Builder
          </Link>
          <h1 className="text-3xl font-black text-black tracking-tight font-sans">
            Itinerary Schedule &amp; Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[#5c5d6e] mt-0.5">
            {trip.title} &bull; {duration} Days timeline view
          </p>
        </div>

        <Link
          to={`/app/trips/${trip.id}/builder`}
          className="bg-black text-white hover:bg-neutral-800 px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all w-fit"
        >
          <span>Edit in Builder</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Calendar Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysArray.map((dayNum) => {
          const acts = (trip.tripActivities || [])
            .filter((a) => a.dayNumber === dayNum)
            .sort((a, b) => (a.scheduledTime || '').localeCompare(b.scheduledTime || ''));

          return (
            <div
              key={dayNum}
              className="bg-white rounded-[32px] p-6 border border-[#e5e5ea] shadow-xs flex flex-col justify-between hover:border-black transition-colors"
            >
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-black text-white font-extrabold text-xs flex items-center justify-center">
                      {dayNum}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-black">Day {dayNum}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold">{getDayDate(dayNum)}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">
                    {acts.length} {acts.length === 1 ? 'event' : 'events'}
                  </span>
                </div>

                {/* Scheduled Items */}
                {acts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No activities scheduled
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {acts.map((act) => (
                      <div
                        key={act.id}
                        className="bg-[#f9f9fb] p-3 rounded-2xl border border-gray-150 flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[9px] font-bold text-gray-600 bg-white px-2 py-0.5 rounded flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> {act.scheduledTime || '10:00'}
                            </span>
                            <span className="text-[9px] font-bold text-gray-500">
                              {act.category}
                            </span>
                          </div>
                          <h5 className="font-extrabold text-xs text-black leading-tight truncate">
                            {act.customTitle || act.activity?.name}
                          </h5>
                          {act.tripStop?.city && (
                            <p className="text-[10px] text-blue-600 font-medium mt-0.5">
                              {act.tripStop.city.name}
                            </p>
                          )}
                        </div>

                        <span className="text-[11px] font-bold text-black shrink-0">
                          ${act.estimatedCost || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Day Bottom Link */}
              <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end">
                <Link
                  to={`/app/trips/${trip.id}/builder`}
                  className="text-[11px] font-bold text-black hover:underline"
                >
                  + Add activity &rarr;
                </Link>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
