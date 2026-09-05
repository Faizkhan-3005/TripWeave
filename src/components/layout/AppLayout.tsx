import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Plane, LayoutDashboard, MapPin, Plus, Search, Calendar, 
  BarChart3, User, LogOut, ChevronRight, Menu, X, Sparkles,
  Compass, Ticket, ArrowUpRight, Shield, Command, Building2,
  Users, CreditCard, AlertTriangle, Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SpotlightSearchModal } from '../common/SpotlightSearchModal';

export const AppLayout: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [spotlightOpen, setSpotlightOpen] = useState<boolean>(false);

  // Global Cmd+K / Ctrl+K / '/' listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSpotlightOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isOperatorOrAdmin = user?.role === 'OPERATOR' || user?.role === 'ADMIN' || user?.role === 'COORDINATOR';

  const travelerNavItems = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/app/trips', label: 'My Trips', icon: MapPin },
    { to: '/app/search', label: 'Explore Cities', icon: Compass },
    { to: '/app/activities', label: 'Activity Catalog', icon: Sparkles },
    { to: '/app/calendar', label: 'Master Schedule', icon: Calendar },
    { to: '/app/analytics', label: 'Travel Analytics', icon: BarChart3 },
    { to: '/app/profile', label: 'Profile & Wishlist', icon: User },
  ];

  const operatorNavItems = [
    { to: '/app/operator', label: 'Operator Hub', icon: Briefcase, exact: true },
    { to: '/app/operator/bookings', label: 'Bookings & Inventory', icon: Ticket },
    { to: '/app/operator/vendors', label: 'Vendors & Supply', icon: Building2 },
    { to: '/app/operator/tour-groups', label: 'Tour Cohorts', icon: Users },
    { to: '/app/operator/coordinators', label: 'Tour Guides/Staff', icon: Shield },
    { to: '/app/operator/changes', label: 'Itinerary Alerts', icon: AlertTriangle },
    { to: '/app/operator/payments', label: 'Payments Ledger', icon: CreditCard },
    { to: '/app/operator/schedule', label: 'Global Calendar', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9fb] text-[#1a1c1c] flex font-sans">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-[#e5e5ea] sticky top-0 h-screen z-30 justify-between">
        <div className="p-6 overflow-y-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-black block leading-none">
                Tripweave
              </span>
              <span className="text-[10px] font-bold text-[#5c5d6e] uppercase tracking-wider">
                Tour Platform
              </span>
            </div>
          </Link>

          {/* Quick Role Badge & Switcher */}
          <div className="mb-6 p-2.5 rounded-2xl bg-[#fafafa] border border-gray-200/60 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider block">Active Mode</span>
              <span className="text-xs font-black text-black">{user?.role || 'TRAVELER'}</span>
            </div>
            <select
              value={user?.role || 'TRAVELER'}
              onChange={(e) => {
                const newRole = e.target.value as any;
                updateUser({ role: newRole });
                toast.success(`Switched view to ${newRole}`);
              }}
              className="text-[11px] font-bold bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none text-black cursor-pointer hover:border-black transition-colors"
            >
              <option value="TRAVELER">Traveler</option>
              <option value="OPERATOR">Operator</option>
              <option value="COORDINATOR">Coordinator</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* "+ Plan New Trip" Primary CTA */}
          <Link
            to="/app/trips/new"
            className="w-full bg-black text-white py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-sm mb-6 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Trip</span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-4">
            {/* Operator Section if permitted or selected */}
            {(isOperatorOrAdmin || user?.role === 'OPERATOR') && (
              <div>
                <p className="px-3 text-[10px] uppercase font-extrabold text-purple-700 tracking-wider mb-1.5 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  <span>Tour Operations</span>
                </p>
                <div className="space-y-0.5">
                  {operatorNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact 
                      ? location.pathname === item.to 
                      : location.pathname.startsWith(item.to);

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-black text-white font-bold shadow-xs'
                            : 'text-[#5c5d6e] hover:text-black hover:bg-[#f3f3f6]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#71717a]'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Traveler Section */}
            <div>
              <p className="px-3 text-[10px] uppercase font-extrabold text-gray-400 tracking-wider mb-1.5">
                Traveler Workspace
              </p>
              <div className="space-y-0.5">
                {travelerNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact 
                    ? location.pathname === item.to 
                    : location.pathname.startsWith(item.to);

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#e3e2f7] text-black font-bold shadow-xs'
                          : 'text-[#5c5d6e] hover:text-black hover:bg-[#f3f3f6]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[#71717a]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Platform Admin */}
            {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
              <div>
                <p className="px-3 text-[10px] uppercase font-extrabold text-gray-400 tracking-wider mb-1.5">
                  Platform System
                </p>
                <NavLink
                  to="/app/admin"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-neutral-800 text-white font-bold'
                        : 'text-[#5c5d6e] hover:text-black hover:bg-[#f3f3f6]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Telemetry</span>
                  </div>
                </NavLink>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom User Card in Sidebar */}
        <div className="p-4 border-t border-[#e5e5ea] bg-white">
          <div className="p-2 rounded-2xl bg-[#fafafa] border border-[#f0f0f2] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border border-black/10 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-black truncate">{user?.name}</p>
                <p className="text-[10px] text-[#71717a] truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-[#71717a] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#e5e5ea] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          
          {/* Mobile Brand / Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-black hover:bg-gray-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/app" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
                <Plane className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-sm text-black">Tripweave</span>
            </Link>
          </div>

          {/* Quick Search trigger - Spotlight Command Palette */}
          <div 
            className="hidden sm:flex items-center gap-2 bg-[#f3f3f6] hover:bg-[#eaeaea] rounded-full px-4 py-2 text-xs text-[#5c5d6e] w-72 md:w-96 cursor-pointer border border-transparent hover:border-gray-300 transition-all shadow-2xs group"
            onClick={() => setSpotlightOpen(true)}
          >
            <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-black transition-colors" />
            <span className="group-hover:text-black transition-colors">Universal Search (Trips, Cities, Actions)...</span>
            <kbd className="ml-auto bg-white px-2 py-0.5 rounded text-[10px] text-gray-500 font-mono border border-gray-200 font-bold shadow-2xs flex items-center gap-0.5">
              <span>⌘</span><span>K</span>
            </kbd>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <Link
              to="/destinations"
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#5c5d6e] hover:text-black px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Explore Public Catalog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/app/trips/new"
              className="sm:hidden bg-black text-white p-2 rounded-xl text-xs font-bold flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </Link>

            {/* Profile Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover border border-black/10"
                />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 text-xs font-semibold text-gray-700 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-gray-100">
                    <p className="font-bold text-black truncate">{user?.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link to="/app/profile" className="flex items-center gap-2 px-3.5 py-2 hover:bg-gray-50">
                    <User className="w-3.5 h-3.5" /> Profile &amp; Settings
                  </Link>
                  <Link to="/app/analytics" className="flex items-center gap-2 px-3.5 py-2 hover:bg-gray-50">
                    <BarChart3 className="w-3.5 h-3.5" /> Travel Analytics
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 hover:bg-red-50 text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 p-4 space-y-2 z-20 max-h-[80vh] overflow-y-auto">
            <Link
              to="/app/trips/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-black text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mb-3"
            >
              <Plus className="w-4 h-4" /> Create New Trip
            </Link>

            {isOperatorOrAdmin && (
              <div className="mb-2">
                <p className="px-3 text-[10px] uppercase font-bold text-purple-700 tracking-wider mb-1">
                  Tour Operations
                </p>
                {operatorNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                        isActive ? 'bg-black text-white font-bold' : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}

            <div>
              <p className="px-3 text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                Traveler Workspace
              </p>
              {travelerNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-[#e3e2f7] text-black font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Main Routed Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global MacBook-Style Spotlight Universal Command Palette */}
      <SpotlightSearchModal
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
      />

    </div>
  );
};
