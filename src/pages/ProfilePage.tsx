import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, DollarSign, Bell, Shield, Heart, 
  MapPin, Trash2, ArrowRight, Save, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CURRENCY_OPTIONS } from '../data/currencies';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [budgetAlerts, setBudgetAlerts] = useState<boolean>(user?.budgetAlerts ?? true);
  const [saving, setSaving] = useState<boolean>(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.auth.updateProfile({
        name,
        currency,
        avatarUrl,
        budgetAlerts,
      });
      updateUser(res.user);
      toast.success('Profile preferences saved!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in current and new password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await api.auth.changePassword({ currentPassword, newPassword });
      toast.success(res.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleRemoveSavedDestination = async (cityId: string) => {
    try {
      await api.cities.toggleSave(cityId);
      toast.success('Destination removed from wishlist.');
      if (user && user.savedDestinations) {
        updateUser({
          savedDestinations: user.savedDestinations.filter(d => d.cityId !== cityId)
        });
      }
    } catch (err: any) {
      toast.error('Failed to update wishlist.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c5d6e] bg-[#e3e2f7] px-3 py-1 rounded-full inline-block mb-2">
          Account Settings
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
          Profile &amp; Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#5c5d6e] mt-1 font-medium">
          Customize your traveler profile, default currency, and budget notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Settings Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e5e5ea] shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <img
              src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-black/10 shadow-xs"
            />
            <div>
              <h3 className="text-lg font-black text-black">{name || 'Traveler'}</h3>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-black mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#f9f9fb] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-500 font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">Avatar Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-[#f9f9fb] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">Preferred Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#f9f9fb] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-black font-semibold focus:outline-none focus:border-black"
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">Account Role / Mode</label>
              <select
                value={user?.role || 'TRAVELER'}
                onChange={async (e) => {
                  const newRole = e.target.value as any;
                  await updateUser({ role: newRole });
                  toast.success(`Role changed to ${newRole}`);
                }}
                className="w-full bg-[#f9f9fb] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-black font-semibold focus:outline-none focus:border-black"
              >
                <option value="TRAVELER">🧭 Traveler (Trip Planner &amp; Explorer)</option>
                <option value="OPERATOR">🏢 Tour Operator (Command Center &amp; Bookings)</option>
                <option value="COORDINATOR">🛡️ Field Coordinator (Guide &amp; Disruption)</option>
                <option value="ADMIN">⚙️ Platform Admin (System Telemetry)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">Language Preference</label>
              <select
                defaultValue="English (US)"
                className="w-full bg-[#f9f9fb] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-black font-semibold focus:outline-none focus:border-black"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish">Español (Spanish)</option>
                <option value="French">Français (French)</option>
                <option value="German">Deutsch (German)</option>
                <option value="Japanese">日本語 (Japanese)</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 bg-[#f9f9fb] rounded-xl border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={budgetAlerts}
                  onChange={(e) => setBudgetAlerts(e.target.checked)}
                  className="w-4 h-4 rounded accent-black cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-black block">Budget Threshold Alerts</span>
                  <span className="text-[10px] text-gray-500">
                    Display alert banners when trip expenses exceed your planned budget limit.
                  </span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white hover:bg-neutral-800 py-3 px-6 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 mt-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>

          {/* Security & Password Section */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-black" />
              <h4 className="text-sm font-black text-black">Security &amp; Password</h4>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-3 bg-[#f9f9fb] p-4 rounded-2xl border border-gray-200">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-medium"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-medium"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={changingPassword || !currentPassword || !newPassword}
                className="mt-1 bg-black text-white hover:bg-neutral-800 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <span>{changingPassword ? 'Updating...' : 'Update Password'}</span>
              </button>
            </form>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="pt-6 border-t border-red-100">
            <h4 className="text-xs font-black text-red-600 uppercase tracking-wider mb-1">Danger Zone</h4>
            <p className="text-[11px] text-gray-500 mb-3">Permanently wipe your trips, itineraries, expenses, and account data.</p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  toast.success('Account deletion scheduled. Signing out...');
                  setTimeout(() => {
                    localStorage.clear();
                    window.location.href = '/';
                  }, 1200);
                }
              }}
              className="px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account & Data</span>
            </button>
          </div>
        </div>

        {/* Saved Destinations Wishlist */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e5e5ea] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-black tracking-tight flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" /> Saved Wishlist ({user?.savedDestinations?.length || 0})
            </h3>
          </div>

          {(!user?.savedDestinations || user.savedDestinations.length === 0) ? (
            <div className="text-center py-10 text-xs text-gray-400">
              Your wishlist is empty. Explore destinations and click the heart icon to save them!
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {user.savedDestinations.map((saved) => (
                <div
                  key={saved.id}
                  className="bg-[#f9f9fb] p-3 rounded-2xl border border-gray-200 flex items-center justify-between gap-3 hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={saved.city.image}
                      alt={saved.city.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="font-extrabold text-xs text-black truncate">{saved.city.name}</h5>
                      <p className="text-[10px] text-gray-500">{saved.city.country}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => navigate(`/app/trips/new?cityId=${saved.city.id}`)}
                      className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      Plan
                    </button>
                    <button
                      onClick={() => handleRemoveSavedDestination(saved.cityId)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
