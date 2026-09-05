import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, MapPin, Compass, DollarSign, BarChart3, 
  TrendingUp, Shield, Activity, Calendar, Award, 
  Search, RefreshCw, CheckCircle2, AlertCircle, Plane,
  Lock, Eye, ExternalLink, ArrowRight, Sparkles, Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';
import { api } from '../services/api';
import { CityModel } from '../types';
import toast from 'react-hot-toast';

const COLORS = ['#000000', '#5c5d6e', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'destinations' | 'users'>('overview');
  const [searchFilter, setSearchFilter] = useState('');
  
  const [currentUserId, setCurrentUserId] = useState('');
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalDestinations: 0,
    totalActivities: 0,
    totalExpensesSum: 0,
    totalExpensesCount: 0,
  });

  const [tripsList, setTripsList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [destinationsList, setDestinationsList] = useState<any[]>([]);
  const [platformGrowth, setPlatformGrowth] = useState<any[]>([]);
  const [categoryAdoption, setCategoryAdoption] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const telemetryRes = await api.admin.getTelemetry();
      setSummary(telemetryRes.summary);
      setCurrentUserId(telemetryRes.currentUserId);
      setTripsList(telemetryRes.trips);
      setUsersList(telemetryRes.users);
      setDestinationsList(telemetryRes.topDestinations);
      setPlatformGrowth(telemetryRes.platformGrowth);
      setCategoryAdoption(telemetryRes.categoryAdoption);
    } catch (err: any) {
      toast.error('Failed to load admin telemetry.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = tripsList.filter(
    t => t.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
         t.ownerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
         t.cities.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredUsers = usersList.filter(
    u => u.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
         u.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredDestinations = destinationsList.filter(
    d => d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
         d.country.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white bg-black px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <Shield className="w-3 h-3 text-amber-300" /> Platform &amp; Trip Admin Access
            </span>
            <span className="text-xs text-[#5c5d6e] font-semibold">Live PostgreSQL Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Admin &amp; Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5c5d6e] mt-1">
            Track user adoption, popular destinations, trip creation velocity, and granular trip administration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e5ea] hover:bg-gray-50 text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Telemetry</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-[#e5e5ea] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Travelers</span>
            <Users className="w-4 h-4 text-black" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-black block">{summary.totalUsers}</span>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live User Accounts
          </span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-[#e5e5ea] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Trips Created</span>
            <Calendar className="w-4 h-4 text-black" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-black block">{summary.totalTrips}</span>
          <span className="text-[11px] font-bold text-blue-600 mt-1 inline-flex items-center gap-1">
            <Plane className="w-3 h-3" /> Multi-City Itineraries
          </span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-[#e5e5ea] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Destinations Active</span>
            <MapPin className="w-4 h-4 text-black" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-black block">{summary.totalDestinations}</span>
          <span className="text-[11px] font-bold text-purple-600 mt-1 inline-flex items-center gap-1">
            {summary.totalActivities} Curated Experiences
          </span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-[#e5e5ea] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Expenses Tracked</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-black block">${summary.totalExpensesSum.toLocaleString()}</span>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
            {summary.totalExpensesCount} Receipts &amp; Logs
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'overview', label: 'Platform Telemetry' },
            { id: 'trips', label: `Trips Created (${tripsList.length})` },
            { id: 'destinations', label: `Top Cities & Rankings (${destinationsList.length})` },
            { id: 'users', label: `Traveler Directory (${usersList.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearchFilter('');
              }}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-[#e5e5ea]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'overview' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Filter ${activeTab}...`}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
            />
          </div>
        )}
      </div>

      {/* TAB 1: OVERVIEW CHARTS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Monthly Growth Line Chart */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e5e5ea] shadow-xs">
            <h3 className="text-lg font-black text-black mb-1">Platform Trip &amp; User Velocity</h3>
            <p className="text-xs text-gray-500 mb-6">Monthly trajectory of traveler registrations and itineraries created.</p>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={platformGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f2" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ background: '#000', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }} 
                  />
                  <Line type="monotone" dataKey="newUsers" stroke="#000000" strokeWidth={2.5} name="Travelers" />
                  <Line type="monotone" dataKey="newTrips" stroke="#3b82f6" strokeWidth={2.5} name="Itineraries" />
                  <Line type="monotone" dataKey="activeEngagement" stroke="#10b981" strokeWidth={2.5} name="User Engagement" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Categories Distribution */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e5e5ea] shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-black mb-1">Activity Preference</h3>
              <p className="text-xs text-gray-500 mb-4">Traveler activity preference distribution.</p>
              
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryAdoption}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryAdoption.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#000', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs font-semibold">
              {categoryAdoption.map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-700">{cat.name}</span>
                  </div>
                  <span className="font-extrabold text-black">{cat.value} activities</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRIPS CREATED TABLE & ADMIN PRIVILEGES */}
      {activeTab === 'trips' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e5e5ea] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-black">Trips &amp; Itineraries Directory</h3>
              <p className="text-xs text-gray-500">
                Granular administrative rights: Users have <strong>Full Admin Control</strong> over trips they created.
              </p>
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Showing {filteredTrips.length} itineraries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f9f9fb] border-y border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Trip Title</th>
                  <th className="p-3.5">Creator / Traveler</th>
                  <th className="p-3.5">Destinations Route</th>
                  <th className="p-3.5">Budget &amp; Spent</th>
                  <th className="p-3.5">Activities</th>
                  <th className="p-3.5">Your Admin Scope</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-black">
                {filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-black block text-sm">{trip.title}</span>
                      <span className="text-[11px] text-gray-500">
                        {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold block">{trip.ownerName}</span>
                      <span className="text-[11px] text-gray-500">{trip.ownerEmail}</span>
                    </td>
                    <td className="p-3.5 text-gray-700">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-black" />
                        {trip.cities || 'Single Destination'}
                      </span>
                      <span className="text-[10px] text-gray-400 block">{trip.stopsCount} stops</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-black block">
                        {trip.currency} {trip.budget.toLocaleString()}
                      </span>
                      <span className={`text-[11px] font-bold ${trip.spent > trip.budget ? 'text-red-500' : 'text-emerald-600'}`}>
                        Spent: {trip.currency} {trip.spent.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-black">{trip.activitiesCount} events</span>
                    </td>
                    <td className="p-3.5">
                      {trip.isMyTrip ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Full Trip Admin
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Platform Telemetry
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {trip.isMyTrip ? (
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/app/trips/${trip.id}/builder`}
                            className="bg-black text-white hover:bg-gray-800 px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-all"
                          >
                            Manage Itinerary
                          </Link>
                          <Link
                            to={`/app/trips/${trip.id}/budget`}
                            className="bg-gray-100 text-black hover:bg-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                          >
                            Budget
                          </Link>
                        </div>
                      ) : (
                        trip.shareSlug && (
                          <Link
                            to={`/share/${trip.shareSlug}`}
                            target="_blank"
                            className="text-blue-600 hover:underline inline-flex items-center gap-1 text-xs font-bold"
                          >
                            View Guide <ExternalLink className="w-3 h-3" />
                          </Link>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DESTINATIONS RANKINGS */}
      {activeTab === 'destinations' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e5e5ea] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-black">Top Destination Adoption</h3>
              <p className="text-xs text-gray-500">City rankings by popularity rating, trips scheduled, and wishlist saves.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f9f9fb] border-y border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">City &amp; Country</th>
                  <th className="p-3.5">Continent</th>
                  <th className="p-3.5">Popularity Rating</th>
                  <th className="p-3.5">Trips Planned In</th>
                  <th className="p-3.5">Wishlist Saves</th>
                  <th className="p-3.5">Activity Catalog</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-black">
                {filteredDestinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={dest.image} alt={dest.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <span className="font-bold block text-sm">{dest.name}</span>
                        <span className="text-[11px] text-gray-500">{dest.country}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-gray-600 font-semibold">{dest.continent}</td>
                    <td className="p-3.5">
                      <span className="font-extrabold text-amber-500">★ {dest.popularity.toFixed(2)}</span>
                    </td>
                    <td className="p-3.5 font-bold text-blue-600">
                      {dest.tripsBookedCount} stops planned
                    </td>
                    <td className="p-3.5 font-bold text-purple-600">
                      {dest.savedWishlistCount} travelers saved
                    </td>
                    <td className="p-3.5 text-gray-600">
                      {dest.activitiesAvailable} experiences
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e5e5ea] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-black">Platform User Directory</h3>
              <p className="text-xs text-gray-500">Registered travelers and their itinerary portfolios.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f9f9fb] border-y border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Itineraries Created</th>
                  <th className="p-3.5">Wishlist Items</th>
                  <th className="p-3.5">Joined Date</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-black">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-bold text-black">{user.name}</span>
                    </td>
                    <td className="p-3.5 text-gray-600">{user.email}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        user.role.includes('You')
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold">{user.tripsCount} trips</td>
                    <td className="p-3.5 text-purple-600 font-semibold">{user.savedCount} saved</td>
                    <td className="p-3.5 text-gray-500">{user.joined}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
