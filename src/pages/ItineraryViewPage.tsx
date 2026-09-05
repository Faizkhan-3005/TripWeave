import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, DollarSign,
  ArrowLeft, ArrowRight, List, LayoutGrid,
  Tag, CheckCircle2, Compass, ChevronDown, ChevronUp,
  Star, Award, Check, MessageSquare
} from 'lucide-react';
import { TripModel, TripActivityModel, ReviewModel } from '../types';
import { api } from '../services/api';
import { TripReviewModal } from '../components/reviews/TripReviewModal';
import toast from 'react-hot-toast';

type ViewMode = 'list' | 'calendar';

export const ItineraryViewPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<TripModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [completing, setCompleting] = useState<boolean>(false);

  useEffect(() => {
    if (tripId) {
      loadTrip(tripId);
      loadReviews(tripId);
    }
  }, [tripId]);

  const loadReviews = async (id: string) => {
    try {
      const res = await api.reviews.list({ tripId: id });
      setReviews(res.reviews || []);
    } catch {
      // ignore
    }
  };

  const handleCompleteTrip = async () => {
    if (!trip) return;
    setCompleting(true);
    try {
      await api.trips.complete(trip.id);
      toast.success('🎉 Trip marked as completed! How was your journey?');
      loadTrip(trip.id);
      setReviewModalOpen(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete trip.');
    } finally {
      setCompleting(false);
    }
  };

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

        {/* Action Controls & View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {trip.status !== 'COMPLETED' ? (
            <button
              onClick={handleCompleteTrip}
              disabled={completing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{completing ? 'Completing...' : 'Complete Journey'}</span>
            </button>
          ) : (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Leave Verified Review</span>
            </button>
          )}

          <div className="flex gap-1 bg-white p-1 rounded-2xl border border-[#e5e5ea] shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'calendar' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Calendar
            </button>
          </div>
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

      {/* Verified Traveler Reviews & Testimonials Section */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e5e5ea] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <h3 className="text-lg font-black text-black tracking-tight">
                Verified Explorer Reviews &amp; Testimonials
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Read feedback from travelers who navigated this exact departure route.
            </p>
          </div>

          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Star className="w-3.5 h-3.5 fill-current text-yellow-300" />
            <span>Write a Review</span>
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30 text-gray-400" />
            <p className="text-xs font-bold text-gray-600">Be the First to Review this Tour</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Completed this escape? Leave a verified rating and tips for the community!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-[#fafafa] border border-gray-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={rev.user?.name}
                      className="w-7 h-7 rounded-full object-cover border border-black/10"
                    />
                    <div>
                      <span className="text-xs font-bold text-black block leading-none">{rev.user?.name || 'Verified Traveler'}</span>
                      <span className="text-[9px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {rev.comment && (
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {rev.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <TripReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          tripId={trip.id}
          tripTitle={trip.title}
          onReviewSubmitted={() => {
            loadReviews(trip.id);
          }}
        />
      )}

    </div>
  );
};
