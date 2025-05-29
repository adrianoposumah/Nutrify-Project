export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  status: string;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
  };
}

export class SignupModel {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  async register(userData: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during registration');
    }
  }

  validateSignupData(userData: SignupRequest & { confirmPassword: string }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!userData.name.trim()) {
      errors.push('Nama harus diisi');
    } else if (userData.name.trim().length < 2) {
      errors.push('Nama minimal 2 karakter');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim()) {
      errors.push('Email harus diisi');
    } else if (!emailRegex.test(userData.email)) {
      errors.push('Format email tidak valid');
    }

    if (!userData.password) {
      errors.push('Password harus diisi');
    } else if (userData.password.length < 6) {
      errors.push('Password minimal 6 karakter');
    }

    if (userData.password !== userData.confirmPassword) {
      errors.push('Password dan konfirmasi password tidak cocok');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
