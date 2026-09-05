import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plane } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg animate-bounce">
          <Plane className="w-6 h-6 fill-current" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#5c5d6e]">
          Preparing Your Tripweave Workspace...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
