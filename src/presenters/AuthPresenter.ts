/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthModel } from '@/models/AuthModel';
import { UserModel } from '@/models/UserModel';
import { User, Login, Register, ApiResponse, ApiError } from '@/types/index';

export interface AuthView {
  showLoading: (loading: boolean) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  navigateToSignin?: () => void;
  navigateToDashboard?: () => void;
  navigateToUserProfile?: (formattedName: string) => void;
  setFieldErrors: (errors: string[]) => void;
  setUser: (user: User | null) => void;
}

export class AuthPresenter {
  private model: AuthModel;
  private userModel: UserModel;
  private view: AuthView;

  constructor(view: AuthView) {
    this.model = new AuthModel();
    this.userModel = new UserModel();
    this.view = view;
  }
  async login(credentials: Login): Promise<boolean> {
    try {
      this.view.showLoading(true);
      this.view.setFieldErrors([]);

      const response = await this.model.login(credentials);

      try {
        const user = await this.userModel.getCurrentUser();
        this.view.setUser(user);

        if (user && user.name) {
          const formattedName = user.name.toLowerCase().replace(/\s+/g, '');

          this.view.showSuccess(response.message || 'Login successful');

          if (this.view.navigateToUserProfile) {
            this.view.navigateToUserProfile(formattedName);
          } else if (this.view.navigateToDashboard) {
            this.view.navigateToDashboard();
          }
        } else {
          this.view.showSuccess(response.message || 'Login successful');
          if (this.view.navigateToDashboard) {
            this.view.navigateToDashboard();
          }
        }
      } catch (userError) {
        console.error('Failed to get user data after login:', userError);
        this.view.showSuccess(response.message || 'Login successful');
        if (this.view.navigateToDashboard) {
          this.view.navigateToDashboard();
        }
      }

      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.showError(apiError.message || 'Login failed');
      return false;
    } finally {
      this.view.showLoading(false);
    }
  }
  async handleSignup(formData: Register & { confirmPassword: string }): Promise<boolean> {
    try {
      this.view.showLoading(true);
      this.view.setFieldErrors([]);

      const errors = this.validateSignupForm(formData);
      if (errors.length > 0) {
        this.view.setFieldErrors(errors);
        return false;
      }

      const { confirmPassword, ...registerData } = formData;
      const response = await this.model.register(registerData);

      this.view.showSuccess(response.message || 'Registration successful! Please check your email for verification.');
      if (this.view.navigateToSignin) {
        setTimeout(() => this.view.navigateToSignin!(), 1500);
      }
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.showError(apiError.message || 'Registration failed');
      return false;
    } finally {
      this.view.showLoading(false);
    }
  }

  private validateSignupForm(formData: Register & { confirmPassword: string }): string[] {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('Nama harus diisi');
    }

    if (!formData.email.trim()) {
      errors.push('Email harus diisi');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Format email tidak valid');
    }

    if (!formData.password) {
      errors.push('Password harus diisi');
    } else if (formData.password.length < 6) {
      errors.push('Password minimal 6 karakter');
    }

    if (!formData.confirmPassword) {
      errors.push('Konfirmasi password harus diisi');
    } else if (formData.password !== formData.confirmPassword) {
      errors.push('Password dan konfirmasi password tidak sama');
    }

    return errors;
  }
  async logout(): Promise<void> {
    try {
      this.view.showLoading(true);
      const response = await this.model.logout();

      this.view.setUser(null);

      this.view.showSuccess(response.message || 'Logout successful');
    } catch (error) {
      const apiError = error as ApiError;
      this.view.setUser(null);

      this.view.showSuccess('Logged out successfully');
    } finally {
      this.view.showLoading(false);
    }
  }
  async getCurrentUser(): Promise<User | null> {
    try {
      this.view.showLoading(true);
      const user = await this.userModel.getCurrentUser();
      this.view.setUser(user);
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status !== 401) {
        this.view.showError(apiError.message || 'Failed to get user');
      }
      this.view.setUser(null);
      return null;
    } finally {
      this.view.showLoading(false);
    }
  }
}
