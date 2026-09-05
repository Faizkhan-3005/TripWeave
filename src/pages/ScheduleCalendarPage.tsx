import React, { useState, useEffect } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Clock, MapPin, 
  Users, Hotel, Plane, RefreshCw, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const ScheduleCalendarPage: React.FC = () => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const res = await api.operator.getSchedule();
      setSchedule(res.schedule);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load operator schedule');
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded-full">
            Operations Timeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1">
            Global Departure Calendar
          </h1>
          <p className="text-xs text-gray-500">
            Chronological departure timeline of guided tour cohorts, hotel check-ins, and multi-city travel transfers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-black min-w-[120px] text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={loadSchedule}
            className="p-2 text-xs font-bold bg-[#f3f3f6] hover:bg-gray-200 text-black rounded-xl transition-colors cursor-pointer"
            title="Reload"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Schedule Departures Timeline Feed */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-black flex items-center gap-2">
          <Calendar className="w-4 h-4 text-black" />
          <span>Confirmed Departures &amp; Active Runs</span>
        </h2>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Loading schedule matrix...</p>
          </div>
        ) : schedule.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl">
            <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-black">No Departures on Calendar</p>
            <p className="text-[11px] text-gray-400">Tours in BOOKED or ACTIVE status will populate this schedule.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedule.map((trip) => {
              const start = new Date(trip.startDate);
              const end = new Date(trip.endDate);
              const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

              return (
                <div key={trip.id} className="p-5 rounded-2xl bg-neutral-50 border border-gray-200/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                          {trip.status}
                        </span>
                        <h3 className="font-bold text-sm text-black">{trip.title}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Lead Traveler: <span className="font-semibold text-black">{trip.user?.name}</span> ({trip.user?.email})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-black">
                      <span>{start.toLocaleDateString()} – {end.toLocaleDateString()}</span>
                      <span className="text-gray-400 text-[10px]">({totalDays} Days)</span>
                    </div>
                  </div>

                  {/* Multi-city Stops & Logistics Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {trip.stops?.map((stop: any, idx: number) => (
                      <div key={stop.id} className="bg-white p-3 rounded-xl border border-gray-200/70 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-black flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-black" />
                            Stop {idx + 1}: {stop.city?.name}
                          </span>
                          <span className="text-[10px] text-gray-400">{stop.city?.country}</span>
                        </div>

                        {stop.hotel && (
                          <div className="flex items-center gap-1.5 text-gray-600 text-[11px] pt-1 border-t border-gray-100">
                            <Hotel className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate">{stop.hotel.name}</span>
                          </div>
                        )}

                        {stop.transportToNext && (
                          <div className="flex items-center gap-1.5 text-gray-600 text-[11px]">
                            <Plane className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate">Next Leg: {stop.transportToNext.operatorName}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500">
                    <div>
                      {trip.tourGroups && trip.tourGroups.length > 0 && (
                        <span>
                          Cohort: <strong className="text-black">{trip.tourGroups[0].name}</strong>
                          {trip.tourGroups[0].coordinator && ` (Guide: ${trip.tourGroups[0].coordinator.name})`}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/app/trips/${trip.id}/view`}
                      className="inline-flex items-center gap-1 text-black font-bold hover:underline"
                    >
                      <span>Full Schedule Matrix</span>
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
