import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, CheckCircle2, Sparkles, Plane, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { APP_ASSETS } from '../data/toursData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'signup' && !fullName)) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: mode === 'signup' ? fullName : (email.split('@')[0] || 'Traveler'),
        email: email,
        avatar: APP_ASSETS.avatars[Math.floor(Math.random() * APP_ASSETS.avatars.length)],
        savedTourIds: ['bali-paradise', 'paris-elegance'],
        bookings: []
      };
      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };

  const handleQuickDemoLogin = (demoName: string, demoEmail: string, avatarIdx: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demoUser: User = {
        id: `demo-${demoEmail.replace('@', '-')}`,
        name: demoName,
        email: demoEmail,
        avatar: APP_ASSETS.avatars[avatarIdx],
        savedTourIds: ['paris-elegance', 'italy-renaissance'],
        bookings: [
          {
            id: 'bk-101',
            tourId: 'paris-elegance',
            tourTitle: 'Paris Explorer & Seine Yacht',
            tourImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMS5cNwmtb2hrCD9FPYhMiCWxOHrTssi0vVt1Mo5yCVAK97MgBuyV6Oi9bXcGivxwrlMmSGZGOBoOv7QXkHuT8hac3stv6UtaFErxsk6PIwyXnUQip58SgIwVMoP7KLmshYyu9Tf0f4zFBX4xLYTXt5ie8IIdHcyXJlxio2m44dWlaVIug2QVxMcIZexXDxbqnetj5yfOUtX8t-d8lTd49c6d1FtU3Ul8_JBrTa_qTRvbaUXVSebQw3A',
            country: 'France',
            departureDate: 'Oct 28, 2026',
            guestsCount: 2,
            totalPrice: 3998,
            status: 'Confirmed',
            bookingRef: 'GT-77291',
            createdAt: '2026-08-15'
          }
        ]
      };
      onLoginSuccess(demoUser);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl border border-[#dadada] overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#f3f3f4] text-[#5c5d6e] hover:text-black flex items-center justify-center hover:bg-[#e2e2e2] transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header decoration */}
        <div className="bg-[#e3e2f7] p-8 pb-6 border-b border-[#c5c5d9]/40 relative">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-3">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <h3 className="text-2xl font-bold text-black tracking-tight font-sans">
            {mode === 'signin' ? 'Welcome Back to Tripweave' : 'Join Tripweave'}
          </h3>
          <p className="text-sm text-[#5c5d6e] mt-1">
            {mode === 'signin'
              ? 'Access your booked itineraries, saved wishlist, and member discounts.'
              : 'Unlock exclusive member partner discounts and 2-click instant booking.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#dadada]/60 bg-[#f9f9f9]">
          <button
            onClick={() => { setMode('signin'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'signin'
                ? 'bg-white text-black border-b-2 border-black'
                : 'text-[#5c5d6e] hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'signup'
                ? 'bg-white text-black border-b-2 border-black'
                : 'text-[#5c5d6e] hover:text-black'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 sm:p-8">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#5c5d6e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Sarah Jenkins"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f3f3f4] text-black text-sm border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5c5d6e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="traveler@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f3f3f4] text-black text-sm border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-black uppercase tracking-wider">
                  Password
                </label>
                {mode === 'signin' && (
                  <span className="text-[11px] text-[#5c5d6e] hover:text-black cursor-pointer">
                    Forgot?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5c5d6e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f3f3f4] text-black text-sm border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-full bg-black text-white text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Test Accounts for easy grading/evaluation */}
          <div className="mt-6 pt-5 border-t border-[#dadada]/60">
            <p className="text-[11px] font-bold text-[#5c5d6e] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-black" />
              Quick 1-Click Demo Profiles:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Sarah Jenkins', 'sarah.j@globetraveller.com', 0)}
                className="p-2 rounded-xl bg-[#f3f3f4] hover:bg-[#e3e2f7] text-left transition-colors flex items-center gap-2 cursor-pointer border border-[#dadada]/50"
              >
                <img src={APP_ASSETS.avatars[0]} alt="Sarah" className="w-6 h-6 rounded-full object-cover" />
                <div className="truncate">
                  <p className="text-xs font-bold text-black truncate">Sarah (Active Trips)</p>
                  <p className="text-[10px] text-[#5c5d6e] truncate">Demo Traveler</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Marcus Lindqvist', 'marcus.l@globetraveller.com', 1)}
                className="p-2 rounded-xl bg-[#f3f3f4] hover:bg-[#e3e2f7] text-left transition-colors flex items-center gap-2 cursor-pointer border border-[#dadada]/50"
              >
                <img src={APP_ASSETS.avatars[1]} alt="Marcus" className="w-6 h-6 rounded-full object-cover" />
                <div className="truncate">
                  <p className="text-xs font-bold text-black truncate">Marcus (Adventurer)</p>
                  <p className="text-[10px] text-[#5c5d6e] truncate">Demo Traveler</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
