import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, LogIn, Compass, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PublicNavbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-[#f9f9f9]/90 backdrop-blur-md border-b border-black/5 transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-10 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Plane className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
          </div>
          <span className="text-base sm:text-xl font-extrabold tracking-tight text-black font-sans truncate">
            Tripweave
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#5c5d6e]">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <Link to="/destinations" className="hover:text-black transition-colors flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Destinations</span>
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/app"
              className="bg-black text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
            >
              <User className="w-4 h-4" />
              <span>Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-black hover:text-gray-600 px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-black text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

