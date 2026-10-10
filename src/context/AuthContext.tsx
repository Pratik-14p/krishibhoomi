import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData, AuthResponse, FarmerProfile } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<FarmerProfile>) => Promise<User>;
  verifyOtp: (email: string, otp: string, google?: boolean) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from storage on app load
  useEffect(() => {
    (async () => {
    try {
      // Purge any stale Ramesh Patel demo data or demo flags
      const rawUser = localStorage.getItem('krishibhoomi_active_user_v1');
      if (rawUser && (rawUser.includes('usr-ramesh-01') || rawUser.includes('ramesh.farmer@krishibhoomi.ai') || rawUser.includes('Ramesh Patel'))) {
        localStorage.removeItem('krishibhoomi_active_user_v1');
      }
      localStorage.removeItem('krishibhoomi_demo_mode');

      const stored = authService.getCurrentUser();
      if (stored) {
        setUser(stored);
        // Always refresh the authenticated profile from Aiven-backed API so stale
        // local/demo profile data can never become the dashboard identity.
        try {
          const fresh = await authService.fetchProfile();
          if (fresh) setUser(fresh);
          else {
            await authService.logout();
            setUser(null);
          }
        } catch {
          // Keep the local session only when the backend is temporarily unavailable.
        }
      }
    } catch (err) {
      console.error('Error hydrating auth state', err);
    } finally {
      setIsLoading(false);
    }
    })();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res.success && res.user) {
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      if (res.success && res.user) {
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<FarmerProfile>): Promise<User> => {
    const updated = await authService.updateProfile(profileData);
    setUser(updated);
    return updated;
  };

  const verifyOtp = async (email: string, otp: string, google = false): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(email, otp, google);
      if (res.success && res.user) {
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    return authService.forgotPassword(email);
  };

  const resetPassword = async (email: string, newPassword: string) => {
    return authService.resetPassword(email, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        verifyOtp,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
