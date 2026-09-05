import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, Compass, AlertTriangle, Briefcase, ChevronDown, 
  ChevronUp, CheckCircle2, Ticket, ShieldCheck, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const DemoSwitcherBar: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const switchRole = (newRole: 'TRAVELER' | 'OPERATOR' | 'COORDINATOR' | 'ADMIN', targetPath?: string) => {
    updateUser({ role: newRole });
    toast.success(`Active Mode: ${newRole} 🎭`, {
      icon: '✨',
      style: { borderRadius: '12px', background: '#000', color: '#fff' },
    });
    if (targetPath) {
      navigate(targetPath);
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 transition-all duration-300">
      <div className="bg-neutral-900/95 backdrop-blur-xl border border-white/15 text-white rounded-full shadow-2xl px-4 py-2 flex items-center gap-3">
        {/* Pitch Demo Pill Tag */}
        <div className="flex items-center gap-1.5 pl-1 pr-2 border-r border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" /> Pitch Demo
          </span>
        </div>

        {!collapsed ? (
          <div className="flex items-center gap-2">
            {/* 1. Traveler Journey Track */}
            <button
              onClick={() => switchRole('TRAVELER', '/app/trips')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                user?.role === 'TRAVELER' && !location.pathname.includes('/operator')
                  ? 'bg-white text-black shadow-sm scale-105'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Traveler Hub</span>
            </button>

            {/* 2. Bookings Hub */}
            <button
              onClick={() => switchRole('TRAVELER', '/app/bookings')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                location.pathname === '/app/bookings'
                  ? 'bg-emerald-500 text-black shadow-sm scale-105 font-black'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Vouchers</span>
            </button>

            {/* 3. Disruption & AI Engine Track */}
            <button
              onClick={() => switchRole('OPERATOR', '/app/operator/changes')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                location.pathname === '/app/operator/changes'
                  ? 'bg-amber-400 text-black shadow-sm scale-105 font-black'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Weather & AI Disruption</span>
            </button>

            {/* 4. Operator Portal Track */}
            <button
              onClick={() => switchRole('OPERATOR', '/app/operator')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                user?.role === 'OPERATOR' && location.pathname === '/app/operator'
                  ? 'bg-purple-500 text-white shadow-sm scale-105 font-black'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Operator Dashboard</span>
            </button>
          </div>
        ) : (
          <span className="text-xs font-bold text-neutral-400 px-2">
            Mode: <strong className="text-white">{user?.role || 'TRAVELER'}</strong>
          </span>
        )}

        {/* Toggle Minimize Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
          title={collapsed ? 'Expand Demo Switcher' : 'Minimize Demo Switcher'}
        >
          {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
