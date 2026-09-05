import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Plane, ArrowRight, Lock, Mail, Sparkles, 
  Eye, EyeOff, ShieldCheck, Database 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PublicNavbar } from '../components/layout/PublicNavbar';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/app';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    const success = await login(email.trim(), password);
    setSubmitting(false);

    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@tripweave.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9fb] text-[#1a1c1c] font-sans">
      <PublicNavbar />

      <div className="flex-grow flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white rounded-[36px] p-8 sm:p-10 border border-[#e5e5ea] shadow-xl relative overflow-hidden animate-in fade-in duration-300">
          
          {/* Top Decorative Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Plane className="w-6 h-6 fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-sans">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-[#5c5d6e] mt-1 font-medium">
              Sign in with your PostgreSQL database account
            </p>
          </div>

          {/* Quick Demo Pre-fill Banner */}
          <div className="mb-6 bg-[#e3e2f7] p-3.5 rounded-2xl border border-[#d2d1ee] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-black shrink-0" />
              <div>
                <p className="text-xs font-bold text-black">Seeded Demo Account</p>
                <p className="text-[10px] text-gray-700">demo@tripweave.com</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={async () => {
                  setSubmitting(true);
                  const ok = await login('demo@tripweave.com', 'password123');
                  setSubmitting(false);
                  if (ok) navigate(from, { replace: true });
                }}
                type="button"
                className="bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-xl hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
              >
                1-Click Login
              </button>
            </div>
          </div>

          {/* PostgreSQL Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-[#1a1c1c]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl pl-10 pr-11 py-3 text-xs sm:text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-black cursor-pointer"
                />
                <span className="text-gray-600 font-medium">Remember this device</span>
              </label>

              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>bcrypt + JWT</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-3.5 rounded-2xl text-xs sm:text-sm font-bold hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 mt-2"
            >
              <span>{submitting ? 'Signing in with PostgreSQL...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Database Indicator */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-400">
            <Database className="w-3.5 h-3.5 text-black" />
            <span>PostgreSQL &bull; Prisma ORM &bull; Encrypted Sessions</span>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center pt-6 border-t border-gray-100">
            <p className="text-xs text-[#5c5d6e]">
              Don't have a Tripweave account yet?{' '}
              <Link to="/signup" className="font-bold text-black hover:underline">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
