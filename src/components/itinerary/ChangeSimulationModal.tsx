import React, { useState } from 'react';
import { 
  X, AlertTriangle, Sparkles, Building2, Plane, Clock, 
  DollarSign, Check, ShieldAlert, Users, ArrowRight, Loader2
} from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface ChangeSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripTitle: string;
  onSubmitted: () => void;
}

export const ChangeSimulationModal: React.FC<ChangeSimulationModalProps> = ({
  isOpen,
  onClose,
  tripId,
  tripTitle,
  onSubmitted,
}) => {
  const [changeType, setChangeType] = useState<string>('cancellation');
  const [description, setDescription] = useState<string>('Grand Palace Hotel has cancelled reservation due to emergency maintenance.');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickScenarios = [
    {
      title: '🏨 Hotel Partner Cancellation',
      type: 'cancellation',
      desc: 'Boutique Resort has cancelled booking due to unexpected plumbing failure.',
    },
    {
      title: '✈️ Flight 4-Hour Delay',
      type: 'reschedule',
      desc: 'Connecting flight delayed by 4 hours; traveler will miss evening dinner tour.',
    },
    {
      title: '🌧️ Heavy Torrential Rainstorm',
      type: 'weather',
      desc: 'Severe rain and storm warning on Day 2; outdoor walking tour unsafe.',
    },
  ];

  const handleSubmitSimulation = async () => {
    setSubmitting(true);
    try {
      await api.changes.create({
        tripId,
        changeType,
        description,
        reason: 'Automated Disruption Simulation / Operator Dispatch',
      });
      toast.success('Disruption registered! Gemini computed impact and ranked alternatives.');
      onSubmitted();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to file disruption request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#18181b] text-white p-6 px-8 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 flex items-center gap-1 w-fit mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Dynamic Tour Simulator
            </span>
            <h2 className="text-xl font-black tracking-tight">Simulate Itinerary Disruption</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Experience Tripweave's AI impact analysis, schedule recalculations, and alternatives.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5 bg-white">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-2">
              Choose Pre-Seeded Disruption Scenario
            </label>
            <div className="grid grid-cols-1 gap-2">
              {quickScenarios.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setChangeType(s.type);
                    setDescription(s.desc);
                  }}
                  className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                    description === s.desc
                      ? 'border-black bg-zinc-900 text-white shadow-xs font-bold'
                      : 'border-gray-200 bg-[#fafafa] hover:border-gray-400 text-gray-800'
                  }`}
                >
                  <span className="text-xs font-bold block">{s.title}</span>
                  <span className={`text-[11px] block mt-0.5 ${description === s.desc ? 'text-gray-300' : 'text-gray-500'}`}>
                    {s.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Custom Disruption Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-black resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-8 bg-[#fafafa] border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-gray-500 hover:text-black cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={submitting || !description.trim()}
            onClick={handleSubmitSimulation}
            className="px-6 py-2.5 rounded-2xl bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Computing AI Impact...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Trigger AI Impact Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
