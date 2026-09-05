import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { TripModel } from '../types';
import { api } from '../services/api';
import { 
  Calendar, MapPin, DollarSign, Copy, Check, Share2, 
  Clock, ArrowRight, User, Sparkles, Compass, Tag, Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { TripRouteMap } from '../components/common/TripRouteMap';
import { exportTripPdf } from '../services/pdfGenerator';


export const PublicTripPage: React.FC = () => {
  const { shareSlug } = useParams<{ shareSlug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<TripModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copying, setCopying] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  useEffect(() => {
    if (shareSlug) {
      loadPublicTrip(shareSlug);
    }
  }, [shareSlug]);

  const loadPublicTrip = async (slug: string) => {
    try {
      setLoading(true);
      const res = await api.share.getPublicTrip(slug);
      setTrip(res.trip);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load public trip.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrip = async () => {
    if (!user) {
      toast('Please sign in or create an account to copy this trip.');
      navigate('/login');
      return;
    }

    if (!shareSlug) return;

    setCopying(true);
    try {
      const res = await api.share.copyTrip(shareSlug);
      toast.success(res.message);
      navigate(`/app/trips/${res.tripId}/builder`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to copy trip.');
    } finally {
      setCopying(false);
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    toast.success('Share link copied to clipboard! 📋');
    setTimeout(() => setLinkCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9f9fb] text-[#1a1c1c]">
        <PublicNavbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9f9fb] text-[#1a1c1c]">
        <PublicNavbar />
        <div className="flex-grow flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-[36px] border border-gray-200">
            <Compass className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-black">Trip Not Found</h2>
            <p className="text-xs text-gray-500 mt-2">
              This shared itinerary may have been removed or made private by its creator.
            </p>
            <Link to="/destinations" className="mt-6 inline-block bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold">
              Explore Destinations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9fb] text-[#1a1c1c]">
      <PublicNavbar />

      <main className="max-w-[1200px] mx-auto px-6 sm:px-10 py-10 w-full flex-grow space-y-10">
        
        {/* Hero Banner Card */}
        <div className="relative rounded-[40px] overflow-hidden bg-black text-white p-8 sm:p-14 shadow-xl">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{ backgroundImage: `url(${trip.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" /> Public Itinerary
              </span>
              <span className="text-xs text-gray-300 font-medium">
                Created by {trip.user?.name || 'Tripweave Traveler'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-sans">
              {trip.title}
            </h1>

            {trip.description && (
              <p className="text-sm text-gray-200 mt-3 font-normal leading-relaxed">
                {trip.description}
              </p>
            )}

            {/* Quick Metadata Row */}
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/20 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-300" />
                <span>
                  {new Date(trip.startDate).toLocaleDateString()} &ndash; {new Date(trip.endDate).toLocaleDateString()} ({trip.durationDays} Days)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-300" />
                <span>{trip.stops.length} Cities</span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-300">
                  {trip.currency} {trip.budget.toLocaleString()} Estimated Budget
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Share & Copy Trip */}
          <div className="relative z-10 mt-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopyTrip}
                disabled={copying}
                className="bg-white text-black hover:bg-gray-100 active:scale-95 px-6 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                <Copy className="w-4 h-4" />
                <span>{copying ? 'Copying Itinerary...' : 'Clone to My Trips'}</span>
              </button>

              <button
                onClick={() => {
                  exportTripPdf(trip);
                  toast.success('PDF Travel Guide downloaded!');
                }}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/30 backdrop-blur-md px-5 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Guide</span>
              </button>

              <button
                onClick={handleShareLink}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/30 backdrop-blur-md px-5 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                {linkCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{linkCopied ? 'Link Copied!' : 'Share Trip'}</span>
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs">
              <span className="text-[11px] text-gray-300 font-bold uppercase tracking-wider mr-1">Share on:</span>
              
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out my itinerary "${trip.title}" on Tripweave! ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                WhatsApp
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this travel plan "${trip.title}" on @Tripweave`)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                X (Twitter)
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                LinkedIn
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-blue-700/80 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Route Map */}
        {trip.stops.length > 0 && (
          <div>
            <h3 className="text-xl font-black text-black tracking-tight mb-4">Trip Route</h3>
            <TripRouteMap stops={trip.stops} />
          </div>
        )}

        {/* Stops & Cities Strip */}
        <div>
          <h3 className="text-xl font-black text-black tracking-tight mb-4">
            Destinations &amp; Stops
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {trip.stops.map((stop, idx) => (
              <div key={stop.id} className="bg-white rounded-2xl p-4 border border-[#e5e5ea] flex items-center gap-3 shadow-xs">
                <span className="w-8 h-8 rounded-xl bg-[#e3e2f7] text-black font-extrabold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-black truncate">{stop.city.name}</h4>
                  <p className="text-[11px] text-gray-500">{stop.city.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day-by-Day Activities Timeline */}
        <div>
          <h3 className="text-xl font-black text-black tracking-tight mb-6">
            Planned Activities Timeline
          </h3>

          {(!trip.tripActivities || trip.tripActivities.length === 0) ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center">
              <p className="text-xs text-gray-500">No scheduled activities for this trip yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trip.tripActivities.map((act) => (
                <div 
                  key={act.id}
                  className="bg-white rounded-2xl p-5 border border-[#e5e5ea] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="px-3 py-1.5 bg-[#e3e2f7] rounded-xl text-black font-black text-xs shrink-0 mt-0.5">
                      Day {act.dayNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5" /> {act.category}
                        </span>
                        {act.scheduledTime && (
                          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {act.scheduledTime}
                          </span>
                        )}
                        {act.tripStop?.city?.name && (
                          <span className="text-[10px] font-bold text-blue-600">
                            &bull; {act.tripStop.city.name}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-extrabold text-black">
                        {act.customTitle || act.activity?.name}
                      </h4>

                      {act.notes && (
                        <p className="text-xs text-gray-500 mt-1">{act.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <span className="text-xs font-bold text-black">
                      {trip.currency} {(act.estimatedCost || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};
