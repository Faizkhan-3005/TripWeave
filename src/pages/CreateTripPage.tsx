import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plane, Calendar, DollarSign, MapPin, Plus, Trash2, 
  ArrowUp, ArrowDown, ArrowRight, Sparkles, Check, Search, X 
} from 'lucide-react';
import { CityModel } from '../types';
import { api } from '../services/api';
import { CURRENCY_OPTIONS } from '../data/currencies';
import toast from 'react-hot-toast';

export const CreateTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCityId = searchParams.get('cityId');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('2026-10-18');
  const [budget, setBudget] = useState(2500);
  const [currency, setCurrency] = useState('USD');
  const [coverImage, setCoverImage] = useState('');

  const [availableCities, setAvailableCities] = useState<CityModel[]>([]);
  const [selectedCities, setSelectedCities] = useState<CityModel[]>([]);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const res = await api.cities.list();
      setAvailableCities(res.cities);

      if (initialCityId) {
        const found = res.cities.find((c) => c.id === initialCityId);
        if (found) {
          setSelectedCities([found]);
          setTitle(`${found.name} Explorer Escape`);
          setCoverImage(found.image);
        }
      }
    } catch (err: any) {
      toast.error('Failed to load cities catalog.');
    }
  };

  const handleAddCity = (city: CityModel) => {
    if (selectedCities.some((c) => c.id === city.id)) {
      handleRemoveCity(city.id);
      return;
    }
    const updated = [...selectedCities, city];
    setSelectedCities(updated);
    if (!coverImage) setCoverImage(city.image);
    if (!title) setTitle(`${city.name} Vacation`);
  };

  const handleRemoveCity = (cityId: string) => {
    setSelectedCities(selectedCities.filter((c) => c.id !== cityId));
  };

  const handleMoveCity = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= selectedCities.length) return;
    const copy = [...selectedCities];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setSelectedCities(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date cannot be earlier than start date.');
      return;
    }

    if (selectedCities.length === 0) {
      toast.error('Please add at least one destination city to your itinerary.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.trips.create({
        title,
        description,
        startDate,
        endDate,
        budget: Number(budget),
        currency,
        coverImage: coverImage || selectedCities[0]?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        cityIds: selectedCities.map((c) => c.id),
      });

      toast.success('Trip created successfully! 🗺️');
      navigate(`/app/trips/${res.trip.id}/builder`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create trip.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCities = availableCities.filter((c) => {
    const matchesQuery = !citySearchQuery ||
      c.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(citySearchQuery.toLowerCase());
    const matchesContinent = selectedContinent === 'All' || c.continent === selectedContinent;
    return matchesQuery && matchesContinent;
  });

  const continents = ['All', 'Europe', 'Asia', 'North America', 'Middle East'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c5d6e] bg-[#e3e2f7] px-3 py-1 rounded-full inline-block mb-2">
          New Itinerary
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
          Plan a Personalized Multi-City Trip
        </h1>
        <p className="text-xs sm:text-sm text-[#5c5d6e] mt-1 font-medium">
          Set your journey dates, target budget, and select the sequence of cities for your bespoke itinerary.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Trip Overview Details */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e5e5ea] shadow-xs space-y-6">
          <h3 className="text-lg font-black text-black tracking-tight">1. Trip Essentials</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-black mb-1.5">
                Trip Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Grand Autumn Tour across Europe"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl px-4 py-3 text-xs sm:text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl px-4 py-3 text-xs text-black focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl px-4 py-3 text-xs text-black focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">
                Estimated Budget
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl px-4 py-3 text-xs text-black focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl px-4 py-3 text-xs text-black font-semibold focus:outline-none focus:border-black"
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-black mb-1.5">
                Trip Description (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Notes about travel companions, highlights, or accommodation goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl px-4 py-3 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-black font-medium resize-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Destination Cities Route Builder - EXPANDED */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e5e5ea] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-black tracking-tight">2. Destination Stops &amp; Route</h3>
              <p className="text-xs text-gray-500 mt-0.5">Select and reorder the cities in your travel plan.</p>
            </div>
            <span className="text-xs font-extrabold bg-[#e3e2f7] text-black px-3.5 py-1.5 rounded-full w-fit">
              {selectedCities.length} Cities in Route
            </span>
          </div>

          {/* Selected Cities Timeline Order */}
          {selectedCities.length > 0 && (
            <div className="space-y-2.5 p-4 bg-[#f9f9fb] rounded-2xl border border-gray-200">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                Itinerary Route Sequence (Drag & Reorder):
              </span>
              {selectedCities.map((city, idx) => (
                <div
                  key={city.id}
                  className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-black text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img src={city.image} alt={city.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-black truncate">{city.name}</p>
                      <p className="text-[10px] text-gray-500">{city.country} • {city.continent}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveCity(idx, 'up')}
                      className="p-1.5 text-gray-400 hover:text-black disabled:opacity-30 cursor-pointer bg-gray-50 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === selectedCities.length - 1}
                      onClick={() => handleMoveCity(idx, 'down')}
                      className="p-1.5 text-gray-400 hover:text-black disabled:opacity-30 cursor-pointer bg-gray-50 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveCity(city.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer ml-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Remove stop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add City Selector - EXPANDED IMAGE CATALOG */}
          <div className="space-y-4 pt-2">
            {/* Search & Continent Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search city catalog by name or country..."
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-black font-medium"
                />
              </div>

              {/* Continent Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {continents.map((cont) => (
                  <button
                    key={cont}
                    type="button"
                    onClick={() => setSelectedContinent(cont)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedContinent === cont
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-[#f3f3f6] text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cont}
                  </button>
                ))}
              </div>
            </div>

            {/* EXPANDED City Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-1">
              {filteredCities.map((city) => {
                const isSelected = selectedCities.some((c) => c.id === city.id);

                return (
                  <div
                    key={city.id}
                    onClick={() => handleAddCity(city)}
                    className={`rounded-3xl border overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-lg ${
                      isSelected
                        ? 'border-black bg-black text-white ring-2 ring-black'
                        : 'border-[#e5e5ea] bg-white text-black hover:border-black'
                    }`}
                  >
                    {/* Large High-Res City Cover Image */}
                    <div className="h-36 sm:h-40 w-full relative overflow-hidden bg-gray-100">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                          {city.continent}
                        </span>
                        <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-extrabold px-2 py-0.5 rounded-lg">
                          ★ {city.popularity.toFixed(1)}
                        </span>
                      </div>

                      {/* Bottom Title on Image */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <h4 className="text-base font-black leading-tight drop-shadow-sm">{city.name}</h4>
                        <p className="text-[11px] text-gray-200 font-medium drop-shadow-sm">{city.country}</p>
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white z-20">
                          <div className="bg-white text-black rounded-full p-2 shadow-lg flex items-center gap-1 text-xs font-black px-3 py-1.5">
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>In Route</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-3 bg-white flex items-center justify-between gap-2 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-gray-500">
                        Cost: <span className="font-mono text-emerald-600 font-extrabold">{'$'.repeat(city.costIndex)}</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddCity(city);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-black text-white hover:bg-neutral-800'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <X className="w-3 h-3" />
                            <span>Remove</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Add Stop</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/app/trips')}
            className="px-6 py-3 rounded-2xl text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white hover:bg-neutral-800 active:scale-95 px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-50"
          >
            <span>{submitting ? 'Creating...' : 'Create Trip & Open Builder'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
