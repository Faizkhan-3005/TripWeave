import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Globe, MapPin, Calendar, DollarSign, 
  TrendingUp, Sparkles, PieChart as PieIcon, Activity 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, PieChart, Pie, Cell 
} from 'recharts';
import { UserAnalytics } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORY_COLORS: Record<string, string> = {
  Transport: '#3b82f6',
  Accommodation: '#8b5cf6',
  Activities: '#10b981',
  Meals: '#f59e0b',
  Other: '#64748b',
  Sightseeing: '#3b82f6',
  Culture: '#8b5cf6',
  Food: '#f59e0b',
  Adventure: '#ef4444',
  Nature: '#10b981',
  Shopping: '#ec4899',
};

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.analytics.getUserStats();
      setStats(res);
    } catch (err: any) {
      toast.error('Failed to load travel analytics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c5d6e] bg-[#e3e2f7] px-3 py-1 rounded-full inline-block mb-2">
          Travel Footprint
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
          Travel &amp; Spending Analytics
        </h1>
        <p className="text-xs sm:text-sm text-[#5c5d6e] mt-1 font-medium">
          Comprehensive breakdown of your global journeys, destinations, and category expenditures.
        </p>
      </div>

      {/* Top 4 Key Metric Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-[#e5e5ea] shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 block mb-1">Global Destinations</span>
          <span className="text-2xl font-black text-black">{stats.uniqueCitiesPlanned} Cities</span>
          <span className="text-[10px] text-gray-400 block mt-1">Across {stats.uniqueCountriesPlanned} Countries</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#e5e5ea] shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 block mb-1">Total Travel Days</span>
          <span className="text-2xl font-black text-black">{stats.totalTravelDays} Days</span>
          <span className="text-[10px] text-gray-400 block mt-1">Avg {stats.averageTripDuration} days / trip</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#e5e5ea] shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 block mb-1">Total Allocated Budget</span>
          <span className="text-2xl font-black text-black">${stats.totalEstimatedBudget.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 block mt-1">Across {stats.totalTrips} planned itineraries</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#e5e5ea] shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 block mb-1">Total Logged Spending</span>
          <span className="text-2xl font-black text-emerald-600">${stats.totalSpent.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 block mt-1">Avg ${stats.averageSpendingPerTrip.toLocaleString()} / trip</span>
        </div>
      </div>

      {/* Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Trip Budget vs Spent Comparison Chart */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e5e5ea] shadow-xs space-y-4">
          <h3 className="text-base font-black text-black tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Trip Budget vs. Actual Expenditure
          </h3>

          <div className="h-72 w-full">
            {stats.tripComparison.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Create a trip to visualize comparison charts.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.tripComparison}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f2" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip formatter={(val: any) => [`$${Number(val).toLocaleString()}`]} />
                  <Bar dataKey="budget" name="Planned Budget" fill="#e3e2f7" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="spent" name="Actual Spent" fill="#18181b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Spending Pie Chart */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e5e5ea] shadow-xs space-y-4">
          <h3 className="text-base font-black text-black tracking-tight flex items-center gap-2">
            <PieIcon className="w-4 h-4" /> Expenditure by Category
          </h3>

          <div className="h-56 w-full">
            {stats.spendingByCategory.every(c => c.amount === 0) ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                No expense entries logged yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.spendingByCategory.filter(c => c.amount > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {stats.spendingByCategory.map((entry) => (
                      <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || '#000'} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Spent']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            {stats.spendingByCategory.map((cat) => (
              <div key={cat.category} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.category] || '#000' }} />
                  <span className="font-semibold text-gray-600">{cat.category}</span>
                </div>
                <span className="font-bold text-black">${cat.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Category Count Distribution */}
        <div className="lg:col-span-12 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e5e5ea] shadow-xs space-y-4">
          <h3 className="text-base font-black text-black tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4" /> Planned Itinerary Activities by Category
          </h3>

          <div className="h-60 w-full">
            {stats.activitiesByCategory.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Add activities to your itineraries to see category breakdown.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.activitiesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f2" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip formatter={(val: any) => [`${val} activities`, 'Count']} />
                  <Bar dataKey="count" name="Scheduled Count" fill="#18181b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
