import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, currency?: string) => Promise<boolean>;
  demoLogin: () => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateUser: (updated: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tripweave_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      if (token === 'offline-demo-token') {
        setUser({
          id: 'demo-user-offline',
          name: 'Demo Traveler',
          email: 'demo@tripweave.com',
          currency: 'USD',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          budgetAlerts: true,
          savedDestinations: [],
        });
        setLoading(false);
        return;
      }
      const res = await api.auth.getProfile();
      setUser(res.user);
    } catch (err) {
      console.error('Failed to load user profile, token might be invalid:', err);
      localStorage.removeItem('tripweave_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.auth.login({ email, password });
      localStorage.setItem('tripweave_token', res.token);
      setToken(res.token);
      setUser(res.user);
      toast.success(`Welcome back, ${res.user.name}! ✈️`);
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, currency: string = 'USD'): Promise<boolean> => {
    try {
      const res = await api.auth.signup({ name, email, password, currency });
      localStorage.setItem('tripweave_token', res.token);
      setToken(res.token);
      setUser(res.user);
      toast.success(`Welcome to Tripweave, ${res.user.name}! 🎉`);
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Signup failed.');
      return false;
    }
  };

  const demoLogin = async (): Promise<boolean> => {
    const success = await login('demo@tripweave.com', 'password123');
    if (success) return true;

    // Graceful fallback if database is not active
    const fallbackUser: AuthUser = {
      id: 'demo-user-offline',
      name: 'Demo Traveler',
      email: 'demo@tripweave.com',
      currency: 'USD',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      budgetAlerts: true,
      savedDestinations: [],
    };
    localStorage.setItem('tripweave_token', 'offline-demo-token');
    setToken('offline-demo-token');
    setUser(fallbackUser);
    toast.success('Welcome to Tripweave Demo Workspace! ✈️');
    return true;
  };

  const logout = () => {
    localStorage.removeItem('tripweave_token');
    setToken(null);
    setUser(null);
    toast.success('Signed out.');
  };

  const updateUser = (updated: Partial<AuthUser>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        demoLogin,
        logout,
        refreshProfile,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
