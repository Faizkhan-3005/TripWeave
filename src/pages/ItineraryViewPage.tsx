import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, DollarSign,
  ArrowLeft, ArrowRight, List, LayoutGrid,
  Tag, CheckCircle2, Compass, ChevronDown, ChevronUp
} from 'lucide-react';
import { TripModel, TripActivityModel } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';

type ViewMode = 'list' | 'calendar';

export const ItineraryViewPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<TripModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    if (tripId) loadTrip(tripId);
  }, [tripId]);

  const loadTrip = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.trips.get(id);
      setTrip(res.trip);
      // Expand all days by default
      const allDays = new Set(
        (res.trip.tripActivities || []).map((a) => a.dayNumber)
      );
      setExpandedDays(allDays.size > 0 ? allDays : new Set([1]));
    } catch (err: any) {
      toast.error(err.message || 'Failed to load itinerary.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNum)) {
        next.delete(dayNum);
      } else {
        next.add(dayNum);
      }
      return next;
    });
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
  const totalCost = (trip.tripActivities || []).reduce((s, a) => s + (a.estimatedCost || 0), 0);

  const getDayDate = (dayIndex: number) => {
    const start = new Date(trip.startDate);
    start.setDate(start.getDate() + (dayIndex - 1));
    return start.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getActivitiesForDay = (dayNum: number) =>
    (trip.tripActivities || [])
      .filter((a) => a.dayNumber === dayNum)
      .sort((a, b) => (a.scheduledTime || '').localeCompare(b.scheduledTime || ''));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to={`/app/trips/${trip.id}/builder`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Builder
          </Link>
          <h1 className="text-3xl font-black text-black tracking-tight font-sans">
            {trip.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#5c5d6e] mt-0.5 font-medium">
            {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()} &bull; {duration} Days &bull; {(trip.tripActivities || []).length} Activities &bull; Est. ${totalCost.toLocaleString()}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-1 bg-white p-1 rounded-2xl border border-[#e5e5ea] shadow-xs">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            <List className="w-3.5 h-3.5" /> List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'calendar' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Calendar View
          </button>
        </div>
      </div>

      {/* City Route Strip */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-400">Route:</span>
        {trip.stops.map((stop, idx) => (
          <React.Fragment key={stop.id}>
            <span className="bg-[#e3e2f7] text-black text-xs font-extrabold px-3 py-1 rounded-xl flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> {stop.city.name}
            </span>
            {idx < trip.stops.length - 1 && (
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {daysArray.map((dayNum) => {
            const acts = getActivitiesForDay(dayNum);
            const dayCost = acts.reduce((s, a) => s + (a.estimatedCost || 0), 0);
            const isExpanded = expandedDays.has(dayNum);

            return (
              <div
                key={dayNum}
                className="bg-white rounded-[28px] border border-[#e5e5ea] shadow-xs overflow-hidden"
              >
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(dayNum)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-2xl bg-black text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      {dayNum}
                    </span>
                    <div>
                      <h3 className="text-base font-extrabold text-black">Day {dayNum}</h3>
                      <p className="text-xs text-gray-500 font-medium">{getDayDate(dayNum)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-gray-500 block">{acts.length} activities</span>
                      <span className="text-xs font-extrabold text-black">${dayCost.toLocaleString()}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </button>

                {/* Expanded Activity List */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 sm:px-6 pb-5 pt-4 space-y-3">
                    {acts.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-400">
                        No activities planned for this day.{' '}
                        <Link to={`/app/trips/${trip.id}/builder`} className="text-black font-bold underline">
                          Add in Builder →
                        </Link>
                      </div>
                    ) : (
                      acts.map((act, idx) => (
                        <div
                          key={act.id}
                          className="flex items-start gap-4"
                        >
                          {/* Timeline line */}
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${act.isCompleted ? 'bg-emerald-500' : 'bg-black'}`} />
                            {idx < acts.length - 1 && (
                              <div className="w-px bg-gray-200 flex-grow mt-1" style={{ minHeight: '32px' }} />
                            )}
                          </div>

                          {/* Activity Card */}
                          <div className={`flex-grow bg-[#f9f9fb] rounded-2xl p-3.5 border transition-colors ${act.isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                {act.scheduledTime && (
                                  <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" /> {act.scheduledTime}
                                  </span>
                                )}
                                <span className="text-[10px] font-extrabold bg-[#e3e2f7] text-black px-2 py-0.5 rounded flex items-center gap-1">
                                  <Tag className="w-2.5 h-2.5" /> {act.category}
                                </span>
                                {act.tripStop?.city?.name && (
                                  <span className="text-[10px] font-bold text-blue-600">
                                    {act.tripStop.city.name}
                                  </span>
                                )}
                                {act.isCompleted && (
                                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> Completed
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-black text-black shrink-0">
                                ${(act.estimatedCost || 0).toLocaleString()}
                              </span>
                            </div>
                            <h4 className={`text-sm font-extrabold text-black ${act.isCompleted ? 'line-through text-gray-400' : ''}`}>
                              {act.customTitle || act.activity?.name}
                            </h4>
                            {act.notes && (
                              <p className="text-xs text-gray-500 mt-1">{act.notes}</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CALENDAR GRID VIEW */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {daysArray.map((dayNum) => {
            const acts = getActivitiesForDay(dayNum);
            const dayCost = acts.reduce((s, a) => s + (a.estimatedCost || 0), 0);

            return (
              <div
                key={dayNum}
                className="bg-white rounded-[28px] border border-[#e5e5ea] shadow-xs flex flex-col overflow-hidden hover:border-black transition-colors"
              >
                {/* Card Header */}
                <div className="bg-black text-white p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {getDayDate(dayNum).split(',')[0]}
                    </span>
                    <h4 className="text-base font-black">Day {dayNum}</h4>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400">
                    ${dayCost.toLocaleString()}
                  </span>
                </div>

                {/* Activities */}
                <div className="flex-grow p-3.5 space-y-2">
                  {acts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-400">
                      No activities
                    </div>
                  ) : (
                    acts.map((act) => (
                      <div
                        key={act.id}
                        className="bg-[#f9f9fb] p-2.5 rounded-xl border border-gray-200 text-xs"
                      >
                        <div className="flex justify-between items-start gap-1">
                          <div className="min-w-0">
                            {act.scheduledTime && (
                              <span className="text-[9px] text-gray-400 font-bold block mb-0.5">
                                {act.scheduledTime}
                              </span>
                            )}
                            <p className="font-extrabold text-black leading-tight truncate">
                              {act.customTitle || act.activity?.name}
                            </p>
                            <span className="text-[9px] font-bold text-gray-500 capitalize">
                              {act.category}
                            </span>
                          </div>
                          <span className="font-black text-black shrink-0 text-[11px]">
                            ${act.estimatedCost || 0}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-3.5 pb-3.5 border-t border-gray-100 pt-2.5">
                  <Link
                    to={`/app/trips/${trip.id}/builder`}
                    className="text-[11px] font-bold text-black hover:underline"
                  >
                    + Edit activities →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="bg-black text-white rounded-[28px] p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Days</span>
          <span className="text-2xl font-black">{duration}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Destinations</span>
          <span className="text-2xl font-black">{trip.stops.length}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Activities</span>
          <span className="text-2xl font-black">{(trip.tripActivities || []).length}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Est. Cost</span>
          <span className="text-2xl font-black text-emerald-400">${totalCost.toLocaleString()}</span>
        </div>
      </div>

    </div>
  );
};
