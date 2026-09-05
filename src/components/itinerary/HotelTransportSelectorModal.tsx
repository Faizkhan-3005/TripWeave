import React, { useState, useEffect } from 'react';
import { 
  X, Building2, Plane, Star, Check, DollarSign, Clock, ShieldCheck, 
  MapPin, Wifi, Coffee, Sparkles, Filter, ChevronRight, Info, Award
} from 'lucide-react';
import { HotelModel, TransportModel, TripStopModel } from '../../types';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface HotelTransportSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stop: TripStopModel | null;
  tripId: string;
  onUpdated: () => void;
}

export const HotelTransportSelectorModal: React.FC<HotelTransportSelectorModalProps> = ({
  isOpen,
  onClose,
  stop,
  tripId,
  onUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'hotel' | 'transport'>('hotel');
  const [hotels, setHotels] = useState<HotelModel[]>([]);
  const [transports, setTransports] = useState<TransportModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Filters
  const [minRating, setMinRating] = useState<number>(0);
  const [maxHotelPrice, setMaxHotelPrice] = useState<number>(1000);
  const [transportType, setTransportType] = useState<string>('all');
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(stop?.hotelId || null);
  const [selectedTransportId, setSelectedTransportId] = useState<string | null>(stop?.transportToNextId || null);

  useEffect(() => {
    if (isOpen && stop) {
      setSelectedHotelId(stop.hotelId || null);
      setSelectedTransportId(stop.transportToNextId || null);
      fetchOptions();
    }
  }, [isOpen, stop]);

  const fetchOptions = async () => {
    if (!stop) return;
    setLoading(true);
    try {
      // Fetch hotels for this stop's city
      const [hotelsRes, transportsRes] = await Promise.all([
        api.hotels.list({ cityId: stop.cityId }).catch(() => ({ hotels: [] })),
        api.transport.list({ fromCityId: stop.cityId }).catch(() => ({ transports: [] })),
      ]);
      setHotels(hotelsRes.hotels || []);
      setTransports(transportsRes.transports || []);
    } catch (err: any) {
      toast.error('Failed to load logistics options.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !stop) return null;

  const handleSaveHotel = async (hotelId: string | null) => {
    setSaving(true);
    try {
      await api.stops.update(tripId, stop.id, { hotelId });
      setSelectedHotelId(hotelId);
      toast.success(hotelId ? 'Accommodation attached to stop!' : 'Hotel unlinked.');
      onUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update hotel.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTransport = async (transportId: string | null) => {
    setSaving(true);
    try {
      await api.stops.update(tripId, stop.id, { transportToNextId: transportId });
      setSelectedTransportId(transportId);
      toast.success(transportId ? 'Transit attached to departure route!' : 'Transit unlinked.');
      onUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update transport.');
    } finally {
      setSaving(false);
    }
  };

  // Filtered lists
  const filteredHotels = hotels.filter((h) => {
    if (h.starRating < minRating) return false;
    if (h.pricePerNight > maxHotelPrice) return false;
    return true;
  });

  const filteredTransports = transports.filter((t) => {
    if (transportType !== 'all' && t.type !== transportType) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl border border-gray-200 overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#18181b] text-white p-6 px-8 flex items-center justify-between border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-white flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                {stop.city?.name || 'Current Stop'}, {stop.city?.country || ''}
              </span>
              <span className="text-xs text-gray-400">Stop #{stop.orderIndex + 1} Logistics</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Select Accommodation &amp; Departure Transit
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Compare verified operator vendors, room rates, and carrier connections for this destination.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#fafafa] border-b border-gray-200 px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('hotel')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'hotel'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:text-black'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Hotels &amp; Resorts ({filteredHotels.length})
            </button>
            <button
              onClick={() => setActiveTab('transport')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'transport'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:text-black'
              }`}
            >
              <Plane className="w-4 h-4" />
              Departure Transit ({filteredTransports.length})
            </button>
          </div>

          {/* Quick Stats Ticker */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500 font-medium">
            {stop.hotel && (
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 font-semibold">
                <Check className="w-3 h-3" /> Hotel: {stop.hotel.name} (${stop.hotel.pricePerNight}/nt)
              </span>
            )}
            {stop.transportToNext && (
              <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60 font-semibold">
                <Check className="w-3 h-3" /> {stop.transportToNext.type.toUpperCase()}: {stop.transportToNext.operatorName} (${stop.transportToNext.price})
              </span>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-white">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Scanning verified supplier inventory...
              </p>
            </div>
          ) : activeTab === 'hotel' ? (
            <div>
              {/* Hotel Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#fafafa] border border-gray-200/70 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Filter className="w-3 h-3 text-black" /> Filter By:
                  </span>
                  <div className="flex items-center gap-1">
                    {[0, 3, 4, 5].map((stars) => (
                      <button
                        key={stars}
                        onClick={() => setMinRating(stars)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                          minRating === stars
                            ? 'bg-amber-400 text-black border-amber-500 shadow-xs'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {stars === 0 ? 'All Ratings' : `${stars}+ ★`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <span>Max Nightly Rate:</span>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="25"
                    value={maxHotelPrice}
                    onChange={(e) => setMaxHotelPrice(Number(e.target.value))}
                    className="w-28 accent-black cursor-pointer"
                  />
                  <span className="font-mono font-bold text-black">${maxHotelPrice}</span>
                </div>
              </div>

              {/* Hotel Cards Grid */}
              {filteredHotels.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-gray-800">No Accommodations Found</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                    Try adjusting your star rating or price filter to view more partner hotels in this city.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredHotels.map((hotel) => {
                    const isSelected = selectedHotelId === hotel.id;
                    return (
                      <div
                        key={hotel.id}
                        className={`rounded-3xl border transition-all overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'border-black ring-2 ring-black/10 bg-amber-50/20 shadow-md'
                            : 'border-gray-200/90 bg-white hover:border-gray-400 shadow-xs'
                        }`}
                      >
                        <div>
                          {/* Image & Badges */}
                          <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                            <img
                              src={
                                hotel.image ||
                                'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
                              }
                              alt={hotel.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                              <span className="px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-white text-[11px] font-black flex items-center gap-1 shadow-xs">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {hotel.starRating} Stars
                              </span>
                              {hotel.vendor?.isVerified && (
                                <span className="px-2 py-1 rounded-xl bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                                  <ShieldCheck className="w-3 h-3" /> Verified Partner
                                </span>
                              )}
                            </div>
                            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl border border-white/40 shadow-sm">
                              <span className="text-sm font-black text-black font-mono">
                                ${hotel.pricePerNight}
                              </span>
                              <span className="text-[10px] font-medium text-gray-500"> / night</span>
                            </div>
                          </div>

                          {/* Hotel Body Info */}
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-base font-bold text-black tracking-tight leading-snug">
                                {hotel.name}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              {hotel.address || `${hotel.city?.name || 'City Center'}, ${hotel.city?.country || ''}`}
                            </p>

                            {/* Amenities Chips */}
                            {hotel.amenities && hotel.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] font-bold bg-[#f3f4f6] text-gray-700 px-2 py-0.5 rounded-md"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                                {hotel.amenities.length > 4 && (
                                  <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">
                                    +{hotel.amenities.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}

                            {hotel.description && (
                              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                {hotel.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="p-5 pt-0 mt-2">
                          {isSelected ? (
                            <div className="flex items-center gap-2">
                              <span className="flex-1 py-2 text-center rounded-xl bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-amber-400" /> Selected for this Stop
                              </span>
                              <button
                                disabled={saving}
                                onClick={() => handleSaveHotel(null)}
                                className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                              >
                                Unlink
                              </button>
                            </div>
                          ) : (
                            <button
                              disabled={saving}
                              onClick={() => handleSaveHotel(hotel.id)}
                              className="w-full py-2.5 rounded-xl bg-[#f0f0f3] hover:bg-black hover:text-white text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              Select &amp; Attach to Stop
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Transport Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#fafafa] border border-gray-200/70 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Filter className="w-3 h-3 text-black" /> Mode:
                  </span>
                  {['all', 'flight', 'train', 'bus', 'car_rental'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setTransportType(mode)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold border capitalize transition-colors ${
                        transportType === mode
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {mode === 'all' ? 'All Transit' : mode.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  Connecting departures departing from <strong>{stop.city?.name}</strong>
                </div>
              </div>

              {/* Transport Cards List */}
              {filteredTransports.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl">
                  <Plane className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-gray-800">No Departure Transit Options</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                    No scheduled transit routes are registered departing from {stop.city?.name}. You can also browse local taxis or rentals.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransports.map((trans) => {
                    const isSelected = selectedTransportId === trans.id;
                    return (
                      <div
                        key={trans.id}
                        className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-black ring-2 ring-black/10 bg-blue-50/20 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-400 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200/80 flex items-center justify-center flex-shrink-0">
                            {trans.type === 'flight' && <Plane className="w-6 h-6 text-indigo-600" />}
                            {trans.type === 'train' && <Building2 className="w-6 h-6 text-emerald-600" />}
                            {trans.type === 'bus' && <Building2 className="w-6 h-6 text-amber-600" />}
                            {trans.type === 'car_rental' && <Building2 className="w-6 h-6 text-rose-600" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                                {trans.type.replace('_', ' ')}
                              </span>
                              <span className="text-xs font-bold text-black">{trans.operatorName}</span>
                              {trans.vendor?.isVerified && (
                                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                                  <ShieldCheck className="w-3 h-3" /> Verified
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-bold text-black mt-1 flex items-center gap-2">
                              <span>{trans.departureTime}</span>
                              <ChevronRight className="w-3 h-3 text-gray-400" />
                              <span>{trans.arrivalTime}</span>
                              <span className="text-xs font-medium text-gray-400">
                                ({trans.durationHours}h transit)
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              From <strong>{trans.fromCity?.name || 'Current City'}</strong> to <strong>{trans.toCity?.name || 'Next Destination'}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                          <div className="text-right">
                            <span className="text-lg font-black text-black font-mono">${trans.price}</span>
                            <span className="text-[10px] text-gray-500 block font-medium">per passenger</span>
                          </div>

                          {isSelected ? (
                            <div className="flex items-center gap-2">
                              <span className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold flex items-center gap-1">
                                <Check className="w-3 h-3 text-blue-400" /> Selected
                              </span>
                              <button
                                disabled={saving}
                                onClick={() => handleSaveTransport(null)}
                                className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                              >
                                Unlink
                              </button>
                            </div>
                          ) : (
                            <button
                              disabled={saving}
                              onClick={() => handleSaveTransport(trans.id)}
                              className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
                            >
                              Choose Route
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#fafafa] border-t border-gray-200 px-8 py-4 flex items-center justify-between">
          <span className="text-xs text-gray-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-gray-400" />
            Selected accommodation and transit totals are automatically added to your trip cost ticker.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
