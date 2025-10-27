import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '@/services/api';
import { showErrorToast, showSuccessToast } from '@/utils/errorHandler';

interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshToken: () => Promise<void>;
  isTokenExpired: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Token expiration check (24 hours default)
const TOKEN_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenExpired = () => {
    const tokenTimestamp = localStorage.getItem('tokenTimestamp');
    if (!tokenTimestamp) return true;
    
    const now = Date.now();
    const storedTime = parseInt(tokenTimestamp);
    return (now - storedTime) > TOKEN_EXPIRY_TIME;
  };

  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenTimestamp');
  };

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        // Check if token is expired
        if (isTokenExpired()) {
          clearAuthData();
          showErrorToast({ response: { data: { message: 'Session expired. Please login again.' } } });
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: newToken, email: userEmail, name, role } = response.data;
      
      const userData = { email: userEmail, name, role };
      
      setToken(newToken);
      setUser(userData);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('tokenTimestamp', Date.now().toString());
      
      showSuccessToast('Login successful!');
    } catch (error: any) {
      showErrorToast(error);
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
    showSuccessToast('Logged out successfully');
  };

  const refreshToken = async () => {
    // This would implement token refresh logic if backend supports it
    // For now, we'll just clear the session and redirect to login
    clearAuthData();
    showErrorToast({ response: { data: { message: 'Session expired. Please login again.' } } });
    window.location.href = '/login';
  };

  // Auto-check token expiration every 5 minutes
  useEffect(() => {
    if (!token) return;

    const checkInterval = setInterval(() => {
      if (isTokenExpired()) {
        refreshToken();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(checkInterval);
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    refreshToken,
    isTokenExpired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
