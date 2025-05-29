/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { SigninModel, type SigninRequest } from '@/models/Auth/SignInModel';
import { SignupModel, type SignupRequest } from '@/models/Auth/SignupModel';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: SigninRequest) => Promise<{ success: boolean; message: string }>;
  register: (userData: SignupRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const signinModel = new SigninModel();
  const signupModel = new SignupModel();

  useEffect(() => {
    setIsAuthenticated(signinModel.isAuthenticated());
    setIsLoading(false);
  }, []);
  const login = async (credentials: SigninRequest) => {
    setIsLoading(true);
    try {
      const response = await signinModel.login(credentials);
      const success = response.status === 'success';

      if (success) {
        setIsAuthenticated(true);
      }

      return {
        success,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: SignupRequest) => {
    setIsLoading(true);
    try {
      const response = await signupModel.register(userData);
      const success = response.status === 'success';

      return {
        success,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    signinModel.logout();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};
