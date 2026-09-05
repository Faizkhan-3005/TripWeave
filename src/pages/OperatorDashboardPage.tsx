import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Calendar, CheckCircle2, Clock, DollarSign, 
  MapPin, Users, AlertTriangle, ArrowRight, RefreshCw, 
  ChevronRight, Shield, Sparkles, Filter, Check, X
} from 'lucide-react';
import { api } from '../services/api';
import { OperatorDashboard, BookingModel, ItineraryChangeModel } from '../types';
import toast from 'react-hot-toast';

export const OperatorDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<OperatorDashboard | null>(null);
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);
  const [processingChangeId, setProcessingChangeId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.operator.getDashboard();
      setDashboard(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load operator dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatus = async (bookingId: string, status: 'CONFIRMED' | 'CANCELLED') => {
    try {
      setProcessingBookingId(bookingId);
      await api.bookings.updateStatus(bookingId, status);
      toast.success(`Booking ${status.toLowerCase()} successfully`);
      loadDashboard();
    } catch (err: any) {
      toast.error(err.message || `Failed to update booking status`);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleResolveChange = async (changeId: string, status: 'approved' | 'rejected') => {
    try {
      setProcessingChangeId(changeId);
      await api.changes.resolve(changeId, status);
      toast.success(`Change ${status} successfully`);
      loadDashboard();
    } catch (err: any) {
      toast.error(err.message || `Failed to resolve change`);
    } finally {
      setProcessingChangeId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loading Operator Command Center...</p>
        </div>
      </div>
    );
  }

  const summary = dashboard?.summary || {
    activeTripsCount: 0,
    pendingBookingsCount: 0,
    pendingChangesCount: 0,
    totalRevenue: 0,
    totalBookings: 0,
    totalVendors: 0,
    totalGroups: 0,
    totalTravelers: 0,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* 1. Header with Live Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded-full">
              Operator Control Hub
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-sans">
            Tour Operations Command Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time monitoring of traveler departures, inventory suppliers, tour group cohorts, and dynamic adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 text-xs font-bold bg-[#f3f3f6] hover:bg-gray-200 text-black px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
          <Link
            to="/app/operator/bookings"
            className="flex items-center gap-2 text-xs font-bold bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <span>Manage All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Top Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Tours</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-black">{summary.activeTripsCount}</p>
          <p className="text-[11px] text-gray-400 mt-1">Confirmed &amp; en-route departures</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{summary.pendingBookingsCount}</p>
          <p className="text-[11px] text-gray-400 mt-1">Requiring operator confirmation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Itinerary Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-600">{summary.pendingChangesCount}</p>
          <p className="text-[11px] text-gray-400 mt-1">Pending approval / weather shifts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Gross Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-black">
            ${summary.totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">{summary.totalBookings} total booked reservations</p>
        </div>
      </div>

      {/* 3. Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#f3f3f6] p-4 rounded-2xl flex items-center gap-3">
          <Building2 className="w-5 h-5 text-gray-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-black">{summary.totalVendors} Verified Vendors</p>
            <p className="text-[10px] text-gray-500">Hotels, Rail &amp; Airlines</p>
          </div>
        </div>

        <div className="bg-[#f3f3f6] p-4 rounded-2xl flex items-center gap-3">
          <Users className="w-5 h-5 text-gray-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-black">{summary.totalGroups} Cohort Groups</p>
            <p className="text-[10px] text-gray-500">Guided tour cohorts</p>
          </div>
        </div>

        <div className="bg-[#f3f3f6] p-4 rounded-2xl flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-gray-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-black">{summary.totalTravelers} Registered Travelers</p>
            <p className="text-[10px] text-gray-500">Active traveler profiles</p>
          </div>
        </div>

        <Link 
          to="/app/operator/schedule" 
          className="bg-black text-white p-4 rounded-2xl flex items-center justify-between hover:bg-neutral-800 transition-colors"
        >
          <div>
            <p className="text-xs font-bold">Schedule Calendar</p>
            <p className="text-[10px] text-gray-300">View departure timeline</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>
      </div>

      {/* 4. Action Center: Pending Bookings & Urgent Itinerary Changes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Bookings Widget */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-black">Pending Reservations</h2>
                  <p className="text-xs text-gray-400">Needs immediate operator confirmation</p>
                </div>
              </div>
              <Link to="/app/operator/bookings" className="text-xs font-bold text-black hover:underline">
                View All
              </Link>
            </div>

            {(!dashboard?.pendingBookings || dashboard.pendingBookings.length === 0) ? (
              <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-black">All Bookings Cleared</p>
                <p className="text-[11px] text-gray-400">No pending reservations require attention right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.pendingBookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-neutral-50 border border-gray-200/60 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                          {b.bookingType}
                        </span>
                        <span className="text-xs font-bold text-black truncate">
                          {b.hotel?.name || b.transport?.operatorName || b.trip?.title || 'Reservation'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        Traveler: <span className="font-semibold text-black">{b.user?.name}</span> (${b.totalPrice})
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleBookingStatus(b.id, 'CONFIRMED')}
                        disabled={processingBookingId === b.id}
                        className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        title="Confirm Booking"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleBookingStatus(b.id, 'CANCELLED')}
                        disabled={processingBookingId === b.id}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        title="Decline"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Changes & Alerts Widget */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-black">Itinerary Adjustments</h2>
                  <p className="text-xs text-gray-400">Weather disruptions &amp; schedule shifts</p>
                </div>
              </div>
              <Link to="/app/operator/changes" className="text-xs font-bold text-black hover:underline">
                Audit Log
              </Link>
            </div>

            {(!dashboard?.pendingChanges || dashboard.pendingChanges.length === 0) ? (
              <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-black">No Pending Changes</p>
                <p className="text-[11px] text-gray-400">All live tour schedules are running on track.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.pendingChanges.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-neutral-50 border border-gray-200/60 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                          {c.changeType}
                        </span>
                        <span className="text-xs font-bold text-black">
                          {c.trip?.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 font-medium line-clamp-2">
                        {c.description}
                      </p>
                      {c.reason && (
                        <p className="text-[11px] text-gray-500 mt-1 italic">
                          Reason: {c.reason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200/60 pt-2 text-[11px]">
                      <span className="text-gray-500">Initiator: {c.initiator?.name || 'System'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResolveChange(c.id, 'approved')}
                          disabled={processingChangeId === c.id}
                          className="px-3 py-1 bg-black text-white text-xs font-bold rounded-lg hover:bg-neutral-800 cursor-pointer"
                        >
                          Approve Shift
                        </button>
                        <button
                          onClick={() => handleResolveChange(c.id, 'rejected')}
                          disabled={processingChangeId === c.id}
                          className="px-3 py-1 bg-gray-200 text-black text-xs font-bold rounded-lg hover:bg-gray-300 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 5. Active Tours & Cohort Schedule Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-black">Active Tour Operations</h2>
            <p className="text-xs text-gray-400">All planned, booked, and active departures across all destinations</p>
          </div>
          <Link
            to="/app/operator/tour-groups"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline"
          >
            <span>Manage Tour Cohorts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!dashboard?.activeTrips || dashboard.activeTrips.length === 0) ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-black">No Active Tours</p>
            <p className="text-[11px] text-gray-400">Departures in BOOKED or ACTIVE status will display here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 text-gray-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Tour / Trip</th>
                  <th className="pb-3 px-3">Traveler</th>
                  <th className="pb-3 px-3">Stops &amp; Cities</th>
                  <th className="pb-3 px-3">Dates</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {dashboard.activeTrips.map((trip: any) => (
                  <tr key={trip.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-black text-xs">{trip.title}</p>
                      <p className="text-[10px] text-gray-400">Budget: ${trip.budget.toLocaleString()}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="text-black font-semibold">{trip.user?.name}</p>
                      <p className="text-[10px] text-gray-400">{trip.user?.email}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {trip.stops?.map((s: any) => (
                          <span key={s.id} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-medium">
                            {s.city?.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-gray-600">
                      {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        trip.status === 'ACTIVE' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <Link
                        to={`/app/trips/${trip.id}/view`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 text-[11px] font-bold transition-colors"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
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
