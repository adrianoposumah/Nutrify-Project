import { User, ApiResponse } from '@/types/index';
import { apiClient } from '@/lib/apiClient';

export class UserModel {
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<{ status: string; user: User }>('/profile');
      return response.user;
    } catch (error) {
      throw error;
    }
  }
  async getCurrentUserProfilePicture(): Promise<string> {
    try {
      const response = await apiClient.get<Blob>('/profile-picture', {
        responseType: 'blob',
      });

      return URL.createObjectURL(response);
    } catch (error) {
      console.error('UserModel: Error fetching profile picture:', error);
      throw error;
    }
  }

  async updateUserProfile(data: FormData): Promise<User> {
    try {
      const response = await apiClient.put<ApiResponse<User>>('/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
