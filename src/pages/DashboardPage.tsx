import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Calendar, MapPin, Compass, ArrowRight, DollarSign, 
  Sparkles, Clock, CheckCircle2, ChevronRight, TrendingUp,
  BarChart3, Globe, Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TripModel, CityModel } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { TripRouteMap } from '../components/common/TripRouteMap';


export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<TripModel[]>([]);
  const [recommendedCities, setRecommendedCities] = useState<CityModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [tripsRes, citiesRes] = await Promise.all([
        api.trips.list(),
        api.cities.list(),
      ]);
      setTrips(tripsRes.trips);
      setRecommendedCities(citiesRes.cities.slice(0, 4));
    } catch (err: any) {
      toast.error(err.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const upcomingTrip = trips.length > 0 ? trips[0] : null;
  const recentTrips = trips.slice(1, 4);

  const totalPlannedBudget = trips.reduce((acc, t) => acc + t.budget, 0);
  const totalSpent = trips.reduce((acc, t) => acc + t.totalSpent, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Greeting & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c5d6e] bg-[#e3e2f7] px-3 py-1 rounded-full inline-block mb-2">
            Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
            Good day, {user?.name || 'Traveler'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#5c5d6e] mt-1 font-medium">
            You have {trips.length} active itineraries planned across {trips.reduce((sum, t) => sum + (t.stopsCount || 0), 0)} destinations.
          </p>
        </div>

        {/* Quick Action CTA */}
        <Link
          to="/app/trips/new"
          className="bg-black text-white hover:bg-neutral-800 active:scale-95 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* 2. Top Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-[#e5e5ea] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#e3e2f7] text-black flex items-center justify-center font-bold">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">Total Trips</span>
            <span className="text-xl font-black text-black">{trips.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e5e5ea] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">Total Budget</span>
            <span className="text-xl font-black text-black">${totalPlannedBudget.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e5e5ea] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">Total Spent</span>
            <span className="text-xl font-black text-black">${totalSpent.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e5e5ea] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">Saved Cities</span>
            <span className="text-xl font-black text-black">{user?.savedDestinations?.length ?? 0}</span>
          </div>
        </div>
      </div>

      {/* 3. Upcoming Hero Trip Card */}
      {upcomingTrip && (
        <div className="relative bg-white rounded-[36px] overflow-hidden border border-[#e5e5ea] shadow-sm hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Image & Info */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-black text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                    Upcoming Journey
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    {new Date(upcomingTrip.startDate).toLocaleDateString()} &ndash; {new Date(upcomingTrip.endDate).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
                  {upcomingTrip.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#5c5d6e] mt-2 line-clamp-2 leading-relaxed">
                  {upcomingTrip.description || 'Explore scenic landmarks, cultural tours, and curated local culinary dining.'}
                </p>

                {/* Cities Pill Strip */}
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                  <span className="text-[11px] font-bold text-gray-400">Route:</span>
                  {(upcomingTrip.cities || []).map((city, idx) => (
                    <span
                      key={city}
                      className="bg-[#e3e2f7] text-black text-xs font-extrabold px-3 py-1 rounded-xl flex items-center gap-1"
                    >
                      <span>{idx + 1}. {city}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3">
                <Link
                  to={`/app/trips/${upcomingTrip.id}/builder`}
                  className="bg-black text-white hover:bg-neutral-800 active:scale-95 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Open Itinerary Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/app/trips/${upcomingTrip.id}/budget`}
                  className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Budget Breakdown
                </Link>

                <Link
                  to={`/app/trips/${upcomingTrip.id}/calendar`}
                  className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Calendar View
                </Link>
              </div>
            </div>

            {/* Right: Cover Image + Mini Route Map */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="h-44 relative overflow-hidden bg-gray-100 lg:rounded-tr-[36px]">
                <img
                  src={upcomingTrip.coverImage || 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'}
                  alt={upcomingTrip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-extrabold text-black shadow-xs">
                  {upcomingTrip.durationDays} Days &bull; ${upcomingTrip.budget.toLocaleString()}
                </div>
              </div>
              {upcomingTrip.stops && upcomingTrip.stops.length > 0 && (
                <div className="flex-1 p-3">
                  <TripRouteMap stops={upcomingTrip.stops} compact />
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 4. Recent Trips & Recommended Cities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Trips */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-black tracking-tight">Your Trips</h3>
            <Link to="/app/trips" className="text-xs font-bold text-black hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#e5e5ea] text-center">
              <Compass className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-black">No trips planned yet</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">Create your first multi-city itinerary now!</p>
              <Link to="/app/trips/new" className="inline-block bg-black text-white px-5 py-2 rounded-xl text-xs font-bold">
                + Create Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/app/trips/${t.id}/builder`)}
                  className="bg-white p-4 rounded-2xl border border-[#e5e5ea] shadow-xs hover:border-black transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={t.coverImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80'}
                      alt={t.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-black truncate group-hover:text-blue-600 transition-colors">
                        {t.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> {new Date(t.startDate).toLocaleDateString()} ({t.durationDays} Days)
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-black block">${t.budget.toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">{t.stopsCount || 1} Cities</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recommended Destinations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-black tracking-tight">Recommended Cities</h3>
            <Link to="/app/search" className="text-xs font-bold text-black hover:underline flex items-center gap-1">
              Explore More <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {recommendedCities.map((city) => (
              <div
                key={city.id}
                onClick={() => navigate(`/app/trips/new?cityId=${city.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-[#e5e5ea] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="h-28 w-full relative overflow-hidden bg-gray-100">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {city.country}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-extrabold text-xs text-black truncate">{city.name}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{'$'.repeat(city.costIndex)} &bull; {city.popularity.toFixed(1)} ★</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
