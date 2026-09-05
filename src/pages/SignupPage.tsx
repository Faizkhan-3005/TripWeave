import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plane, ArrowRight, Lock, Mail, User, 
  Eye, EyeOff, ShieldCheck, Database 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { CURRENCY_OPTIONS } from '../data/currencies';
import toast from 'react-hot-toast';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Live password strength calculations
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const strengthScore = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  const getStrengthLabel = () => {
    if (!password) return { text: 'None', color: 'bg-gray-200', width: '0%' };
    if (strengthScore <= 1) return { text: 'Weak', color: 'bg-red-500', width: '25%' };
    if (strengthScore <= 2) return { text: 'Fair', color: 'bg-amber-500', width: '50%' };
    if (strengthScore === 3) return { text: 'Good', color: 'bg-blue-500', width: '75%' };
    return { text: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      toast.error('Please accept the Terms of Service to continue.');
      return;
    }

    setSubmitting(true);
    const success = await signup(name.trim(), email.trim(), password, currency);
    setSubmitting(false);

    if (success) {
      navigate('/app', { replace: true });
    }
  };

  const strength = getStrengthLabel();

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9fb] text-[#1a1c1c] font-sans">
      <PublicNavbar />

      <div className="flex-grow flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-lg bg-white rounded-[36px] p-8 sm:p-10 border border-[#e5e5ea] shadow-xl relative overflow-hidden animate-in fade-in duration-300">
          
          {/* Top Decorative Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Plane className="w-6 h-6 fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-sans">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-[#5c5d6e] mt-1 font-medium">
              Create a personalized travel planner account in PostgreSQL
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                Email Address *
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
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 8 characters"
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

              {/* Password Strength Progress Bar */}
              {password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400 uppercase tracking-wider">Password Strength</span>
                    <span className={strengthScore >= 3 ? 'text-emerald-600' : strengthScore >= 2 ? 'text-amber-600' : 'text-red-500'}>
                      {strength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-500 pt-1">
                    <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-bold' : ''}`}>
                      {hasMinLength ? '✓' : '•'} 8+ characters
                    </span>
                    <span className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-600 font-bold' : ''}`}>
                      {hasUppercase ? '✓' : '•'} 1 uppercase letter
                    </span>
                    <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-bold' : ''}`}>
                      {hasNumber ? '✓' : '•'} 1 number
                    </span>
                    <span className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-600 font-bold' : ''}`}>
                      {hasSpecial ? '✓' : '•'} 1 special symbol
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-[#f9f9fb] border rounded-2xl pl-10 pr-11 py-3 text-xs sm:text-sm text-black placeholder:text-gray-400 focus:outline-none focus:bg-white transition-all font-medium ${
                    confirmPassword && !passwordsMatch ? 'border-red-400 focus:border-red-500' : 'border-[#e5e5ea] focus:border-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && (
                <p className={`text-[10px] font-bold mt-1 ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl px-4 py-3 text-xs sm:text-sm text-black focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) - {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Terms of Service Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-black cursor-pointer"
                />
                <span className="text-gray-600 leading-relaxed text-[11px]">
                  I agree to the <span className="font-bold text-black underline">Terms of Service</span> and <span className="font-bold text-black underline">Privacy Policy</span>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-3.5 rounded-2xl text-xs sm:text-sm font-bold hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 mt-4"
            >
              <span>{submitting ? 'Creating PostgreSQL Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Database Footer Indicator */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-400">
            <Database className="w-3.5 h-3.5 text-black" />
            <span>Encrypted with bcrypt &bull; Stored in PostgreSQL</span>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center pt-6 border-t border-gray-100">
            <p className="text-xs text-[#5c5d6e]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-black hover:underline">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
