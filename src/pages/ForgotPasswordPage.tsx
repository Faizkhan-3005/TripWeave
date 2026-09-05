import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Plane, ArrowRight, Mail, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import toast from 'react-hot-toast';

export const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tokenParam = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const [email, setEmail] = useState(emailParam || '');
  const [token, setToken] = useState(tokenParam || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isResetMode, setIsResetMode] = useState<boolean>(!!tokenParam);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [debugLink, setDebugLink] = useState<string | null>(null);

  useEffect(() => {
    if (tokenParam) {
      setToken(tokenParam);
      setIsResetMode(true);
    }
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [tokenParam, emailParam]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      const res = await api.auth.forgotPassword(email);
      setSubmitted(true);
      if (res.debugLink) {
        setDebugLink(res.debugLink);
      }
      toast.success('Password reset instructions generated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch password reset.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.auth.resetPassword({ token, email, newPassword });
      toast.success(res.message);
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9fb] text-[#1a1c1c]">
      <PublicNavbar />

      <div className="flex-grow flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white rounded-[36px] p-8 sm:p-10 border border-[#e5e5ea] shadow-xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Plane className="w-6 h-6 fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-sans">
              {isResetMode ? 'Choose New Password' : 'Reset Password'}
            </h1>
            <p className="text-xs sm:text-sm text-[#5c5d6e] mt-1.5 font-medium">
              {isResetMode
                ? 'Enter your verified reset token and new credentials'
                : 'We will dispatch secure recovery instructions to your email'}
            </p>
          </div>

          {!isResetMode ? (
            submitted ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-black">Instructions Dispatched</h3>
                <p className="text-xs text-[#5c5d6e] leading-relaxed">
                  If an account matches <span className="font-bold text-black">{email}</span>, you will receive an email shortly with a one-time password reset link.
                </p>

                {debugLink && (
                  <div className="bg-[#e3e2f7] p-3 rounded-2xl text-left border border-[#d2d1ee]">
                    <span className="text-[10px] uppercase font-bold text-black block mb-1">Local Test Link:</span>
                    <a href={debugLink} className="text-xs font-bold text-blue-800 underline break-all">
                      Click to Test Password Reset
                    </a>
                  </div>
                )}

                <button
                  onClick={() => setIsResetMode(true)}
                  className="text-xs font-bold text-black hover:underline block mx-auto pt-2"
                >
                  Already have a reset token? Enter it here &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                    Account Email Address
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

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white py-3.5 rounded-2xl text-xs sm:text-sm font-bold hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 mt-4"
                >
                  <span>{submitting ? 'Dispatching email...' : 'Send Reset Link'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl px-4 py-2.5 text-xs text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                  Reset Token
                </label>
                <input
                  type="text"
                  required
                  placeholder="Paste token from email"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl px-4 py-2.5 text-xs text-black font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl px-4 py-2.5 text-xs text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#f9f9fb] border border-[#e5e5ea] rounded-2xl px-4 py-2.5 text-xs text-black"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white py-3.5 rounded-2xl text-xs sm:text-sm font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 mt-2"
              >
                <span>{submitting ? 'Updating...' : 'Set New Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5c5d6e] hover:text-black">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
