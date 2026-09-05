import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Star, DollarSign, Clock, Tag, 
  ArrowRight, Compass, Sparkles, Filter, Plus 
} from 'lucide-react';
import { CityModel, ActivityModel } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const GlobalSearchPage: React.FC = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'cities' | 'activities'>('all');
  const [category, setCategory] = useState('all');
  const [continent, setContinent] = useState('all');
  
  const [cities, setCities] = useState<CityModel[]>([]);
  const [activities, setActivities] = useState<ActivityModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    performSearch();
  }, [category, continent]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const res = await api.search({
        q: query || undefined,
        category: category !== 'all' ? category : undefined,
        continent: continent !== 'all' ? continent : undefined,
      });
      setCities(res.cities);
      setActivities(res.activities);
    } catch (err: any) {
      toast.error('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c5d6e] bg-[#e3e2f7] px-3 py-1 rounded-full inline-block mb-2">
          Global Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
          Explore Cities &amp; Activities
        </h1>
        <p className="text-xs sm:text-sm text-[#5c5d6e] mt-1 font-medium">
          Search destinations, cultural experiences, food walks, and sightseeing attractions.
        </p>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-[32px] border border-[#e5e5ea] shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, activity name, or country..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Tab Selector */}
          <div className="flex gap-1 bg-[#f9f9fb] p-1 rounded-xl border border-gray-200">
            {[
              { id: 'all', label: 'All Results' },
              { id: 'cities', label: `Cities (${cities.length})` },
              { id: 'activities', label: `Activities (${activities.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-xs'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Region & Category dropdowns */}
          <div className="flex flex-wrap gap-2">
            <select
              value={continent}
              onChange={(e) => setContinent(e.target.value)}
              className="bg-[#f9f9fb] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-black font-semibold focus:outline-none"
            >
              <option value="all">All Continents</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="North America">Americas</option>
              <option value="Middle East">Middle East</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#f9f9fb] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-black font-semibold focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Sightseeing">Sightseeing</option>
              <option value="Food">Food &amp; Dining</option>
              <option value="Culture">Culture &amp; Art</option>
              <option value="Adventure">Adventure</option>
              <option value="Nature">Nature</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Container */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* SECTION 1: CITIES */}
          {(activeTab === 'all' || activeTab === 'cities') && cities.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-black tracking-tight">
                Destinations &amp; Cities ({cities.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {cities.map((city) => (
                  <div
                    key={city.id}
                    onClick={() => navigate(`/app/trips/new?cityId=${city.id}`)}
                    className="bg-white rounded-[28px] overflow-hidden border border-[#e5e5ea] shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-36 w-full relative overflow-hidden bg-gray-100">
                        <img
                          src={city.image}
                          alt={city.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-black/75 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                          {city.country}
                        </span>
                      </div>

                      <div className="p-4">
                        <h4 className="font-black text-sm text-black truncate">{city.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{city.description}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 mt-2 text-xs">
                      <span className="font-extrabold text-black font-mono">
                        {'$'.repeat(city.costIndex)}
                      </span>
                      <span className="font-bold text-black group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>Plan Trip</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: ACTIVITIES */}
          {(activeTab === 'all' || activeTab === 'activities') && activities.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-black tracking-tight">
                Curated Activities &amp; Experiences ({activities.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="bg-white p-5 rounded-[28px] border border-[#e5e5ea] shadow-xs hover:border-black transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#e3e2f7] text-black px-2.5 py-0.5 rounded-md">
                          {act.category}
                        </span>
                        {act.city && (
                          <span className="text-xs font-bold text-gray-500">
                            {act.city.name}, {act.city.country}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-extrabold text-black leading-snug">
                        {act.name}
                      </h4>

                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-medium">Est. Cost</span>
                        <span className="text-sm font-black text-black">${act.cost}</span>
                      </div>

                      <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 stroke-none" /> {act.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
