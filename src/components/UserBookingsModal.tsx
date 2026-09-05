import React from 'react';
import { X, Ticket, Calendar, Users, MapPin, CheckCircle, ExternalLink, Plane } from 'lucide-react';
import { Booking } from '../types';

interface UserBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onExploreMore: () => void;
  onViewTourDetails: (tourId: string) => void;
}

export const UserBookingsModal: React.FC<UserBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onExploreMore,
  onViewTourDetails
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[36px] shadow-2xl border border-[#dadada] overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#f3f3f4] text-[#5c5d6e] hover:text-black flex items-center justify-center hover:bg-[#e2e2e2] transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#e3e2f7] p-8 pb-6 border-b border-[#c5c5d9]/40">
          <div className="flex items-center gap-2 mb-1">
            <Ticket className="w-5 h-5 text-black" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#5c5d6e]">
              GlobeTraveller Member Hub
            </span>
          </div>
          <h3 className="text-3xl font-bold text-black tracking-tight font-sans">
            My Booked Itineraries &amp; Passes
          </h3>
          <p className="text-sm text-[#5c5d6e] mt-1">
            Manage your confirmed upcoming escapes and download digital boarding vouchers.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
          {bookings.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#f3f3f4] flex items-center justify-center text-[#5c5d6e]">
                <Ticket className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-black">No Active Bookings Yet</h4>
              <p className="text-xs sm:text-sm text-[#5c5d6e] max-w-sm">
                Explore our signature tours for Bali, Paris, China, or Italy and confirm your escape in 2 clicks.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreMore();
                }}
                className="mt-2 px-6 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
              >
                Browse Curated Tours
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-[#f9f9f9] border border-[#dadada]/60 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between hover:border-black/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={booking.tourImage}
                      alt={booking.tourTitle}
                      className="w-20 h-20 rounded-xl object-cover border border-black/10 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {booking.status}
                        </span>
                        <span className="text-xs text-[#5c5d6e] font-mono">
                          Ref #{booking.bookingRef}
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-black font-sans">
                        {booking.tourTitle}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#5c5d6e] mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {booking.departureDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {booking.guestsCount} Guest(s)
                        </span>
                        <span className="font-bold text-black">
                          ${booking.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onViewTourDetails(booking.tourId);
                    }}
                    className="px-4 py-2 rounded-full border border-black text-xs font-bold text-black hover:bg-black hover:text-white transition-all cursor-pointer shrink-0"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#f9f9f9] border-t border-[#dadada]/60 p-4 px-8 flex justify-between items-center text-xs text-[#5c5d6e]">
          <span>Need to modify dates or flights? Contact 24/7 Concierge.</span>
          <button
            onClick={() => {
              onClose();
              onExploreMore();
            }}
            className="font-bold text-black hover:underline cursor-pointer"
          >
            Explore More Tours &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
