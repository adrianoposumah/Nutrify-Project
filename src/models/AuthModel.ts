import { User, Login, Register, AuthResponse, ApiResponse } from '@/types/index';
import { apiClient } from '@/lib/apiClient';

export class AuthModel {
  async login(credentials: Login): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>('/login', credentials);

      if (response.accessToken) {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours

        const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
        const cookieString = `jwt=${response.accessToken}; expires=${expirationDate.toUTCString()}; path=/; ${isSecure ? 'secure;' : ''} samesite=lax`;

        if (typeof document !== 'undefined') {
          document.cookie = cookieString;
          console.log('Token stored in cookie:', response.accessToken.substring(0, 20) + '...');
          console.log('Cookie string:', cookieString);
        }
      }

      return {
        data: response,
        status: response.status,
        message: response.message,
      };
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
