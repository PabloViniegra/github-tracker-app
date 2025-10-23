"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, tokenStorage, UserProfile } from '@/lib/api';

/**
 * Auth Context Types
 */
interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

/**
 * Create Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 *
 * Wraps the app and provides authentication state to all components.
 *
 * Features:
 * - Automatically loads user profile on mount if tokens exist
 * - Provides login/logout functions
 * - Exposes authentication state (user, isAuthenticated, isLoading)
 *
 * Usage:
 * ```tsx
 * <AuthProvider>
 *   <YourApp />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load user profile from API
   * Wrapped in useCallback to prevent unnecessary re-renders
   */
  const loadUser = useCallback(async () => {
    if (!tokenStorage.hasTokens()) {
      setIsLoading(false);
      return;
    }

    try {
      const userProfile = await authApi.getCurrentUser();
      setUser(userProfile);
    } catch (error) {
      // Check if it's an authentication error (expired/invalid tokens)
      const isAuthError = error instanceof Error &&
        (error.message.includes('401') ||
         error.message.includes('credentials') ||
         error.message.includes('Session expired'));

      if (isAuthError) {
        // Silent cleanup for auth errors (expected when tokens expire)
        console.log('[AuthContext] Session expired, clearing tokens');
      } else {
        // Log other unexpected errors
        console.error('[AuthContext] Failed to load user:', error);
      }

      // Clear tokens and reset state
      tokenStorage.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps - tokenStorage and authApi are stable

  /**
   * Load user on mount
   */
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Login function - redirects to login page
   */
  const login = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  /**
   * Logout function - calls API and clears local state
   */
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('[AuthContext] Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local state
      setUser(null);
      tokenStorage.clearTokens();

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  /**
   * Refresh user profile
   */
  const refreshUser = async () => {
    setIsLoading(true);
    await loadUser();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use Auth Context
 *
 * Usage in any component:
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useAuth();
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
