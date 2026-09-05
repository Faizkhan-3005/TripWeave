import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Compass, Calendar, Plus, 
  BarChart3, User, Shield, Sparkles, Tag, 
  DollarSign, ArrowRight, CornerDownLeft, Clock,
  Layers, X, FileText, CheckCircle2, Bookmark
} from 'lucide-react';
import { api } from '../../services/api';
import { CityModel, ActivityModel, TripModel } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Cities' | 'Activities' | 'Trips' | 'Actions';
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  image?: string;
  action: () => void;
}

export const SpotlightSearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Cities' | 'Activities' | 'Trips' | 'Actions'>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [cities, setCities] = useState<CityModel[]>([]);
  const [activities, setActivities] = useState<ActivityModel[]>([]);
  const [trips, setTrips] = useState<TripModel[]>([]);
  const [loading, setLoading] = useState(false);

  // Load catalog on initial mount
  useEffect(() => {
    if (isOpen) {
      loadSearchData();
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const loadSearchData = async () => {
    try {
      setLoading(true);
      const [citiesRes, actsRes, tripsRes] = await Promise.all([
        api.cities.list().catch(() => ({ cities: [] })),
        api.activities.list().catch(() => ({ activities: [] })),
        api.trips.list().catch(() => ({ trips: [] })),
      ]);
      setCities(citiesRes.cities || []);
      setActivities(actsRes.activities || []);
      setTrips(tripsRes.trips || []);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  // Base navigation actions
  const defaultActions: SearchResultItem[] = [
    {
      id: 'act-new-trip',
      title: 'Plan New Multi-City Trip',
      subtitle: 'Create customized dates, budget, and destination route',
      category: 'Actions',
      icon: Plus,
      badge: 'Create',
      action: () => { navigate('/app/trips/new'); onClose(); },
    },
    {
      id: 'act-my-trips',
      title: 'View My Itineraries',
      subtitle: 'Browse, manage, export CSV, or edit your saved trips',
      category: 'Actions',
      icon: MapPin,
      badge: 'Workspace',
      action: () => { navigate('/app/trips'); onClose(); },
    },
    {
      id: 'act-explore-cities',
      title: 'Explore City Catalog',
      subtitle: 'Filter destinations by continent, cost index, and popularity',
      category: 'Actions',
      icon: Compass,
      badge: 'Explore',
      action: () => { navigate('/app/search'); onClose(); },
    },
    {
      id: 'act-activity-catalog',
      title: 'Browse Activity Catalog',
      subtitle: 'Sightseeing, food tours, culture, and outdoor experiences',
      category: 'Actions',
      icon: Sparkles,
      badge: 'Catalog',
      action: () => { navigate('/app/activities'); onClose(); },
    },
    {
      id: 'act-master-calendar',
      title: 'Master Travel Timeline',
      subtitle: 'Comprehensive multi-trip timeline calendar',
      category: 'Actions',
      icon: Calendar,
      badge: 'Schedule',
      action: () => { navigate('/app/calendar'); onClose(); },
    },
    {
      id: 'act-analytics',
      title: 'Travel Analytics & Spend Breakdown',
      subtitle: 'Financial insights, travel days, and category spending charts',
      category: 'Actions',
      icon: BarChart3,
      badge: 'Metrics',
      action: () => { navigate('/app/analytics'); onClose(); },
    },
    {
      id: 'act-profile',
      title: 'Profile, Currency & Wishlist',
      subtitle: 'Update name, avatar, currency preferences, and saved cities',
      category: 'Actions',
      icon: User,
      badge: 'Settings',
      action: () => { navigate('/app/profile'); onClose(); },
    },
    {
      id: 'act-admin',
      title: 'Admin Telemetry & User Directory',
      subtitle: 'System dashboard, platform stats, and event audit stream',
      category: 'Actions',
      icon: Shield,
      badge: 'Admin',
      action: () => { navigate('/app/admin'); onClose(); },
    },
  ];

  // Build filtered search results
  const q = query.toLowerCase().trim();

  const cityResults: SearchResultItem[] = cities
    .filter(c => !q || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.continent.toLowerCase().includes(q))
    .map(c => ({
      id: `city-${c.id}`,
      title: c.name,
      subtitle: `${c.country} • ${c.continent} • Cost: ${'$'.repeat(c.costIndex)} • ★ ${c.popularity.toFixed(1)}`,
      category: 'Cities',
      icon: MapPin,
      badge: c.country,
      image: c.image,
      action: () => { navigate(`/app/search?q=${encodeURIComponent(c.name)}`); onClose(); },
    }));

  const activityResults: SearchResultItem[] = activities
    .filter(a => !q || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || (a.city?.name || '').toLowerCase().includes(q))
    .map(a => ({
      id: `act-${a.id}`,
      title: a.name,
      subtitle: `${a.category} • ${a.city?.name || 'Global'} • $${a.cost} • ${a.durationHours || 2}h`,
      category: 'Activities',
      icon: Tag,
      badge: a.category,
      action: () => { navigate(`/app/activities?q=${encodeURIComponent(a.name)}`); onClose(); },
    }));

  const tripResults: SearchResultItem[] = trips
    .filter(t => !q || t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q) || (t.cities || []).some(city => city.toLowerCase().includes(q)))
    .map(t => ({
      id: `trip-${t.id}`,
      title: t.title,
      subtitle: `${t.durationDays} Days • ${(t.cities || []).join(' → ') || 'Custom route'} • Budget: $${t.budget.toLocaleString()}`,
      category: 'Trips',
      icon: FileText,
      badge: `${t.durationDays}d`,
      image: t.coverImage,
      action: () => { navigate(`/app/trips/${t.id}/builder`); onClose(); },
    }));

  const actionResults: SearchResultItem[] = defaultActions.filter(
    a => !q || a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)
  );

  // Group all matching items
  const allResults: SearchResultItem[] = [];
  if (activeCategory === 'All' || activeCategory === 'Actions') allResults.push(...actionResults);
  if (activeCategory === 'All' || activeCategory === 'Trips') allResults.push(...tripResults);
  if (activeCategory === 'All' || activeCategory === 'Cities') allResults.push(...cityResults);
  if (activeCategory === 'All' || activeCategory === 'Activities') allResults.push(...activityResults);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        allResults[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10001] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200 font-sans z-[10002]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-gray-400 shrink-0 ml-2" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search trips, cities, activities, or navigate anywhere... (Cmd+K)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full text-sm sm:text-base font-medium text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-black rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] font-mono font-bold bg-[#f3f3f6] text-gray-500 px-2 py-1 rounded-md border border-gray-200 shrink-0">
            ESC
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 bg-[#fafafa] border-b border-gray-100 overflow-x-auto text-xs">
          {(['All', 'Actions', 'Trips', 'Cities', 'Activities'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-500 hover:text-black hover:bg-gray-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-[11px] font-bold text-gray-400 pl-2">
            {allResults.length} matches
          </span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-3 sm:p-4 space-y-1 flex-grow">
          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400 font-medium">
              Searching Tripweave workspace...
            </div>
          ) : allResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">
              No results found for &ldquo;<span className="font-bold text-black">{query}</span>&rdquo;. Try searching for &ldquo;Tokyo&rdquo;, &ldquo;Budget&rdquo;, or &ldquo;New Trip&rdquo;.
            </div>
          ) : (
            allResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#e3e2f7] text-black shadow-xs'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-black/10"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-black text-white' : 'bg-[#f3f3f6] text-gray-700'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-xs sm:text-sm text-black truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            isSelected ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-black bg-white/80 px-2 py-1 rounded-lg">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Keyboard Hints */}
        <div className="p-3 px-6 bg-[#fafafa] border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="bg-white px-1.5 py-0.5 rounded border border-gray-200 font-mono text-[10px] text-black font-bold">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white px-1.5 py-0.5 rounded border border-gray-200 font-mono text-[10px] text-black font-bold">↵</kbd> Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white px-1.5 py-0.5 rounded border border-gray-200 font-mono text-[10px] text-black font-bold">ESC</kbd> Close
            </span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 hidden sm:inline">
            Tripweave Spotlight
          </span>
        </div>
      </div>
    </div>
  );
};
