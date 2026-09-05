import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, CreditCard, Calendar, Users, MapPin, 
  Sparkles, ArrowRight, ArrowLeft, Building2, Plane, Lock, AlertCircle, 
  CheckCircle2, Download, Ticket
} from 'lucide-react';
import { TripModel, BookingModel } from '../../types';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripModel | null;
  onBookingSuccess: () => void;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  isOpen,
  onClose,
  trip,
  onBookingSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [primaryContact, setPrimaryContact] = useState({
    fullName: '',
    email: '',
    phone: '',
    passportNumber: '',
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState<string>('•••• •••• •••• 4242');
  const [expiry, setExpiry] = useState<string>('12/28');
  const [cvc, setCvc] = useState<string>('888');
  const [billingName, setBillingName] = useState<string>('');

  // Submission / confirmation state
  const [processing, setProcessing] = useState<boolean>(false);
  const [confirmedBookings, setConfirmedBookings] = useState<BookingModel[]>([]);

  if (!isOpen || !trip) return null;

  // Calculate live itemized totals
  const totalActivitiesCost = (trip.tripActivities || []).reduce(
    (acc, act) => acc + (act.estimatedCost || 0),
    0
  );

  const hotelsList = (trip.stops || []).filter((s) => s.hotel);
  const totalHotelsCost = hotelsList.reduce(
    (acc, s) => acc + (s.hotel?.pricePerNight || 0) * Math.max(1, Math.round(trip.durationDays / Math.max(1, trip.stops.length))),
    0
  );

  const transportsList = (trip.stops || []).filter((s) => s.transportToNext);
  const totalTransportsCost = transportsList.reduce(
    (acc, s) => acc + (s.transportToNext?.price || 0) * guestsCount,
    0
  );

  const serviceFee = 45;
  const grandTotal = Math.max(150, totalActivitiesCost + totalHotelsCost + totalTransportsCost + serviceFee);

  const handleProcessCheckout = async () => {
    setProcessing(true);
    try {
      const createdBookings: BookingModel[] = [];

      // 1. Create main trip package / accommodation booking
      if (hotelsList.length > 0) {
        for (const stop of hotelsList) {
          if (stop.hotel) {
            const res = await api.bookings.create({
              tripId: trip.id,
              bookingType: 'hotel',
              hotelId: stop.hotel.id,
              vendorId: stop.hotel.vendorId || undefined,
              totalPrice: stop.hotel.pricePerNight * 2,
              checkIn: stop.arrivalDate || trip.startDate,
              checkOut: stop.departureDate || trip.endDate,
              guestsCount,
              specialRequests: specialRequests || 'Standard Double Bed Room with City View',
            });
            createdBookings.push(res.booking);
          }
        }
      }

      // 2. Create transport booking if selected
      if (transportsList.length > 0) {
        for (const stop of transportsList) {
          if (stop.transportToNext) {
            const res = await api.bookings.create({
              tripId: trip.id,
              bookingType: 'transport',
              transportId: stop.transportToNext.id,
              vendorId: stop.transportToNext.vendorId || undefined,
              totalPrice: stop.transportToNext.price * guestsCount,
              guestsCount,
              specialRequests,
            });
            createdBookings.push(res.booking);
          }
        }
      }

      // 3. Fallback: if no hotel or transport chosen yet, create full itinerary booking
      if (createdBookings.length === 0) {
        const res = await api.bookings.create({
          tripId: trip.id,
          bookingType: 'activity',
          totalPrice: grandTotal,
          guestsCount,
          specialRequests: `Complete Guided Tour Package: ${trip.title}`,
        });
        createdBookings.push(res.booking);
      }

      // 4. Create confirmed payment record for the primary booking
      const primaryBooking = createdBookings[0];
      if (primaryBooking) {
        await api.payments.create({
          bookingId: primaryBooking.id,
          amount: grandTotal,
          method: paymentMethod.toUpperCase(),
        });
      }

      setConfirmedBookings(createdBookings);
      setCurrentStep(4); // Advance to confirmed voucher step
      toast.success('🎉 Booking confirmed! Confirmation code issued.');
      onBookingSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Checkout failed. Please check payment credentials.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-[36px] shadow-2xl border border-gray-200 overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#18181b] text-white p-6 px-8 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-white flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                Secure Checkout &bull; 256-Bit SSL
              </span>
              <span className="text-xs text-gray-400">GlobeTrotter Direct Pass</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              {currentStep === 4 ? 'Booking Confirmed!' : `Book Itinerary: ${trip.title}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="bg-[#fafafa] border-b border-gray-200 px-8 py-3">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Review Package' },
              { num: 2, label: 'Guest Info' },
              { num: 3, label: 'Payment' },
              { num: 4, label: 'Boarding Pass' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep > s.num
                      ? 'bg-emerald-600 text-white'
                      : currentStep === s.num
                      ? 'bg-black text-white ring-4 ring-black/10'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span
                  className={`text-xs font-bold hidden sm:inline ${
                    currentStep === s.num ? 'text-black' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-white">
          {/* STEP 1: REVIEW ITINERARY PACKAGE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Trip Timing &amp; Duration</h4>
                    <p className="text-xs text-gray-600">
                      {new Date(trip.startDate).toLocaleDateString()} &mdash; {new Date(trip.endDate).toLocaleDateString()} ({trip.durationDays} Days)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
                  {trip.stops.length} Destinations Planned
                </span>
              </div>

              {/* Itemized Breakdown Table */}
              <div>
                <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3">
                  Package Inclusions &amp; Attached Logistics
                </h3>
                <div className="rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                  {/* Stops & Accommodations */}
                  {trip.stops.map((stop, idx) => (
                    <div key={stop.id} className="p-4 flex items-center justify-between bg-[#fafafa]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-xs font-black">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-black flex items-center gap-2">
                            <span>{stop.city.name}, {stop.city.country}</span>
                            {stop.hotel && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> {stop.hotel.name}
                              </span>
                            )}
                            {stop.transportToNext && (
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Plane className="w-3 h-3" /> {stop.transportToNext.operatorName}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {stop.hotel ? `$${stop.hotel.pricePerNight}/night` : 'Self-arranged stay'} &bull;{' '}
                            {stop.transportToNext ? `$${stop.transportToNext.price} transit to next city` : 'Local commute'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-black">
                        ${(stop.hotel?.pricePerNight || 0) * 2 + (stop.transportToNext?.price || 0)}
                      </span>
                    </div>
                  ))}

                  {/* Activities summary */}
                  <div className="p-4 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-gray-700">
                        Itinerary Activities &amp; Tours ({trip.tripActivities?.length || 0} scheduled)
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-black">${totalActivitiesCost}</span>
                  </div>

                  {/* Service & Guarantee Fee */}
                  <div className="p-4 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-gray-700">
                        Tripweave Guarantee &amp; Dynamic Rebooking Protection
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-black">${serviceFee}</span>
                  </div>
                </div>
              </div>

              {/* Cost Summary Box */}
              <div className="p-5 rounded-2xl bg-black text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
                    Estimated Total for Entire Cohort
                  </span>
                  <span className="text-2xl font-black font-mono text-white">${grandTotal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Party Size:</span>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="bg-zinc-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-zinc-700 outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GUEST & TRAVELER DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-900 leading-relaxed font-medium">
                  Please enter legal identification information for the primary traveler. This will be transmitted to our verified hotel and flight providers for digital check-in.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Primary Traveler Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Henderson"
                    value={primaryContact.fullName}
                    onChange={(e) => setPrimaryContact({ ...primaryContact, fullName: e.target.value })}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Email Address for Vouchers *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@traveler.com"
                    value={primaryContact.email}
                    onChange={(e) => setPrimaryContact({ ...primaryContact, email: e.target.value })}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Contact Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 234-5678"
                    value={primaryContact.phone}
                    onChange={(e) => setPrimaryContact({ ...primaryContact, phone: e.target.value })}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Passport / National ID # (Optional)</label>
                  <input
                    type="text"
                    placeholder="P-94829381"
                    value={primaryContact.passportNumber}
                    onChange={(e) => setPrimaryContact({ ...primaryContact, passportNumber: e.target.value })}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Dietary Restrictions, Room Preferences &amp; Special Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Vegetarian breakfast required, quiet high-floor room preferred, wheelchair accessibility needed for transport."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT & BILLING SIMULATION */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'applepay', label: 'Apple Pay', icon: Lock },
                  { id: 'paypal', label: 'PayPal', icon: ShieldCheck },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-3 px-4 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === m.id
                        ? 'border-black bg-zinc-900 text-white shadow-sm'
                        : 'border-gray-200 bg-[#fafafa] text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <m.icon className="w-5 h-5" />
                    <span className="text-xs font-bold">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Card Inputs */}
              <div className="p-5 rounded-2xl border border-gray-200 bg-[#fafafa] space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Cardholder Full Name</label>
                  <input
                    type="text"
                    placeholder="ALEX HENDERSON"
                    value={billingName || primaryContact.fullName}
                    onChange={(e) => setBillingName(e.target.value)}
                    className="w-full text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-black outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">CVC Code</label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-black outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Security info */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center gap-2.5 text-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero-risk reservation: Full refund guaranteed up to 48 hours before initial departure date.</span>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION & DIGITAL BOARDING PASS */}
          {currentStep === 4 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
                  Payment Processed &bull; Reservation Guaranteed
                </span>
                <h3 className="text-2xl font-black text-black tracking-tight mt-1">
                  You're Ready for {trip.title}!
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                  We've notified the assigned tour coordinator and synced your vouchers to the live operator system.
                </p>
              </div>

              {/* Digital Boarding Pass Card */}
              <div className="max-w-md mx-auto rounded-3xl border-2 border-black bg-[#fafafa] p-6 text-left shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      GlobeTrotter Pass
                    </span>
                    <span className="text-base font-black text-black">{trip.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Code</span>
                    <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                      {confirmedBookings[0]?.confirmationCode || 'GT-PASS8492'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-gray-400 block font-medium">Lead Traveler</span>
                    <span className="font-bold text-black">{primaryContact.fullName || 'Lead Explorer'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Party Size</span>
                    <span className="font-bold text-black">{guestsCount} Travelers</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Valid From</span>
                    <span className="font-bold text-black">{new Date(trip.startDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Status</span>
                    <span className="font-bold text-emerald-600">CONFIRMED (PAID)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Ticket className="w-3.5 h-3.5 text-black" /> {confirmedBookings.length} Vouchers Issued
                  </span>
                  <span className="font-mono font-bold text-black">${grandTotal} USD</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="bg-[#fafafa] border-t border-gray-200 px-8 py-4 flex items-center justify-between">
          {currentStep > 1 && currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2.5 rounded-2xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div />}

          {currentStep === 1 && (
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-2xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              Continue to Guest Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              onClick={() => {
                if (!primaryContact.fullName) {
                  setPrimaryContact({
                    ...primaryContact,
                    fullName: 'Faiz Khan',
                    email: 'faiz@globetrotter.io',
                  });
                }
                setCurrentStep(3);
              }}
              className="px-6 py-2.5 rounded-2xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              Continue to Payment <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              disabled={processing}
              onClick={handleProcessCheckout}
              className="px-8 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {processing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authorizing &amp; Booking...
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Pay &amp; Confirm ${grandTotal}
                </>
              )}
            </button>
          )}

          {currentStep === 4 && (
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-2xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm"
            >
              Done &bull; View Itinerary
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
