import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, MapPin, Clock, ArrowRight, 
  Compass, DollarSign, Sparkles 
} from 'lucide-react';
import { TripModel } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const GlobalCalendarPage: React.FC = () => {
  const [trips, setTrips] = useState<TripModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const res = await api.trips.list();
      setTrips(res.trips);
    } catch (err: any) {
      toast.error('Failed to load schedule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c5d6e] bg-[#e3e2f7] px-3 py-1 rounded-full inline-block mb-2">
          Global Schedule
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
          Master Travel Calendar
        </h1>
        <p className="text-xs sm:text-sm text-[#5c5d6e] mt-1 font-medium">
          Consolidated timeline of all your upcoming itineraries and journeys.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-[36px] p-12 border border-[#e5e5ea] text-center max-w-lg mx-auto">
          <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-black text-black">No scheduled itineraries</h3>
          <p className="text-xs text-gray-500 mt-1 mb-6">Create a trip to view its calendar timeline.</p>
          <Link to="/app/trips/new" className="inline-block bg-black text-white px-6 py-2.5 rounded-2xl text-xs font-bold">
            + Plan a Trip
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e5e5ea] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'}
                  alt={trip.title}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#e3e2f7] text-black px-2.5 py-0.5 rounded-md">
                      {trip.durationDays} Days
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      {new Date(trip.startDate).toLocaleDateString()} &ndash; {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-black">{trip.title}</h3>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(trip.cities || []).map((c) => (
                      <span key={c} className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={`/app/trips/${trip.id}/calendar`}
                  className="bg-black text-white hover:bg-neutral-800 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>View Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
