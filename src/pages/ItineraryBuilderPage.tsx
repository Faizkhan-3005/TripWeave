import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Calendar, Clock, DollarSign, MapPin, Trash2, 
  ArrowUp, ArrowDown, Search, Check, Sparkles, Share2, 
  Download, Tag, CheckCircle2, ChevronRight, X, Edit2, 
  BarChart3, Compass, FileSpreadsheet, Map as MapIcon, Luggage,
  FileText, Wand2, Loader2, Paperclip
} from 'lucide-react';
import { TripModel, TripActivityModel, ActivityModel, CityModel, AiItinerarySuggestion } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { TripRouteMap } from '../components/common/TripRouteMap';
import { WeatherWidget } from '../components/common/WeatherWidget';
import { PackingListTab } from '../components/common/PackingListTab';
import { exportTripPdf } from '../services/pdfGenerator';


export const ItineraryBuilderPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<TripModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [activeMainTab, setActiveMainTab] = useState<'builder' | 'packing'>('builder');
  const [exporting, setExporting] = useState<boolean>(false);
  const [exportingPdf, setExportingPdf] = useState<boolean>(false);

  // AI Itinerary Suggestion State
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<AiItinerarySuggestion[]>([]);
  const [selectedAiIndices, setSelectedAiIndices] = useState<number[]>([]);
  const [applyingAi, setApplyingAi] = useState<boolean>(false);

  // Activity Discovery Modal State
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<'catalog' | 'custom'>('catalog');
  const [availableActivities, setAvailableActivities] = useState<ActivityModel[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Custom Activity Form
  const [customTitle, setCustomTitle] = useState('');
  const [customTime, setCustomTime] = useState('10:00');
  const [customCost, setCustomCost] = useState(50);
  const [customCategory, setCustomCategory] = useState('Sightseeing');
  const [customNotes, setCustomNotes] = useState('');
  const [selectedStopId, setSelectedStopId] = useState<string>('');

  // Add Stop Modal State
  const [stopModalOpen, setStopModalOpen] = useState<boolean>(false);
  const [allCities, setAllCities] = useState<CityModel[]>([]);
  const [selectedNewCityId, setSelectedNewCityId] = useState<string>('');

  useEffect(() => {
    if (tripId) {
      loadTripData(tripId);
    }
  }, [tripId]);

  const loadTripData = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.trips.get(id);
      setTrip(res.trip);
      if (res.trip.stops.length > 0 && !selectedStopId) {
        setSelectedStopId(res.trip.stops[0].id);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load itinerary.');
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogActivities = async () => {
    try {
      const res = await api.activities.list({
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchFilter || undefined,
      });
      setAvailableActivities(res.activities);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (addModalOpen) {
      loadCatalogActivities();
    }
  }, [addModalOpen, categoryFilter, searchFilter]);

  const handleAddCatalogActivity = async (act: ActivityModel) => {
    if (!trip) return;

    try {
      await api.activities.addToTrip(trip.id, {
        activityId: act.id,
        tripStopId: selectedStopId || trip.stops[0]?.id,
        dayNumber: activeDay,
        scheduledTime: '10:00',
        estimatedCost: act.cost,
        category: act.category,
        customTitle: act.name,
      });
      toast.success(`Added "${act.name}" to Day ${activeDay}!`);
      setAddModalOpen(false);
      loadTripData(trip.id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add activity.');
    }
  };

  const handleAddCustomActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip || !customTitle) return;

    try {
      await api.activities.addToTrip(trip.id, {
        tripStopId: selectedStopId || trip.stops[0]?.id,
        dayNumber: activeDay,
        scheduledTime: customTime,
        estimatedCost: Number(customCost),
        category: customCategory,
        customTitle,
        notes: customNotes,
      });
      toast.success(`Added "${customTitle}" to Day ${activeDay}!`);
      setCustomTitle('');
      setCustomNotes('');
      setAddModalOpen(false);
      loadTripData(trip.id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add custom activity.');
    }
  };

  const handleRemoveActivity = async (activityId: string) => {
    if (!trip) return;
    try {
      await api.activities.removeFromTrip(trip.id, activityId);
      toast.success('Activity removed from itinerary.');
      loadTripData(trip.id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove activity.');
    }
  };

  const handleToggleComplete = async (act: TripActivityModel) => {
    if (!trip) return;
    try {
      await api.activities.updateInTrip(trip.id, act.id, {
        isCompleted: !act.isCompleted,
      });
      loadTripData(trip.id);
    } catch (err: any) {
      toast.error('Failed to update status.');
    }
  };

  const handleMoveActivity = async (dayActivities: TripActivityModel[], index: number, direction: 'up' | 'down') => {
    if (!trip) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= dayActivities.length) return;

    const copy = [...dayActivities];
    const item = copy.splice(index, 1)[0];
    copy.splice(targetIdx, 0, item);

    const reorderedPayload = copy.map((a, idx) => ({
      id: a.id,
      dayNumber: activeDay,
      orderIndex: idx,
    }));

    try {
      await api.activities.reorderInTrip(trip.id, reorderedPayload);
      loadTripData(trip.id);
    } catch (err: any) {
      toast.error('Failed to reorder activities.');
    }
  };

  const handleOpenAddStopModal = async () => {
    try {
      const res = await api.cities.list();
      setAllCities(res.cities);
      setStopModalOpen(true);
    } catch (err: any) {
      toast.error('Failed to load cities.');
    }
  };

  const handleAddStop = async () => {
    if (!trip || !selectedNewCityId) return;
    try {
      await api.stops.add(trip.id, { cityId: selectedNewCityId });
      toast.success('New city stop added to route!');
      setStopModalOpen(false);
      loadTripData(trip.id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add stop.');
    }
  };

  const handleRemoveStop = async (stopId: string) => {
    if (!trip) return;
    if (!window.confirm('Remove this city stop from your route?')) return;
    try {
      await api.stops.remove(trip.id, stopId);
      toast.success('Stop removed.');
      loadTripData(trip.id);
    } catch (err: any) {
      toast.error('Failed to remove stop.');
    }
  };

  if (loading || !trip) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Group activities by Day
  const totalDays = trip.durationDays || 7;
  const daysList = Array.from({ length: totalDays }, (_, i) => i + 1);

  const activitiesForActiveDay = (trip.tripActivities || [])
    .filter((a) => a.dayNumber === activeDay)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const totalEstimatedCost = (trip.tripActivities || []).reduce(
    (acc, a) => acc + (a.estimatedCost || 0),
    0
  );

  const handleExportCsv = async () => {
    if (!trip) return;
    setExporting(true);
    try {
      await api.trips.downloadTripCsv(trip.id, trip.title);
      toast.success('Itinerary CSV downloaded! 📊');
    } catch (err: any) {
      toast.error(err.message || 'Failed to export CSV.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPdf = () => {
    if (!trip) return;
    setExportingPdf(true);
    try {
      exportTripPdf(trip);
      toast.success('Printable PDF Travel Guide downloaded!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to export PDF.');
    } finally {
      setExportingPdf(false);
    }
  };

  const handleOpenAiModal = async () => {
    if (!trip) return;
    setAiModalOpen(true);
    setAiLoading(true);
    try {
      const res = await api.ai.suggest(trip.id);
      setAiSuggestions(res.suggestions);
      setSelectedAiIndices(res.suggestions.map((_, i) => i)); // Select all by default
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch AI suggestions.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAi = async () => {
    if (!trip || selectedAiIndices.length === 0) return;
    setApplyingAi(true);
    try {
      const selected = selectedAiIndices.map((i) => aiSuggestions[i]);
      const res = await api.ai.apply(trip.id, selected);
      toast.success(res.message || 'AI suggestions added to your trip!');
      setAiModalOpen(false);
      loadTripData(trip.id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to apply suggestions.');
    } finally {
      setApplyingAi(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Top Header Banner */}
      <div className="bg-white rounded-[36px] p-6 sm:p-8 border border-[#e5e5ea] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-black px-2.5 py-0.5 rounded-full">
              Itinerary Builder
            </span>
            <span className="text-xs font-bold text-gray-500">
              {new Date(trip.startDate).toLocaleDateString()} &ndash; {new Date(trip.endDate).toLocaleDateString()} ({totalDays} Days)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-sans">
            {trip.title}
          </h1>

          {/* City Stops Pills with Weather */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400">Route:</span>
            {trip.stops.map((stop, idx) => (
              <div
                key={stop.id}
                className="bg-[#e3e2f7] text-black text-xs font-extrabold px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs"
              >
                <span>{idx + 1}. {stop.city.name}</span>
                <WeatherWidget cityName={stop.city.name} country={stop.city.country} />
                {trip.stops.length > 1 && (
                  <button
                    onClick={() => handleRemoveStop(stop.id)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleOpenAddStopModal}
              className="border border-dashed border-gray-400 hover:border-black text-gray-600 hover:text-black text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add City</span>
            </button>
          </div>

        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={`/app/trips/${trip.id}/view`}
            className="bg-[#e3e2f7] hover:bg-[#d5d4f0] text-black px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>View Plan</span>
          </Link>

          <Link
            to={`/app/trips/${trip.id}/budget`}
            className="bg-gray-100 hover:bg-gray-200 text-black px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Budget (${totalEstimatedCost.toLocaleString()})</span>
          </Link>

          <Link
            to={`/app/trips/${trip.id}/calendar`}
            className="bg-gray-100 hover:bg-gray-200 text-black px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </Link>

          <Link
            to={`/trips/${trip.shareSlug}`}
            target="_blank"
            className="bg-gray-100 hover:bg-gray-200 text-black px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Public Link</span>
          </Link>

          {/* 1-Click Smart AI Itinerary Generator */}
          <button
            onClick={handleOpenAiModal}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current text-yellow-300" />
            <span>AI Suggest Itinerary</span>
          </button>

          {/* Export PDF Guide */}
          <button
            onClick={handleExportPdf}
            disabled={exportingPdf}
            className="bg-black text-white hover:bg-neutral-800 active:scale-95 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{exportingPdf ? 'Exporting PDF...' : 'Export PDF Guide'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="bg-gray-100 hover:bg-gray-200 text-black active:scale-95 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          {/* Route Map Toggle */}
          <button
            onClick={() => setShowMap((p) => !p)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showMap ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{showMap ? 'Hide Map' : 'Route Map'}</span>
          </button>
        </div>
      </div>

      {/* Route Map Panel (collapsible) */}
      {showMap && (
        <div className="animate-in fade-in duration-300">
          <TripRouteMap stops={trip.stops} />
        </div>
      )}

      {/* Main Tab Switcher: Builder vs Packing */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveMainTab('builder')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'builder' ? 'bg-black text-white' : 'bg-white border border-[#e5e5ea] text-gray-600 hover:border-gray-400'
          }`}
        >
          <Compass className="w-3.5 h-3.5" /> Itinerary Builder
        </button>
        <button
          onClick={() => setActiveMainTab('packing')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMainTab === 'packing' ? 'bg-black text-white' : 'bg-white border border-[#e5e5ea] text-gray-600 hover:border-gray-400'
          }`}
        >
          <Luggage className="w-3.5 h-3.5" /> Packing Checklist
        </button>
      </div>

      {/* 2. Main Content: Itinerary Builder OR Packing Checklist */}
      {activeMainTab === 'packing' ? (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e5e5ea] shadow-xs">
          <PackingListTab tripId={trip.id} />
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Day Selector Timeline Tabs */}
        <div className="lg:col-span-4 bg-white rounded-[32px] p-5 border border-[#e5e5ea] shadow-xs space-y-2">
          <div className="flex items-center justify-between px-2 mb-3">
            <h3 className="text-sm font-black text-black uppercase tracking-wider">
              Day Breakdown
            </h3>
            <span className="text-xs font-bold text-gray-500">
              {trip.tripActivities?.length || 0} Total Activities
            </span>
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {daysList.map((dayNum) => {
              const dayActs = (trip.tripActivities || []).filter((a) => a.dayNumber === dayNum);
              const dayCost = dayActs.reduce((s, a) => s + (a.estimatedCost || 0), 0);
              const isSelected = activeDay === dayNum;

              return (
                <button
                  key={dayNum}
                  onClick={() => setActiveDay(dayNum)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-black text-white shadow-md font-bold'
                      : 'bg-[#f9f9fb] hover:bg-[#f0f0f4] text-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center ${
                      isSelected ? 'bg-white text-black' : 'bg-[#e3e2f7] text-black'
                    }`}>
                      {dayNum}
                    </span>
                    <div>
                      <p className="text-xs font-bold">Day {dayNum}</p>
                      <p className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        {dayActs.length} scheduled {dayActs.length === 1 ? 'activity' : 'activities'}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold">
                    {dayCost > 0 ? `$${dayCost.toLocaleString()}` : '$0'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Day Activities Timeline */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Day Header Bar */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5e5ea] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Scheduled Timeline
              </span>
              <h2 className="text-xl font-black text-black">
                Day {activeDay} Schedule
              </h2>
            </div>

            <button
              onClick={() => setAddModalOpen(true)}
              className="bg-black text-white hover:bg-neutral-800 active:scale-95 px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Activity</span>
            </button>
          </div>

          {/* Activities List */}
          {activitiesForActiveDay.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 border border-[#e5e5ea] text-center space-y-3">
              <Compass className="w-10 h-10 text-gray-300 mx-auto" />
              <h4 className="text-sm font-bold text-black">No activities planned for Day {activeDay}</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Explore recommended sightseeing tours, food walks, and experiences, or create your own custom event.
              </p>
              <button
                onClick={() => setAddModalOpen(true)}
                className="bg-black text-white px-5 py-2.5 rounded-2xl text-xs font-bold inline-flex items-center gap-1.5 mt-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Activity</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activitiesForActiveDay.map((act, idx) => (
                <div
                  key={act.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                    act.isCompleted ? 'border-emerald-300 bg-emerald-50/30' : 'border-[#e5e5ea] hover:border-black'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Completion Checkbox Button */}
                    <button
                      onClick={() => handleToggleComplete(act)}
                      title="Mark as completed"
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                        act.isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-gray-300 hover:border-black text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold bg-[#e3e2f7] text-black px-2 py-0.5 rounded-md flex items-center gap-1">
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

                      <h4 className={`text-sm font-extrabold text-black ${act.isCompleted ? 'line-through text-gray-400' : ''}`}>
                        {act.customTitle || act.activity?.name}
                      </h4>

                      {act.notes && (
                        <p className="text-xs text-gray-500 mt-1">{act.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Cost */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <span className="text-xs font-black text-black">
                      ${(act.estimatedCost || 0).toLocaleString()}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMoveActivity(activitiesForActiveDay, idx, 'up')}
                        title="Move Up"
                        className="p-1 text-gray-400 hover:text-black disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === activitiesForActiveDay.length - 1}
                        onClick={() => handleMoveActivity(activitiesForActiveDay, idx, 'down')}
                        title="Move Down"
                        className="p-1 text-gray-400 hover:text-black disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveActivity(act.id)}
                        title="Delete Activity"
                        className="p-1 text-gray-400 hover:text-red-600 cursor-pointer ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      )}

      {/* 3. ACTIVITY DISCOVERY MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-[36px] p-6 sm:p-8 border border-gray-200 shadow-2xl relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  Day {activeDay}
                </span>
                <h3 className="text-xl font-black text-black">Add Activity to Itinerary</h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="flex gap-2 my-4">
              <button
                onClick={() => setModalTab('catalog')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'catalog' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Explore City Catalog
              </button>
              <button
                onClick={() => setModalTab('custom')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'custom' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Create Custom Event
              </button>
            </div>

            {/* TAB 1: CATALOG ACTIVITIES */}
            {modalTab === 'catalog' ? (
              <div className="flex-grow flex flex-col min-h-0 space-y-3">
                {/* Search & Category Filter */}
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-black font-semibold focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Food">Food &amp; Dining</option>
                    <option value="Culture">Culture &amp; Art</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Nature">Nature</option>
                  </select>
                </div>

                {/* Activity Catalog Items */}
                <div className="flex-grow overflow-y-auto space-y-2 pr-1 min-h-[260px]">
                  {availableActivities.length === 0 ? (
                    <div className="text-center py-10 text-xs text-gray-400">
                      No activities found. Try searching another term or create a custom event!
                    </div>
                  ) : (
                    availableActivities.map((act) => (
                      <div
                        key={act.id}
                        className="bg-gray-50 hover:bg-[#e3e2f7]/40 p-3 rounded-2xl border border-gray-200 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-extrabold uppercase text-gray-600 bg-white px-2 py-0.5 rounded">
                              {act.category}
                            </span>
                            {act.city && (
                              <span className="text-[10px] text-gray-500 font-bold">
                                {act.city.name}
                              </span>
                            )}
                          </div>
                          <h5 className="font-extrabold text-xs text-black truncate">{act.name}</h5>
                          <p className="text-[10px] text-gray-500 line-clamp-1">{act.description}</p>
                        </div>

                        <div className="text-right shrink-0 flex items-center gap-3">
                          <span className="text-xs font-black text-black">${act.cost}</span>
                          <button
                            onClick={() => handleAddCatalogActivity(act)}
                            className="bg-black text-white hover:bg-neutral-800 px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-colors"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* TAB 2: CUSTOM ACTIVITY FORM */
              <form onSubmit={handleAddCustomActivity} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Event / Activity Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunset drinks at Sky Bar or Museum Visit"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-black mb-1">Scheduled Time</label>
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">Estimated Cost ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={customCost}
                      onChange={(e) => setCustomCost(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-medium"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-black mb-1">Category</label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-medium"
                    >
                      <option value="Sightseeing">Sightseeing</option>
                      <option value="Food">Food &amp; Dining</option>
                      <option value="Culture">Culture &amp; Art</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Nature">Nature</option>
                      <option value="Nightlife">Nightlife</option>
                      <option value="Transport">Transport</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Notes / Address (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Reservation details, address, meeting point..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-black focus:outline-none focus:border-black font-medium resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
                  >
                    Add to Day {activeDay}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 4. ADD CITY STOP MODAL */}
      {stopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-[36px] p-6 sm:p-8 border border-gray-200 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-black text-black">Add Destination Stop</h3>
              <button
                onClick={() => setStopModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Select Destination City</label>
                <select
                  value={selectedNewCityId}
                  onChange={(e) => setSelectedNewCityId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-black font-medium focus:outline-none focus:border-black"
                >
                  <option value="">-- Choose a city --</option>
                  {allCities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}, {c.country} ({c.continent})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStopModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedNewCityId}
                  onClick={handleAddStop}
                  className="bg-black text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                  Add Stop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SMART AI SUGGEST ITINERARY MODAL */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[36px] border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 fill-current text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black flex items-center gap-2">
                    <span>AI Itinerary Assistant</span>
                    <span className="bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Gemini Powered</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Recommended daily activity sequence for {trip.title} ({trip.durationDays || 7} Days)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAiModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-500 hover:text-black cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content / List of Suggestions */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {aiLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                  <p className="text-xs font-bold text-gray-600">Generating optimal travel sequence...</p>
                </div>
              ) : aiSuggestions.length === 0 ? (
                <div className="py-16 text-center text-xs text-gray-500">
                  No suggestions available. Try adding destination cities first.
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-xs font-bold text-gray-600">
                      Select which recommended experiences to add:
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedAiIndices.length === aiSuggestions.length) {
                          setSelectedAiIndices([]);
                        } else {
                          setSelectedAiIndices(aiSuggestions.map((_, i) => i));
                        }
                      }}
                      className="text-xs font-bold text-violet-600 hover:underline"
                    >
                      {selectedAiIndices.length === aiSuggestions.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {aiSuggestions.map((item, idx) => {
                      const isSelected = selectedAiIndices.includes(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedAiIndices((prev) =>
                              isSelected ? prev.filter((i) => i !== idx) : [...prev, idx]
                            );
                          }}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'bg-violet-50/60 border-violet-300 shadow-2xs'
                              : 'bg-[#fafafa] border-gray-200 hover:border-gray-300 opacity-60'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // Controlled by container click
                            className="mt-1 w-4 h-4 rounded accent-violet-600 cursor-pointer"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                                Day {item.dayNumber}
                              </span>
                              <span className="text-[10px] font-bold text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-150 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> {item.scheduledTime}
                              </span>
                              <span className="text-[10px] font-bold text-violet-700 bg-violet-100/70 px-2 py-0.5 rounded">
                                {item.category}
                              </span>
                              <span className="text-[10px] font-medium text-gray-500">
                                {item.cityName}
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-black">{item.title}</h4>
                            <p className="text-[11px] text-gray-500 mt-0.5">{item.reason}</p>
                          </div>

                          <span className="text-xs font-extrabold text-black shrink-0">
                            ${item.estimatedCost}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-gray-600">
                {selectedAiIndices.length} of {aiSuggestions.length} activities selected
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAiModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={selectedAiIndices.length === 0 || applyingAi}
                  onClick={handleApplyAi}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {applyingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  <span>{applyingAi ? 'Applying...' : 'Apply to Itinerary'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
