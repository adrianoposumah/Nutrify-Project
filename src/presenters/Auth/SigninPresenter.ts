import { SigninModel, SigninRequest, SigninResponse } from '@/Models/index';

export interface SigninViewInterface {
  showLoading(isLoading: boolean): void;
  showSuccess(message: string): void;
  showError(message: string): void;
  navigateToHome(): void;
  setFieldErrors(errors: string[]): void;
}

export class SigninPresenter {
  private model: SigninModel;
  private view: SigninViewInterface;

  constructor(view: SigninViewInterface) {
    this.model = new SigninModel();
    this.view = view;
  }

  async handleSignin(credentials: SigninRequest): Promise<void> {
    try {
      this.view.showLoading(true);

      const validation = this.model.validateSigninData(credentials);
      if (!validation.isValid) {
        this.view.setFieldErrors(validation.errors);
        this.view.showError(validation.errors[0]);
        return;
      }

      const response: SigninResponse = await this.model.login(credentials);

      if (response.status === 'success') {
        this.view.showSuccess(response.message || 'Login berhasil!');
        setTimeout(() => {
          this.view.navigateToHome();
        }, 1500);
      } else {
        this.view.showError(response.message || 'Login gagal');
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

  validateField(fieldName: string, value: string): string | null {
    switch (fieldName) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Email harus diisi';
        if (!emailRegex.test(value)) return 'Format email tidak valid';
        break;

      case 'password':
        if (!value) return 'Password harus diisi';
        if (value.length < 6) return 'Password minimal 6 karakter';
        break;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.model.isAuthenticated();
  }

  logout(): void {
    this.model.logout();
  }
}
