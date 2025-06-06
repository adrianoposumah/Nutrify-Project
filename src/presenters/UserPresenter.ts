import { UserModel } from '@/models/UserModel';
import { User, ApiError } from '@/types/index';

export interface UserView {
  showLoading: (loading: boolean) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  setUser: (user: User | null) => void;
  setProfilePicture: (url: string) => void;
  navigateToProfile?: () => void;
  refreshUserData?: () => void;
}

export class UserPresenter {
  private model: UserModel;
  private view: UserView;

  constructor(view: UserView) {
    this.model = new UserModel();
    this.view = view;
  }
  async getCurrentUser(): Promise<User | null> {
    try {
      this.view.showLoading(true);
      const user = await this.model.getCurrentUser();
      this.view.setUser(user);
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status !== 401) {
        this.view.showError(apiError.message || 'Failed to fetch user data');
      }
      this.view.setUser(null);
      return null;
    } finally {
      this.view.showLoading(false);
    }
  }
  async getCurrentUserProfilePicture(user?: User | null): Promise<string | null> {
    try {
      // If no user is provided, get the current user first
      let currentUser = user;
      if (!currentUser) {
        currentUser = await this.getCurrentUser();
      }

      // Check if user has profile picture before making API call
      if (!currentUser || !currentUser.hasProfilePicture) {
        this.view.setProfilePicture('');
        return null;
      }

      this.view.showLoading(true);

      // Use the model method to get the profile picture URL
      const profilePictureUrl = await this.model.getCurrentUserProfilePicture();
      this.view.setProfilePicture(profilePictureUrl);
      return profilePictureUrl;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.showError(apiError.message || 'Failed to fetch profile picture');
      this.view.setProfilePicture('');
      return null;
    } finally {
      this.view.showLoading(false);
    }
  }
  async updateUserProfile(data: Partial<User> | FormData): Promise<boolean> {
    try {
      this.view.showLoading(true);
      let formData: FormData;

      if (data instanceof FormData) {
        // If data is already FormData (e.g., with file upload), validate it
        const errors = this.validateFormData(data);
        if (errors.length > 0) {
          this.view.showError(errors.join(', '));
          return false;
        }
        formData = data;
      } else {
        // If data is Partial<User>, validate and convert to FormData
        const errors = this.validateProfileUpdate(data);
        if (errors.length > 0) {
          this.view.showError(errors.join(', '));
          return false;
        }

        formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value.toString());
          }
        });
      }

      const updatedUser = await this.model.updateUserProfile(formData);
      this.view.setUser(updatedUser);
      this.view.showSuccess('Profile berhasil diperbarui!');

      // Refresh user data to get the latest information
      if (this.view.refreshUserData) {
        await this.view.refreshUserData();
      }

      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.showError(apiError.message || 'Failed to update profile');
      return false;
    } finally {
      this.view.showLoading(false);
    }
  }
  private validateProfileUpdate(data: Partial<User>): string[] {
    const errors: string[] = [];

    // Note: name and email are read-only fields and not validated here

    if (data.age !== undefined) {
      if (data.age < 1 || data.age > 150) {
        errors.push('Umur harus antara 1-150 tahun');
      }
    }

    if (data.height !== undefined) {
      if (data.height < 50 || data.height > 300) {
        errors.push('Tinggi harus antara 50-300 cm');
      }
    }

    if (data.weight !== undefined) {
      if (data.weight < 10 || data.weight > 1000) {
        errors.push('Berat harus antara 10-1000 kg');
      }
    }

    return errors;
  }
  private validateFormData(formData: FormData): string[] {
    const errors: string[] = [];

    const age = formData.get('age') as string;
    const height = formData.get('height') as string;
    const weight = formData.get('weight') as string;
    const profilePicture = formData.get('profilePicture') as File;

    // Note: name and email are read-only fields and not validated here

    // Validate age
    if (age !== null && age !== undefined) {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
        errors.push('Umur harus antara 1-150 tahun');
      }
    }

    // Validate height
    if (height !== null && height !== undefined) {
      const heightNum = parseInt(height);
      if (isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
        errors.push('Tinggi harus antara 50-300 cm');
      }
    }

    // Validate weight
    if (weight !== null && weight !== undefined) {
      const weightNum = parseInt(weight);
      if (isNaN(weightNum) || weightNum < 10 || weightNum > 1000) {
        errors.push('Berat harus antara 10-1000 kg');
      }
    }

    // Validate profile picture if present
    if (profilePicture && profilePicture instanceof File) {
      if (profilePicture.size > 5 * 1024 * 1024) {
        errors.push('Ukuran file maksimal 5MB');
      }
      if (!profilePicture.type.startsWith('image/')) {
        errors.push('File harus berupa gambar');
      }
    }

    return errors;
  }
}
