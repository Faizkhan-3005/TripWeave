import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, XCircle, Search, Filter, 
  ArrowUpDown, RefreshCw, Hotel, Plane, Calendar,
  CreditCard, User, Check, X, FileText
} from 'lucide-react';
import { api } from '../services/api';
import { BookingModel, BookingStatusType } from '../types';
import toast from 'react-hot-toast';

export const BookingManagementPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, [statusFilter, typeFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (typeFilter !== 'ALL') params.bookingType = typeFilter;
      const res = await api.bookings.list(params);
      setBookings(res.bookings);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatusType) => {
    try {
      setUpdatingId(id);
      await api.bookings.updateStatus(id, status);
      toast.success(`Booking marked as ${status}`);
      loadBookings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update booking');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    const travelerName = b.user?.name?.toLowerCase() || '';
    const tripTitle = b.trip?.title?.toLowerCase() || '';
    const hotelName = b.hotel?.name?.toLowerCase() || '';
    const code = b.confirmationCode?.toLowerCase() || '';
    return travelerName.includes(q) || tripTitle.includes(q) || hotelName.includes(q) || code.includes(q);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded-full">
            Reservation Lifecycle
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1">
            Booking &amp; Inventory Management
          </h1>
          <p className="text-xs text-gray-500">
            Confirm room blocks, manage ticketing vouchers, track Stripe payments, and issue status updates.
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="flex items-center gap-2 text-xs font-bold bg-[#f3f3f6] hover:bg-gray-200 text-black px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Bookings</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-80 bg-neutral-50 px-3.5 py-2 rounded-xl border border-gray-200/80">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search traveler, code, hotel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs w-full outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === st ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            {['ALL', 'hotel', 'transport'].map((tp) => (
              <button
                key={tp}
                onClick={() => setTypeFilter(tp)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg capitalize transition-all cursor-pointer ${
                  typeFilter === tp ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
                }`}
              >
                {tp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List / Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Loading reservation ledger...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl">
            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-black">No Reservations Found</p>
            <p className="text-[11px] text-gray-400">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 text-gray-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Item / Provider</th>
                  <th className="pb-3 px-3">Traveler &amp; Trip</th>
                  <th className="pb-3 px-3">Dates &amp; Details</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-neutral-100 text-black flex items-center justify-center shrink-0">
                          {b.bookingType === 'hotel' ? <Hotel className="w-4 h-4" /> : <Plane className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-black text-xs truncate">
                            {b.hotel?.name || b.transport?.operatorName || 'Reserved Item'}
                          </p>
                          <span className="text-[10px] font-mono text-gray-400">
                            {b.confirmationCode || 'Pending Code'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <p className="font-semibold text-black">{b.user?.name || 'Traveler'}</p>
                      <p className="text-[10px] text-gray-400 truncate">{b.trip?.title}</p>
                    </td>

                    <td className="py-4 px-3">
                      {b.checkIn && b.checkOut ? (
                        <p className="text-gray-700">
                          {new Date(b.checkIn).toLocaleDateString()} – {new Date(b.checkOut).toLocaleDateString()}
                        </p>
                      ) : (
                        <p className="text-gray-500">Scheduled Departure</p>
                      )}
                      <p className="text-[10px] text-gray-400">{b.guestsCount} Guest(s)</p>
                    </td>

                    <td className="py-4 px-3">
                      <p className="font-black text-black">${b.totalPrice.toLocaleString()}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">
                        {b.payments && b.payments.length > 0 && b.payments[0].status === 'PAID' ? '✓ Paid (Stripe)' : 'Payment Pending'}
                      </p>
                    </td>

                    <td className="py-4 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}
                            disabled={updatingId === b.id}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Confirm"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {b.status !== 'CANCELLED' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                            disabled={updatingId === b.id}
                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
