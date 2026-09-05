import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Star, DollarSign, Clock, Tag, Filter,
  Plus, ArrowRight, Compass, MapPin, Sparkles, X
} from 'lucide-react';
import { ActivityModel, CityModel } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Sightseeing', 'Food', 'Culture', 'Adventure', 'Nature', 'Shopping', 'Nightlife'];

export const ActivitySearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityModel[]>([]);
  const [cities, setCities] = useState<CityModel[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'cost_asc' | 'cost_desc'>('rating');

  useEffect(() => {
    loadCities();
    performSearch();
  }, []);

  useEffect(() => {
    performSearch();
  }, [selectedCategory, selectedCityId, maxCost]);

  const loadCities = async () => {
    try {
      const res = await api.cities.list();
      setCities(res.cities);
    } catch (_) {}
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      const res = await api.activities.list({
        search: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        cityId: selectedCityId || undefined,
        maxCost: maxCost ? Number(maxCost) : undefined,
      });
      setActivities(res.activities);
    } catch (err: any) {
      toast.error('Failed to load activities.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCityId('');
    setMaxCost('');
  };

  const hasFilters = selectedCategory !== 'All' || selectedCityId || maxCost || searchQuery;

  const sorted = [...activities].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'cost_asc') return (a.cost || 0) - (b.cost || 0);
    if (sortBy === 'cost_desc') return (b.cost || 0) - (a.cost || 0);
    return 0;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c5d6e] bg-[#e3e2f7] px-3 py-1 rounded-full inline-block mb-2">
          Activity Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
          Browse Activities & Experiences
        </h1>
        <p className="text-xs sm:text-sm text-[#5c5d6e] mt-1 font-medium">
          Discover curated sightseeing tours, food walks, cultural experiences, and adventures across all destinations.
        </p>
      </div>

      {/* Search & Filter Panel */}
      <div className="bg-white rounded-[32px] p-5 sm:p-7 border border-[#e5e5ea] shadow-xs space-y-5">

        {/* Search Bar Row */}
        <form
          onSubmit={(e) => { e.preventDefault(); performSearch(); }}
          className="flex gap-2"
        >
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by activity name, description, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f9f9fb] border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black font-medium"
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-[#f3f3f6] text-gray-600 hover:bg-gray-200 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Filter by City</p>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="bg-[#f9f9fb] border border-gray-200 rounded-xl px-3 py-2 text-xs text-black font-semibold focus:outline-none focus:border-black"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}, {c.country}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Max Cost ($)</p>
            <input
              type="number"
              placeholder="e.g. 150"
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value)}
              className="w-32 bg-[#f9f9fb] border border-gray-200 rounded-xl px-3 py-2 text-xs text-black font-medium focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Sort By</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#f9f9fb] border border-gray-200 rounded-xl px-3 py-2 text-xs text-black font-semibold focus:outline-none focus:border-black"
            >
              <option value="rating">Highest Rated</option>
              <option value="cost_asc">Lowest Cost</option>
              <option value="cost_desc">Highest Cost</option>
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-5 flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}

          <span className="mt-5 ml-auto text-xs font-bold text-gray-400">
            {activities.length} results
          </span>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-3xl h-52 animate-pulse border border-[#e5e5ea]" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-[36px] p-12 border border-[#e5e5ea] text-center">
          <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-black text-black">No activities found</h3>
          <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-[28px] p-5 sm:p-6 border border-[#e5e5ea] shadow-xs hover:shadow-lg hover:border-black transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Category & City */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#e3e2f7] text-black px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" /> {act.category}
                  </span>
                  {act.city && (
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {act.city.name}
                    </span>
                  )}
                </div>

                {/* Activity Name & Description */}
                <h3 className="text-base sm:text-lg font-extrabold text-black leading-snug tracking-tight group-hover:text-blue-700 transition-colors">
                  {act.name}
                </h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                  {act.description}
                </p>

                {/* Meta Row: Duration, Cost, Rating */}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs pt-3 border-t border-gray-100">
                  {act.durationHours && (
                    <span className="flex items-center gap-1 text-gray-500 font-semibold">
                      <Clock className="w-3.5 h-3.5" /> {act.durationHours}h
                    </span>
                  )}
                  <span className="flex items-center gap-1 font-extrabold text-black">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    ${(act.cost || 0).toLocaleString()}
                  </span>
                  {act.rating && (
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                      {act.rating}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate('/app/trips/new')}
                className="mt-5 w-full bg-black text-white hover:bg-neutral-800 active:scale-[0.98] py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to New Trip</span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
