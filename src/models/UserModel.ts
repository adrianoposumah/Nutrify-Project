import { User, ApiResponse } from '@/types/index';
import { apiClient } from '@/lib/apiClient';

export class UserModel {
  async getCurrentUser(): Promise<User> {
    try {
      console.log('UserModel: Making API call to /me');
      const response = await apiClient.get<{ status: string; user: User }>('/me');
      console.log('UserModel: API response:', response);
      console.log('UserModel: User data from API:', response.user);
      return response.user;
    } catch (error) {
      console.error('UserModel: Error in getCurrentUser:', error);
      throw error;
    }
  }
  async getCurrentUserProfilePicture(): Promise<string> {
    try {
      // For image data, we need to use responseType: 'blob' and create a URL
      const response = await apiClient.get<Blob>('/profile-picture', {
        responseType: 'blob',
      });

      // Create a URL for the blob data
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
