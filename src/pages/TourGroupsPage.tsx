import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Calendar, MapPin, Shield, UserPlus, 
  Trash2, Search, CheckCircle2, ChevronRight, User
} from 'lucide-react';
import { api } from '../services/api';
import { TourGroupModel, TripModel } from '../types';
import toast from 'react-hot-toast';

export const TourGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<TourGroupModel[]>([]);
  const [trips, setTrips] = useState<TripModel[]>([]);
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Group Form
  const [newGroup, setNewGroup] = useState({
    name: '',
    tripId: '',
    coordinatorId: '',
    maxSize: 16,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [groupsRes, tripsRes, coordsRes] = await Promise.all([
        api.tourGroups.list(),
        api.trips.list(),
        api.operator.getCoordinators(),
      ]);
      setGroups(groupsRes.groups);
      setTrips(tripsRes.trips);
      setCoordinators(coordsRes.coordinators);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load tour groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.tripId) {
      toast.error('Cohort name and parent trip are required');
      return;
    }

    try {
      setSubmitting(true);
      await api.tourGroups.create({
        name: newGroup.name,
        tripId: newGroup.tripId,
        coordinatorId: newGroup.coordinatorId || undefined,
        maxSize: Number(newGroup.maxSize) || 16,
      });
      toast.success('Tour cohort created successfully!');
      setShowCreateModal(false);
      setNewGroup({ name: '', tripId: '', coordinatorId: '', maxSize: 16 });
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create tour group');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cohort?')) return;
    try {
      await api.tourGroups.delete(id);
      toast.success('Group deleted');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete tour group');
    }
  };

  const filteredGroups = groups.filter((g) => {
    const q = searchQuery.toLowerCase();
    return g.name.toLowerCase().includes(q) || (g.trip?.title && g.trip.title.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded-full">
            Cohort Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1">
            Tour Groups &amp; Guided Cohorts
          </h1>
          <p className="text-xs text-gray-500">
            Organize travelers into shared departure cohorts, assign field tour coordinators, and monitor capacity.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 text-xs font-bold bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Tour Cohort</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
        <div className="flex items-center gap-2 w-full md:w-80 bg-neutral-50 px-3.5 py-2 rounded-xl border border-gray-200/80">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search cohort or trip..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs w-full outline-none"
          />
        </div>
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading tour groups...</p>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl bg-white">
          <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-black">No Tour Cohorts Configured</p>
          <p className="text-[11px] text-gray-400">Click "New Tour Cohort" to build a group departure.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGroups.map((group) => {
            const memberCount = group.members?.length || 0;
            const occupancyPct = Math.round((memberCount / (group.maxSize || 20)) * 100);

            return (
              <div key={group.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                        Cohort ID #{group.id.slice(0, 6)}
                      </span>
                      <h3 className="font-bold text-base text-black mt-1.5">{group.name}</h3>
                      <p className="text-xs text-gray-500 font-medium">
                        Linked Itinerary: <span className="font-semibold text-black">{group.trip?.title}</span>
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {group.status}
                    </span>
                  </div>

                  {/* Occupancy bar */}
                  <div className="mt-4 mb-4">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-500">Cohort Occupancy</span>
                      <span className="text-black font-bold">{memberCount} / {group.maxSize} Members ({occupancyPct}%)</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-black h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Assigned Coordinator */}
                  <div className="p-3 bg-neutral-50 rounded-2xl border border-gray-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-neutral-200 text-black flex items-center justify-center text-xs font-bold shrink-0">
                        {group.coordinator?.avatarUrl ? (
                          <img src={group.coordinator.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <Shield className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Field Coordinator</p>
                        <p className="text-xs font-bold text-black">{group.coordinator?.name || 'Unassigned'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500">{group.coordinator?.email || ''}</span>
                  </div>

                  {/* Members Avatars List */}
                  {group.members && group.members.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Enrolled Travelers</p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.members.map((m) => (
                          <span
                            key={m.id}
                            className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-lg text-[11px] font-medium text-gray-700"
                          >
                            <User className="w-3 h-3 text-gray-400" />
                            <span>{m.user?.name || 'Member'}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 mt-5 pt-3">
                  <span className="text-[11px] text-gray-400">
                    Departure: {group.trip?.startDate ? new Date(group.trip.startDate).toLocaleDateString() : 'TBD'}
                  </span>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Group"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Cohort */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h2 className="text-lg font-black text-black">Create Guided Tour Cohort</h2>
            <p className="text-xs text-gray-500">Group travelers onto a single itinerary with dedicated coordinator.</p>

            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase">Cohort Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn Tuscany & Rome Odyssey - Cohort 1"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase">Parent Trip Itinerary *</label>
                <select
                  required
                  value={newGroup.tripId}
                  onChange={(e) => setNewGroup({ ...newGroup, tripId: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-black"
                >
                  <option value="">Select an itinerary...</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>{t.title} ({t.currency} {t.budget})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 uppercase">Assign Coordinator</label>
                  <select
                    value={newGroup.coordinatorId}
                    onChange={(e) => setNewGroup({ ...newGroup, coordinatorId: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-black"
                  >
                    <option value="">No coordinator yet</option>
                    {coordinators.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 uppercase">Max Size (Pax)</label>
                  <input
                    type="number"
                    min="2"
                    max="100"
                    value={newGroup.maxSize}
                    onChange={(e) => setNewGroup({ ...newGroup, maxSize: parseInt(e.target.value) || 16 })}
                    className="w-full mt-1 p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold bg-black text-white rounded-xl hover:bg-neutral-800 cursor-pointer shadow-xs"
                >
                  {submitting ? 'Creating...' : 'Initialize Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
