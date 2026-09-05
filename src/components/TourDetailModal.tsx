import React, { useState } from 'react';
import { 
  X, MapPin, Calendar, Clock, Building2, Star, CheckCircle, 
  ChevronDown, ChevronUp, ShieldCheck, Heart, Ticket, CreditCard, Sparkles, ArrowRight
} from 'lucide-react';
import { Tour, Booking, User } from '../types';

interface TourDetailModalProps {
  tour: Tour | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (tourId: string) => void;
  user: User | null;
  onBookTourSuccess: (booking: Booking) => void;
  onOpenAuth: () => void;
}

export const TourDetailModal: React.FC<TourDetailModalProps> = ({
  tour,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  user,
  onBookTourSuccess,
  onOpenAuth
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'booking'>('overview');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [promoCode, setPromoCode] = useState<string>('ESCAPE2026');
  const [promoApplied, setPromoApplied] = useState<boolean>(true);
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen || !tour) return null;

  const basePrice = tour.price * guests;
  const discountAmount = promoApplied ? 200 * guests : 0;
  const totalPrice = Math.max(0, basePrice - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ESCAPE2026' || promoCode.trim().toUpperCase() === 'GLOBE') {
      setPromoApplied(true);
    } else {
      setPromoApplied(false);
    }
  };

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    const departure = selectedDate || tour.departureDates[0];
    const bookingRef = `GT-${Math.floor(10000 + Math.random() * 90000)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        tourId: tour.id,
        tourTitle: `${tour.title} Escape Tour`,
        tourImage: tour.image,
        country: tour.country,
        departureDate: departure,
        guestsCount: guests,
        totalPrice: totalPrice,
        status: 'Confirmed',
        bookingRef: bookingRef,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setConfirmedBooking(newBooking);
      onBookTourSuccess(newBooking);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-[36px] shadow-2xl border border-[#dadada] overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            setConfirmedBooking(null);
            onClose();
          }}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 text-black hover:bg-black hover:text-white flex items-center justify-center transition-all z-30 shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Banner */}
        <div className="relative h-64 sm:h-72 w-full shrink-0">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top Left Wishlist */}
          <button
            onClick={() => onToggleSave(tour.id)}
            className={`absolute top-5 left-5 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer ${
              isSaved ? 'bg-black text-white' : 'bg-white/90 text-black hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-400' : ''}`} />
            <span>{isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
          </button>

          {/* Bottom Banner Content */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row justify-between sm:items-end gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  {tour.continent} &bull; {tour.country}
                </span>
                <span className="text-xs font-bold bg-amber-400 text-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {tour.rating} ({tour.reviewsCount} reviews)
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight">
                {tour.title}
              </h2>
            </div>

            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
              <span className="text-[11px] text-gray-300 block uppercase font-medium">Partner Rate</span>
              <span className="text-2xl font-bold text-white">${tour.price.toLocaleString()}</span>
              <span className="text-xs text-gray-300"> / {tour.durationDays} days</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#dadada]/60 bg-[#f9f9f9] px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-black text-black bg-white'
                : 'border-transparent text-[#5c5d6e] hover:text-black'
            }`}
          >
            Overview &amp; Highlights
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'itinerary'
                ? 'border-black text-black bg-white'
                : 'border-transparent text-[#5c5d6e] hover:text-black'
            }`}
          >
            Day-by-Day ({tour.itinerary.length} Days)
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'booking'
                ? 'border-black text-black bg-white'
                : 'border-transparent text-[#5c5d6e] hover:text-black'
            }`}
          >
            Instant 2-Click Booking
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
          {confirmedBooking ? (
            /* Booking Confirmed State */
            <div className="text-center py-6 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#e3e2f7] flex items-center justify-center text-black border border-[#c5c5d9]">
                <CheckCircle className="w-8 h-8 text-black" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Booking Confirmed &bull; Ref #{confirmedBooking.bookingRef}
                </span>
                <h3 className="text-3xl font-bold text-black mt-2 font-sans">
                  Pack Your Bags for {tour.title}!
                </h3>
                <p className="text-sm text-[#5c5d6e] max-w-md mx-auto mt-1">
                  Your reservation for {confirmedBooking.guestsCount} guest(s) starting on {confirmedBooking.departureDate} is secured.
                </p>
              </div>

              <div className="bg-[#f3f3f4] rounded-2xl p-6 w-full max-w-md text-left text-sm border border-[#dadada]/60 my-2">
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <span className="text-[#5c5d6e]">Destination:</span>
                  <span className="font-bold text-black">{tour.title}, {tour.country}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <span className="text-[#5c5d6e]">Departure Date:</span>
                  <span className="font-bold text-black">{confirmedBooking.departureDate}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <span className="text-[#5c5d6e]">Guests:</span>
                  <span className="font-bold text-black">{confirmedBooking.guestsCount} Traveler(s)</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-black text-base pt-2">
                  <span>Total Paid:</span>
                  <span>${confirmedBooking.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setConfirmedBooking(null);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
                >
                  View in My Bookings
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">About this Escape</h3>
                    <p className="text-sm text-[#5c5d6e] leading-relaxed">
                      {tour.description}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div>
                    <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-3">
                      Tour Highlights
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {tour.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f3f3f4] text-xs text-black">
                          <CheckCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div>
                    <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-3">
                      What's Included
                    </h4>
                    <div className="bg-[#e3e2f7]/50 rounded-2xl p-4 border border-[#c5c5d9]/40 flex flex-col gap-2">
                      {tour.included.map((inc, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-medium text-black">
                          <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ITINERARY */}
              {activeTab === 'itinerary' && (
                <div className="flex flex-col gap-3">
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-black">Full Day-by-Day Schedule</h3>
                    <p className="text-xs text-[#5c5d6e]">Click any day to preview daily activities and dining.</p>
                  </div>

                  {tour.itinerary.map((item) => {
                    const isExpanded = expandedDay === item.day;
                    return (
                      <div
                        key={item.day}
                        className="border border-[#dadada]/60 rounded-2xl overflow-hidden bg-[#f9f9f9]"
                      >
                        <button
                          onClick={() => setExpandedDay(isExpanded ? 0 : item.day)}
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-white transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {item.day}
                            </span>
                            <span className="font-bold text-sm text-black">{item.title}</span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-[#5c5d6e]" /> : <ChevronDown className="w-4 h-4 text-[#5c5d6e]" />}
                        </button>

                        {isExpanded && (
                          <div className="p-4 pt-0 text-xs text-[#5c5d6e] leading-relaxed bg-white border-t border-[#dadada]/40">
                            {item.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: INSTANT BOOKING */}
              {activeTab === 'booking' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-black">2-Click Quick Booking</h3>
                    <p className="text-xs text-[#5c5d6e]">Select departure date and party size for instant confirmation.</p>
                  </div>

                  {/* Departure Dates */}
                  <div>
                    <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
                      Select Available Departure
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {tour.departureDates.map((dateStr) => (
                        <button
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            (selectedDate || tour.departureDates[0]) === dateStr
                              ? 'bg-black text-white border-black shadow-xs'
                              : 'bg-[#f3f3f4] border-transparent text-[#5c5d6e] hover:bg-[#e8e8e8]'
                          }`}
                        >
                          {dateStr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guests Selector */}
                  <div>
                    <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
                      Number of Travelers
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => setGuests(num)}
                          className={`w-12 h-10 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            guests === num
                              ? 'bg-black text-white border-black'
                              : 'bg-[#f3f3f4] border-transparent text-[#5c5d6e] hover:bg-[#e8e8e8]'
                          }`}
                        >
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Promo Code Box */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. ESCAPE2026)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-grow px-4 py-2.5 rounded-xl bg-[#f3f3f4] text-xs font-bold text-black border border-transparent focus:border-black focus:outline-none uppercase"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Price Summary Breakdown */}
                  <div className="bg-[#f3f3f4] p-5 rounded-2xl border border-[#dadada]/60 text-xs">
                    <div className="flex justify-between py-1 text-[#5c5d6e]">
                      <span>${tour.price.toLocaleString()} x {guests} Traveler(s)</span>
                      <span className="font-semibold text-black">${basePrice.toLocaleString()}</span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between py-1 text-emerald-600 font-semibold">
                        <span>Partner Coupon ({promoCode})</span>
                        <span>-${discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between py-2 border-t border-black/10 mt-2 text-sm font-bold text-black">
                      <span>Total Amount:</span>
                      <span className="text-lg">${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Action Footer */}
        {!confirmedBooking && (
          <div className="bg-[#f9f9f9] border-t border-[#dadada]/60 p-5 sm:px-8 flex justify-between items-center">
            <div>
              <span className="text-xs text-[#5c5d6e] block">Total per person</span>
              <span className="text-xl font-bold text-black font-sans">
                ${tour.price.toLocaleString()}
              </span>
            </div>

            {activeTab !== 'booking' ? (
              <button
                onClick={() => setActiveTab('booking')}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <span>Book This Tour</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Confirm Booking (${totalPrice.toLocaleString()})</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
