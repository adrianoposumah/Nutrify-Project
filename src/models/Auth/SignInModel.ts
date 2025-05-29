import Cookies from 'js-cookie';
import { AuthUtils } from '@/utils/auth';

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninResponse {
  status: string;
  message: string;
  accessToken?: string;
  data?: {
    id: string;
    name: string;
    email: string;
  };
}

export class SigninModel {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  async login(credentials: SigninRequest): Promise<SigninResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.accessToken) {
        this.setTokenCookie(data.accessToken);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during login');
    }
  }

  validateSigninData(credentials: SigninRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!credentials.email.trim()) {
      errors.push('Email harus diisi');
    } else if (!emailRegex.test(credentials.email)) {
      errors.push('Format email tidak valid');
    }

    if (!credentials.password) {
      errors.push('Password harus diisi');
    } else if (credentials.password.length < 6) {
      errors.push('Password minimal 6 karakter');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return this.getTokenFromCookie();
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return AuthUtils.isValidJWTFormat(token) && !AuthUtils.isTokenExpired(token);
  }

  logout(): void {
    this.removeTokenCookie();
  }

  private setTokenCookie(token: string): void {
    if (typeof window !== 'undefined') {
      const isProduction = process.env.NODE_ENV === 'production';
      Cookies.set('authToken', token, {
        expires: 1,
        path: '/',
        sameSite: 'strict',
        secure: isProduction,
      });
    }
  }

  private getTokenFromCookie(): string | null {
    if (typeof window !== 'undefined') {
      return Cookies.get('authToken') || null;
    }
    return null;
  }

  private removeTokenCookie(): void {
    if (typeof window !== 'undefined') {
      Cookies.remove('authToken', { path: '/' });
    }
  }
}
