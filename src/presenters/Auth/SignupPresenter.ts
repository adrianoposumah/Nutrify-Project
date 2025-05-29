/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignupModel, type SignupRequest, type SignupResponse } from '@/Models/Auth/SignupModel';

export interface SignupViewInterface {
  showLoading(isLoading: boolean): void;
  showSuccess(message: string): void;
  showError(message: string): void;
  navigateToSignin(): void;
  setFieldErrors(errors: string[]): void;
}

export class SignupPresenter {
  private model: SignupModel;
  private view: SignupViewInterface;

  constructor(view: SignupViewInterface) {
    this.model = new SignupModel();
    this.view = view;
  }

  async handleSignup(userData: SignupRequest & { confirmPassword: string }): Promise<void> {
    try {
      this.view.showLoading(true);

      const validation = this.model.validateSignupData(userData);
      if (!validation.isValid) {
        this.view.setFieldErrors(validation.errors);
        this.view.showError(validation.errors[0]);
        return;
      }
      const { confirmPassword: _, ...signupData } = userData;

      const response: SignupResponse = await this.model.register(signupData);

      if (response.status === 'success') {
        this.view.showSuccess(response.message || 'Registrasi berhasil! Silakan login.');
        setTimeout(() => {
          this.view.navigateToSignin();
        }, 1500);
      } else {
        this.view.showError(response.message || 'Registrasi gagal');
      }
    } catch (error) {
      if (error instanceof Error) {
        this.view.showError(error.message);
      } else {
        this.view.showError('Terjadi kesalahan yang tidak terduga');
      }
    } finally {
      this.view.showLoading(false);
    }
  }

  validateField(fieldName: string, value: string, confirmPassword?: string): string | null {
    switch (fieldName) {
      case 'name':
        if (!value.trim()) return 'Nama harus diisi';
        if (value.trim().length < 2) return 'Nama minimal 2 karakter';
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Email harus diisi';
        if (!emailRegex.test(value)) return 'Format email tidak valid';
        break;

      case 'password':
        if (!value) return 'Password harus diisi';
        if (value.length < 6) return 'Password minimal 6 karakter';
        break;

      case 'confirmPassword':
        if (!value) return 'Konfirmasi password harus diisi';
        if (confirmPassword && value !== confirmPassword) return 'Password dan konfirmasi password tidak cocok';
        break;
    }
    return null;
  }
}
