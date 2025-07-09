'use client';

import { useCallback, useState } from 'react';
import { verifyToken } from '@/lib/request';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

interface User {
  id: string;
  email: string;
  name: string;
  userType: 'COMMON' | 'VIP';
  isActive: boolean;
  createdAt?: string;
}

export function useAuthToken() {
  const [isValidating, setIsValidating] = useState(false);

  const setToken = useCallback((token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }, []);

  const getToken = useCallback((): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }, []);

  const removeToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const setUser = useCallback((user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }, []);

  const getUser = useCallback((): User | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_KEY);
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          return null;
        }
      }
    }
    return null;
  }, []);

  const setAuthData = useCallback((token: string, user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }, []);

  const validateToken = useCallback(async (): Promise<{
    isValid: boolean;
    user?: User;
    error?: string;
  }> => {
    const token = getToken();
    
    if (!token) {
      return { isValid: false, error: 'No token found' };
    }

    setIsValidating(true);
    
    try {
      const result = await verifyToken(token);
      // Update stored user data with fresh data from server
      setUser(result.user);
      return {
        isValid: true,
        user: result.user,
      };
    } catch (error) {
      // If token is invalid/expired, remove it from storage
      removeToken();
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Token validation failed',
      };
    } finally {
      setIsValidating(false);
    }
  }, [getToken, removeToken, setUser]);

  return {
    setToken,
    getToken,
    removeToken,
    setUser,
    getUser,
    setAuthData,
    validateToken,
    isValidating,
  };
} 