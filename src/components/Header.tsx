import React, { useState, useRef, useEffect } from 'react';
import { Plane, LogOut, Bookmark, Ticket, Compass } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onLogout: () => void;
  onOpenOnboarding: () => void;
  onOpenAppPreview: () => void;
  onOpenReviews: () => void;
  onOpenAbout: () => void;
  onOpenBlog: () => void;
  onOpenBookings: () => void;
  onScrollToDestinations: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onOpenOnboarding,
  onOpenAppPreview,
  onOpenReviews,
  onOpenAbout,
  onOpenBlog,
  onOpenBookings,
  onScrollToDestinations,
  savedCount
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header id="main-navigation" className="w-full bg-[#f9f9f9]/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#e5e5e5] transition-all">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-10 py-3 sm:py-5 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Brand Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group text-left shrink-0 min-w-0"
        >
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black text-white flex items-center justify-center transition-transform group-hover:scale-105 duration-200 shrink-0">
            <Plane className="w-3.5 h-3.5 sm:w-5 sm:h-5 -rotate-45" />
          </div>
          <span className="text-base sm:text-2xl font-black tracking-tight text-black font-sans truncate">
            Tripweave
          </span>
        </button>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          <button
            id="nav-link-about"
            onClick={onOpenAbout}
            className="text-base text-[#5c5d6e] hover:text-black font-medium transition-colors cursor-pointer"
          >
            About us
          </button>
          <button
            id="nav-link-reviews"
            onClick={onOpenReviews}
            className="text-base text-[#5c5d6e] hover:text-black font-medium transition-colors cursor-pointer"
          >
            Reviews
          </button>
          <button
            id="nav-link-destinations"
            onClick={onScrollToDestinations}
            className="text-base text-[#5c5d6e] hover:text-black font-medium transition-colors cursor-pointer"
          >
            Destinations
          </button>
          <button
            id="nav-link-blog"
            onClick={onOpenBlog}
            className="text-base text-[#5c5d6e] hover:text-black font-medium transition-colors cursor-pointer"
          >
            Our blog
          </button>
        </nav>

        {/* Right: Actions & Download App Button */}
        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          {/* Download App CTA */}
          <button
            id="nav-download-app-btn"
            onClick={onOpenAppPreview}
            className="px-2.5 sm:px-6 py-1.5 sm:py-2.5 rounded-full border border-black text-black text-[11px] sm:text-sm font-semibold hover:bg-black hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <span className="hidden sm:inline">Download App</span>
            <span className="sm:hidden">App</span>
          </button>

          {/* User Account / Auth Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                id="nav-user-menu-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black text-white hover:opacity-90 transition-opacity cursor-pointer text-[11px] sm:text-sm"
              >
                {(user.avatar || user.avatarUrl) ? (
                  <img src={user.avatar || user.avatarUrl!} alt={user.name} className="w-5 sm:w-7 h-5 sm:h-7 rounded-full object-cover border border-white/40" />
                ) : (
                  <div className="w-5 sm:w-7 h-5 sm:h-7 rounded-full bg-[#5c5d6e] flex items-center justify-center text-[9px] sm:text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs sm:text-sm font-medium hidden md:inline max-w-[100px] truncate">{user.name}</span>
                {(user.bookings?.length ?? 0) > 0 && (
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400"></span>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#dadada] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-[#dadada]/60">
                    <p className="text-sm font-bold text-black truncate">{user.name}</p>
                    <p className="text-xs text-[#5c5d6e] truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      id="dropdown-bookings-btn"
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenBookings();
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-black hover:bg-[#f3f3f4] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <Ticket className="w-4 h-4 text-[#5c5d6e]" />
                        My Booked Tours
                      </span>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#e3e2f7] text-black">
                        {user.bookings?.length ?? 0}
                      </span>
                    </button>

                    <button
                      id="dropdown-saved-btn"
                      onClick={() => {
                        setDropdownOpen(false);
                        onScrollToDestinations();
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-black hover:bg-[#f3f3f4] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <Bookmark className="w-4 h-4 text-[#5c5d6e]" />
                        Saved Wishlist
                      </span>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#f3f3f4] text-black">
                        {savedCount}
                      </span>
                    </button>

                    <button
                      id="dropdown-plan-preferences-btn"
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenOnboarding();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-black hover:bg-[#f3f3f4] transition-colors cursor-pointer"
                    >
                      <Compass className="w-4 h-4 text-[#5c5d6e]" />
                      Travel Preferences
                    </button>
                  </div>

                  <div className="pt-1 border-t border-[#dadada]/60">
                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="nav-signin-btn"
              onClick={() => onOpenAuth('signin')}
              className="text-xs sm:text-sm font-semibold text-black hover:text-[#5c5d6e] px-1 sm:px-2 py-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
