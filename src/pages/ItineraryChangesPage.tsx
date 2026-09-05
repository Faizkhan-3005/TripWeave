import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle2, XCircle, Clock, RefreshCw, 
  CloudRain, Calendar, ArrowRight, ShieldAlert, Check, X, FileText,
  Sparkles, Layers, DollarSign
} from 'lucide-react';
import { api } from '../services/api';
import { ItineraryChangeModel } from '../types';
import { ChangeSimulationModal } from '../components/itinerary/ChangeSimulationModal';
import toast from 'react-hot-toast';

export const ItineraryChangesPage: React.FC = () => {
  const [changes, setChanges] = useState<ItineraryChangeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [simulationModalOpen, setSimulationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadChanges();
  }, [statusFilter]);

  const loadChanges = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await api.changes.list(params);
      setChanges(res.changes);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load itinerary changes');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setProcessingId(id);
      await api.changes.resolve(id, status);
      toast.success(`Change ${status}`);
      loadChanges();
    } catch (err: any) {
      toast.error(err.message || `Failed to resolve change`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded-full">
            Disruption Control &amp; AI
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1">
            Dynamic Itinerary Changes &amp; Audit Log
          </h1>
          <p className="text-xs text-gray-500">
            Audit weather rerouting, supplier rescheduling, activity substitutions, and cascade impacts on traveler itineraries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimulationModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Simulate Disruption</span>
          </button>

          <button
            onClick={loadChanges}
            disabled={loading}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-black rounded-2xl transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs flex items-center gap-1 overflow-x-auto">
        {['ALL', 'pending', 'approved', 'auto_applied', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              statusFilter === st ? 'bg-black text-white shadow-xs' : 'text-gray-500 hover:text-black hover:bg-gray-100'
            }`}
          >
            {st.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Changes List */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Loading audit log...</p>
          </div>
        ) : changes.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-black">No Changes Found</p>
            <p className="text-[11px] text-gray-400">All itineraries are adhering to their planned schedule.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {changes.map((change) => {
              let impactData: any = null;
              if (change.impact) {
                try {
                  impactData = JSON.parse(change.impact);
                } catch (e) {
                  impactData = null;
                }
              }

              return (
                <div key={change.id} className="p-5 rounded-2xl bg-neutral-50 border border-gray-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                        {change.changeType}
                      </span>
                      <span className="text-xs font-bold text-black truncate">
                        Trip: {change.trip?.title}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        change.status === 'approved' || change.status === 'auto_applied'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : change.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {change.status}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-black">
                      {change.description}
                    </p>

                    {change.oldValue && change.newValue && (
                      <div className="flex items-center gap-2 text-xs bg-white p-2.5 rounded-xl border border-gray-200/80 font-mono">
                        <span className="text-red-600 line-through truncate">{change.oldValue}</span>
                        <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="text-emerald-700 font-bold truncate">{change.newValue}</span>
                      </div>
                    )}

                    {change.reason && (
                      <p className="text-[11px] text-gray-500">
                        <span className="font-bold text-gray-700">Root Reason:</span> {change.reason}
                      </p>
                    )}

                    {impactData && (
                      <div className="space-y-2 pt-2">
                        {/* Summary & Tags */}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                          {impactData.severity && (
                            <span className={`px-2 py-0.5 rounded uppercase ${
                              impactData.severity === 'high' || impactData.severity === 'critical'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              Risk: {impactData.severity}
                            </span>
                          )}
                          {impactData.budgetVariance !== undefined && (
                            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700">
                              Variance: ${impactData.budgetVariance}
                            </span>
                          )}
                          {impactData.scheduleShiftHours !== undefined && (
                            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700">
                              Schedule Shift: {impactData.scheduleShiftHours} hrs
                            </span>
                          )}
                        </div>

                        {/* Cascading Notes */}
                        {impactData.cascadingNotes && impactData.cascadingNotes.length > 0 && (
                          <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200/80 text-[11px] text-gray-600 space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                              Cascade Log
                            </span>
                            {impactData.cascadingNotes.map((note: string, nIdx: number) => (
                              <p key={nIdx} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                <span>{note}</span>
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Ranked Alternatives */}
                        {impactData.rankedAlternatives && impactData.rankedAlternatives.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 block mb-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Ranked AI Alternatives &amp; Mitigations
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {impactData.rankedAlternatives.slice(0, 2).map((alt: any, aIdx: number) => (
                                <div key={aIdx} className="bg-white p-2.5 rounded-xl border border-purple-100 shadow-2xs">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-black">{alt.title}</span>
                                    <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                                      {alt.matchScore}% Match
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                                    {alt.reason}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4">
                    <div className="text-right hidden sm:block text-[11px]">
                      <p className="text-gray-400">Initiated By</p>
                      <p className="font-bold text-black">{change.initiator?.name || 'System'}</p>
                      <p className="text-[10px] text-gray-400">{new Date(change.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    {change.status === 'pending' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleResolve(change.id, 'approved')}
                          disabled={processingId === change.id}
                          className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleResolve(change.id, 'rejected')}
                          disabled={processingId === change.id}
                          className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-black rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Disruption Simulation Modal */}
      {simulationModalOpen && (
        <ChangeSimulationModal
          isOpen={simulationModalOpen}
          onClose={() => setSimulationModalOpen(false)}
          tripId={changes[0]?.tripId || 'demo-trip-id'}
          tripTitle={changes[0]?.trip?.title || 'Tour Itinerary'}
          onSubmitted={() => loadChanges()}
        />
      )}
    </div>
  );
};
