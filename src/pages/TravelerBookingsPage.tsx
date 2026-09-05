import React, { useState, useEffect } from 'react';
import { 
  Ticket, Calendar, Users, MapPin, CheckCircle2, Clock, 
  Download, ExternalLink, AlertCircle, Building2, Plane, 
  Search, Filter, RefreshCw, XCircle
} from 'lucide-react';
import { BookingModel } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const TravelerBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingModel | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.bookings.list();
      setBookings(res.bookings || []);
    } catch (err: any) {
      toast.error('Failed to load your reservations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This will notify your tour operator.')) return;
    try {
      await api.bookings.updateStatus(id, 'CANCELLED');
      toast.success('Booking cancelled. Refund request filed.');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel reservation.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black text-white flex items-center gap-1.5">
              <Ticket className="w-3 h-3 text-amber-400" />
              Traveler Hub
            </span>
            <span className="text-xs font-bold text-gray-500">Member Reservations</span>
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight">
            My Bookings &amp; Digital Passes
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track confirmed accommodations, flight tickets, guided tour cohorts, and live status.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:text-black flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
        {['all', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              filterStatus === status
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-500 hover:text-black hover:bg-gray-100'
            }`}
          >
            {status === 'all' ? `All Passes (${bookings.length})` : `${status.toLowerCase()} (${bookings.filter(b => b.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Main List */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
          <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loading your travel vouchers...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
          <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-black">No Reservations Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
            Build an itinerary in the Trip Builder and use the "Book Package" wizard to reserve your journey.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBookings.map((b) => {
            const isConfirmed = b.status === 'CONFIRMED';
            return (
              <div
                key={b.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between hover:border-gray-400 transition-colors"
              >
                <div>
                  {/* Top Bar with Type & Code */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-black">
                        {b.bookingType === 'hotel' && <Building2 className="w-4 h-4 text-amber-600" />}
                        {b.bookingType === 'transport' && <Plane className="w-4 h-4 text-blue-600" />}
                        {b.bookingType === 'activity' && <Ticket className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">
                          {b.bookingType} Reservation
                        </span>
                        <h4 className="text-sm font-bold text-black leading-tight">
                          {b.hotel?.name || b.transport?.operatorName || b.trip?.title || 'Guided Tour Package'}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* Trip details box */}
                  <div className="p-4 rounded-2xl bg-[#fafafa] border border-gray-100 mb-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Trip Name</span>
                      <span className="font-bold text-black">{b.trip?.title || 'Tour Itinerary'}</span>
                    </div>
                    {b.confirmationCode && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Voucher / Code</span>
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                          {b.confirmationCode}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Guests</span>
                      <span className="font-bold text-black">{b.guestsCount} Traveler(s)</span>
                    </div>
                    {b.checkIn && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Schedule</span>
                        <span className="font-bold text-black">
                          {new Date(b.checkIn).toLocaleDateString()}
                          {b.checkOut ? ` &mdash; ${new Date(b.checkOut).toLocaleDateString()}` : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {b.specialRequests && (
                    <p className="text-[11px] text-gray-500 italic mb-4">
                      "{b.specialRequests}"
                    </p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Paid Amount</span>
                    <span className="text-base font-black font-mono text-black">${b.totalPrice}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <span className="px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active Voucher
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
