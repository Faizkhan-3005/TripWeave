import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Mail, Phone, Calendar, CheckCircle2, 
  MapPin, Plus, RefreshCw, UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const CoordinatorManagementPage: React.FC = () => {
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedCoord, setSelectedCoord] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coordsRes, groupsRes] = await Promise.all([
        api.operator.getCoordinators(),
        api.tourGroups.list(),
      ]);
      setCoordinators(coordsRes.coordinators);
      setGroups(groupsRes.groups);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load coordinators');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !selectedCoord) {
      toast.error('Please select both a group and a coordinator');
      return;
    }

    try {
      setAssigning(true);
      await api.operator.assignCoordinator({
        groupId: selectedGroup,
        coordinatorId: selectedCoord,
      });
      toast.success('Field coordinator assigned successfully!');
      setSelectedGroup('');
      setSelectedCoord('');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign coordinator');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded-full">
            Field Leadership
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1">
            Tour Coordinator Management
          </h1>
          <p className="text-xs text-gray-500">
            Assign on-the-ground travel guides and field coordinators to lead departures and handle real-time traveler needs.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 text-xs font-bold bg-[#f3f3f6] hover:bg-gray-200 text-black px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Staff</span>
        </button>
      </div>

      {/* Quick Assignment Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <h2 className="text-sm font-bold text-black mb-1">Quick Dispatch Assignment</h2>
        <p className="text-xs text-gray-500 mb-4">Pair an available field coordinator with an active tour cohort.</p>

        <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase">Tour Cohort *</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full mt-1 p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-black"
            >
              <option value="">Select Tour Cohort...</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.coordinator ? `Current: ${g.coordinator.name}` : 'Unassigned'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase">Field Coordinator *</label>
            <select
              value={selectedCoord}
              onChange={(e) => setSelectedCoord(e.target.value)}
              className="w-full mt-1 p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-black"
            >
              <option value="">Select Staff Member...</option>
              {coordinators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.role}) - {c.coordinatorGroups?.length || 0} active tours
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={assigning}
            className="w-full py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
          >
            {assigning ? 'Dispatching...' : 'Confirm Assignment'}
          </button>
        </form>
      </div>

      {/* Staff Roster Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading coordinator roster...</p>
        </div>
      ) : coordinators.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl bg-white">
          <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-black">No Coordinators Registered</p>
          <p className="text-[11px] text-gray-400">Users with COORDINATOR or OPERATOR roles will display here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coordinators.map((coord) => (
            <div key={coord.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-black flex items-center justify-center font-bold text-base shrink-0 overflow-hidden">
                    {coord.avatarUrl ? (
                      <img src={coord.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="w-5 h-5 text-gray-700" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-black truncate">{coord.name}</h3>
                    <p className="text-[11px] text-gray-500 truncate">{coord.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                      {coord.role}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500 font-medium">Assigned Tours</span>
                    <span className="font-bold text-black bg-neutral-100 px-2 py-0.5 rounded">
                      {coord.coordinatorGroups?.length || 0} Cohorts
                    </span>
                  </div>

                  {coord.coordinatorGroups && coord.coordinatorGroups.length > 0 ? (
                    <div className="space-y-1.5 mt-2">
                      {coord.coordinatorGroups.map((cg: any) => (
                        <div key={cg.id} className="p-2 bg-neutral-50 rounded-xl text-[11px] border border-gray-100">
                          <p className="font-bold text-black truncate">{cg.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{cg.trip?.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic mt-2">Currently available for dispatch.</p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 mt-5 pt-3 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <UserCheck className="w-3.5 h-3.5" />
                  Active Coordinator
                </span>
                <span>ID #{coord.id.slice(0, 6)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
