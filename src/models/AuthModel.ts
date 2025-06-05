/* eslint-disable @typescript-eslint/no-unused-vars */
import { User, Login, Register, AuthResponse, ApiResponse } from '@/types/index';
import { apiClient } from '@/lib/apiClient';

export class AuthModel {
  async login(credentials: Login): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post<ApiResponse<User>>('/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async register(data: Register): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post<ApiResponse<User>>('/register', data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/logout');
      return response;
    } catch (error) {
      throw error;
    }
  }
}
