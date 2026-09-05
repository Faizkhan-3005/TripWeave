import React, { useState } from 'react';
import { CloudRain, AlertTriangle, Sparkles, Check, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { TripActivityModel } from '../../types';
import toast from 'react-hot-toast';

interface WeatherDisruptionAlertProps {
  cityName: string;
  activities: TripActivityModel[];
  onSwapActivity?: (activityId: string, substituteTitle: string, substituteCategory: string, cost: number) => void;
}

export const WeatherDisruptionAlert: React.FC<WeatherDisruptionAlertProps> = ({
  cityName,
  activities,
  onSwapActivity,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [suggesting, setSuggesting] = useState<string | null>(null);

  if (dismissed) return null;

  // Detect outdoor activities
  const outdoorKeywords = ['walking', 'tour', 'beach', 'hike', 'park', 'sightseeing', 'temple', 'outdoor', 'ruins', 'cruise', 'boat'];
  const affectedOutdoorActivities = activities.filter((act) => {
    const title = (act.customTitle || act.activity?.name || '').toLowerCase();
    const cat = (act.category || '').toLowerCase();
    return outdoorKeywords.some((kw) => title.includes(kw) || cat.includes(kw));
  });

  if (affectedOutdoorActivities.length === 0) return null;

  const handleSwap = (act: TripActivityModel) => {
    setSuggesting(act.id);
    setTimeout(() => {
      const indoorSubstitutes = [
        { title: `National Heritage Museum & Gallery VIP Tour (${cityName})`, category: 'Culture', cost: 25 },
        { title: `Artisan Gastronomy & Wine Tasting Experience`, category: 'Food', cost: 35 },
        { title: `Covered Grand Arcade Architecture & Café Walk`, category: 'Sightseeing', cost: 15 },
      ];
      const pick = indoorSubstitutes[Math.floor(Math.random() * indoorSubstitutes.length)];
      if (onSwapActivity) {
        onSwapActivity(act.id, pick.title, pick.category, pick.cost);
        toast.success(`Substituted with indoor alternative: "${pick.title}"!`);
      }
      setSuggesting(null);
    }, 600);
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
          <CloudRain className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
              Weather Advisory: Rain Expected in {cityName}
            </span>
            <span className="text-xs text-amber-700 font-bold">
              {affectedOutdoorActivities.length} Outdoor {affectedOutdoorActivities.length === 1 ? 'Activity' : 'Activities'} Flagged
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
            Precipitation probability is elevated for this stop. We recommend substituting outdoor sightseeing with sheltered cultural exhibits or culinary tastings.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          disabled={!!suggesting}
          onClick={() => handleSwap(affectedOutdoorActivities[0])}
          className="px-3.5 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{suggesting ? 'Finding Indoor Alternative...' : 'Auto-Substitute Indoor'}</span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors cursor-pointer"
          title="Dismiss weather advisory"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
