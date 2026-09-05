import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { CityModel } from '../types';
import { api } from '../services/api';
import { Search, MapPin, Star, Sparkles, ArrowRight, DollarSign, Heart, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const DestinationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cities, setCities] = useState<CityModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [savedCityIds, setSavedCityIds] = useState<string[]>([]);

  useEffect(() => {
    loadCities();
    if (user?.savedDestinations) {
      setSavedCityIds(user.savedDestinations.map(d => d.cityId));
    }
  }, [selectedContinent, user]);

  const loadCities = async () => {
    try {
      setLoading(true);
      const res = await api.cities.list({
        continent: selectedContinent !== 'all' ? selectedContinent : undefined,
        search: searchQuery || undefined,
      });
      setCities(res.cities);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load destinations.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCities();
  };

  const handleToggleSave = async (cityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast('Please sign in to save destinations to your wishlist.');
      navigate('/login');
      return;
    }

    try {
      const res = await api.cities.toggleSave(cityId);
      if (res.isSaved) {
        setSavedCityIds(prev => [...prev, cityId]);
        toast.success('Added to your travel wishlist! ❤️');
      } else {
        setSavedCityIds(prev => prev.filter(id => id !== cityId));
        toast('Removed from saved wishlist');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update wishlist.');
    }
  };

  const handleStartTrip = (cityId: string) => {
    if (user) {
      navigate(`/app/trips/new?cityId=${cityId}`);
    } else {
      navigate(`/signup`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9fb] text-[#1a1c1c]">
      <PublicNavbar />

      <main className="max-w-[1360px] mx-auto px-6 sm:px-10 py-10 sm:py-16 w-full flex-grow">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#5c5d6e] bg-[#e3e2f7] px-3.5 py-1 rounded-full inline-block mb-3">
              Global Destinations
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-tight uppercase font-sans">
              Curated World Escapes
            </h1>
            <p className="text-base text-[#5c5d6e] mt-2 max-w-xl font-medium">
              Explore handpicked cities with pre-built activity catalogues, cost indices, and 1-click itinerary planning.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar bg-white p-1.5 rounded-2xl border border-[#e5e5ea] shadow-xs">
            {[
              { id: 'all', label: 'All Regions' },
              { id: 'Europe', label: 'Europe' },
              { id: 'Asia', label: 'Asia' },
              { id: 'North America', label: 'Americas' },
              { id: 'Middle East', label: 'Middle East' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedContinent(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedContinent === tab.id
                    ? 'bg-black text-white shadow-xs'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-10 max-w-xl">
          <div className="relative flex items-center bg-white rounded-2xl border border-[#e5e5ea] shadow-xs overflow-hidden focus-within:border-black transition-all">
            <Search className="w-5 h-5 text-gray-400 ml-4" />
            <input
              type="text"
              placeholder="Search by city name, country, or vibe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-3.5 text-xs sm:text-sm text-black placeholder:text-gray-400 focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold mr-2 hover:bg-neutral-800 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Cities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-[32px] h-96 animate-pulse border border-[#e5e5ea]" />
            ))}
          </div>
        ) : cities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[36px] border border-[#e5e5ea] p-8">
            <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-black">No destinations matched</h3>
            <p className="text-xs text-gray-500 mt-1">Try clearing your search query or selecting another region.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((city) => {
              const isSaved = savedCityIds.includes(city.id);

              return (
                <div
                  key={city.id}
                  className="bg-white rounded-[32px] overflow-hidden border border-[#e5e5ea] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* City Hero Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Top Region Pill & Like Button */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                        {city.continent}
                      </span>

                      <button
                        onClick={(e) => handleToggleSave(city.id, e)}
                        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white drop-shadow-md">
                      <span className="text-[11px] font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {city.country}
                      </span>
                      <span className="text-[11px] font-extrabold flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 stroke-none" /> {city.popularity.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* City Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-black tracking-tight font-sans">
                        {city.name}
                      </h3>
                      <p className="text-xs text-[#5c5d6e] mt-2 line-clamp-2 leading-relaxed font-normal">
                        {city.description}
                      </p>

                      {/* Cost Index & Activities count */}
                      <div className="mt-4 flex items-center gap-3 pt-3 border-t border-gray-100 text-xs">
                        <span className="font-semibold text-gray-500">
                          Cost Index:{' '}
                          <span className="text-black font-extrabold font-mono">
                            {'$'.repeat(city.costIndex)}
                            <span className="text-gray-300">{'$'.repeat(5 - city.costIndex)}</span>
                          </span>
                        </span>
                        <span className="text-gray-300">&bull;</span>
                        <span className="font-semibold text-gray-500">
                          {city._count?.activities || 0} Activities
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleStartTrip(city.id)}
                      className="mt-6 w-full bg-black text-white hover:bg-neutral-800 active:scale-[0.98] py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Plan Trip in {city.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};
