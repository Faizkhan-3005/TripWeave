import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Calendar, MapPin, DollarSign, Share2, Trash2, 
  Download, Edit3, ArrowRight, Clock, CheckCircle, Search, 
  ExternalLink, Compass, AlertCircle
} from 'lucide-react';
import { TripModel } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const MyTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const res = await api.trips.list();
      setTrips(res.trips);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load trips.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.trips.delete(id);
      setTrips(trips.filter((t) => t.id !== id));
      toast.success(`Deleted "${title}"`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete trip.');
    }
  };

  const handleShareTrip = (shareSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/trips/${shareSlug}`;
    navigator.clipboard.writeText(url);
    toast.success('Public share link copied to clipboard! 📋');
  };

  const handleExportCsv = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(api.trips.exportCsvUrl(id), '_blank');
    toast.success('Downloading Excel-compatible CSV... 📊');
  };

  const filteredTrips = trips.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.cities || []).some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c5d6e] bg-[#e3e2f7] px-3 py-1 rounded-full inline-block mb-2">
            Trip Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
            My Planned Trips
          </h1>
          <p className="text-xs sm:text-sm text-[#5c5d6e] mt-1 font-medium">
            Manage your custom itineraries, budgets, and multi-city route schedules.
          </p>
        </div>

        <Link
          to="/app/trips/new"
          className="bg-black text-white hover:bg-neutral-800 active:scale-95 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Trip</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by trip name or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-[#e5e5ea] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-black font-medium shadow-xs"
        />
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl h-80 animate-pulse border border-[#e5e5ea]" />
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="bg-white rounded-[36px] p-12 border border-[#e5e5ea] text-center max-w-lg mx-auto">
          <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-black text-black">No trips found</h3>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            {searchQuery ? 'Try a different search query.' : 'Create your first custom multi-city itinerary now.'}
          </p>
          <Link
            to="/app/trips/new"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> Plan a Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const percentSpent = trip.budget > 0 ? Math.min(100, Math.round((trip.totalSpent / trip.budget) * 100)) : 0;
            const isOver = trip.totalSpent > trip.budget;

            return (
              <div
                key={trip.id}
                onClick={() => navigate(`/app/trips/${trip.id}/builder`)}
                className="bg-white rounded-[32px] overflow-hidden border border-[#e5e5ea] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Top Cover Image */}
                  <div className="h-48 w-full relative overflow-hidden bg-gray-100">
                    <img
                      src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Duration Badge & Actions */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                        {trip.durationDays} Days
                      </span>

                      <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-xs">
                        <button
                          onClick={(e) => handleShareTrip(trip.shareSlug, e)}
                          title="Copy Public Share Link"
                          className="p-1 text-gray-700 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleExportCsv(trip.id, e)}
                          title="Export Excel CSV"
                          className="p-1 text-gray-700 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteTrip(trip.id, trip.title, e)}
                          title="Delete Trip"
                          className="p-1 text-gray-700 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white drop-shadow-md">
                      <span className="text-[11px] font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(trip.startDate).toLocaleDateString()}
                      </span>
                      <span className="text-[11px] font-extrabold bg-black/60 px-2 py-0.5 rounded-full">
                        {trip.stopsCount || 1} Stops
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-black text-black tracking-tight leading-snug group-hover:text-blue-600 transition-colors font-sans">
                      {trip.title}
                    </h3>

                    {/* Cities Route */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {(trip.cities || []).map((city) => (
                        <span
                          key={city}
                          className="bg-[#f3f3f6] text-gray-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg"
                        >
                          {city}
                        </span>
                      ))}
                    </div>

                    {/* Budget Progress Bar */}
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-gray-500">Budget: ${trip.budget.toLocaleString()}</span>
                        <span className={isOver ? 'text-red-600' : 'text-emerald-600'}>
                          ${trip.totalSpent.toLocaleString()} spent ({percentSpent}%)
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isOver ? 'bg-red-500' : 'bg-black'
                          }`}
                          style={{ width: `${percentSpent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-2 border-t border-gray-50">
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/app/trips/${trip.id}/view`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-bold text-black bg-[#e3e2f7] hover:bg-[#d5d4f0] px-3 py-1.5 rounded-xl transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      to={`/app/trips/${trip.id}/budget`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-bold text-gray-500 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Budget
                    </Link>
                    <Link
                      to={`/app/trips/${trip.id}/calendar`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-bold text-gray-500 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Calendar
                    </Link>
                  </div>

                  <span className="text-xs font-extrabold text-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
