import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authAPI } from "@/services/api";
import { showErrorToast, showSuccessToast } from "@/utils/errorHandler";
import type { User, LoginResponse, BackendLoginResponse } from "@/types";
import {
  safeGetItem,
  safeSetItem,
  safeRemoveItem,
} from "@/utils/storageCleanup";

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
    throw new Error("useAuth must be used within an AuthProvider");
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
    const tokenTimestamp = safeGetItem("tokenTimestamp");
    if (!tokenTimestamp) return true;

    const now = Date.now();
    const storedTime = parseInt(tokenTimestamp);
    return isNaN(storedTime) || now - storedTime > TOKEN_EXPIRY_TIME;
  };

  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    // Remove all possible auth-related localStorage keys using safe utility
    const keysToRemove = ["token", "user", "tokenTimestamp"];
    keysToRemove.forEach((key) => safeRemoveItem(key));
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = safeGetItem("token");
        const storedUser = safeGetItem("user");

        // Validate stored values exist (safeGetItem already handles invalid values)
        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);

            // Check if token is expired
            if (isTokenExpired()) {
              console.log("Token expired, clearing auth data");
              clearAuthData();
            } else if (parsedUser && parsedUser.userId) {
              // Validate parsed user has required fields
              setToken(storedToken);
              setUser(parsedUser);
              console.log("Auth initialized from localStorage");
            } else {
              console.warn("Invalid user data in localStorage");
              clearAuthData();
            }
          } catch (parseError) {
            console.error("Error parsing stored user data:", parseError);
            clearAuthData();
          }
        } else {
          // Clear any invalid data silently
          if (storedToken || storedUser) {
            console.log("Clearing invalid localStorage data");
            clearAuthData();
          }
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login...");
      const response = await authAPI.login({ email, password });
      const backendResponse: BackendLoginResponse = response.data;

      console.log("Backend response:", backendResponse);

      // Transform backend response to expected format
      // Backend returns: { token, userId, email, name, role }
      // Frontend expects: { token, user: { userId, email, name, role } }
      const loginResponse: LoginResponse = {
        token: backendResponse.token,
        user: {
          userId: backendResponse.userId,
          email: backendResponse.email,
          name: backendResponse.name,
          role: backendResponse.role as "ADMIN" | "PHARMACIST" | "CASHIER",
        },
      };

      if (
        !loginResponse.token ||
        !loginResponse.user ||
        !loginResponse.user.userId
      ) {
        console.error("Invalid login response structure:", loginResponse);
        throw new Error("Invalid login response from server");
      }

      // Set state first
      setToken(loginResponse.token);
      setUser(loginResponse.user);

      // Then update localStorage using safe utilities
      safeSetItem("token", loginResponse.token);
      safeSetItem("user", JSON.stringify(loginResponse.user));
      safeSetItem("tokenTimestamp", Date.now().toString());

      console.log("Login successful, user:", loginResponse.user.email);
      showSuccessToast("Login successful!");
    } catch (error: any) {
      console.error("Login error:", error);
      clearAuthData();
      showErrorToast(error);
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
    showSuccessToast("Logged out successfully");
  };

  const refreshToken = async () => {
    // This would implement token refresh logic if backend supports it
    // For now, we'll just clear the session and redirect to login
    clearAuthData();
    showErrorToast({
      response: { data: { message: "Session expired. Please login again." } },
    });
    window.location.href = "/login";
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
