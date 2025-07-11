import { UserListResponse, GetUsersParams, ChangeRoleRequest, AdminMessageResponse } from '@/types/index';
import { apiClient } from '@/lib/apiClient';

export class AdminModel {
  async getUsers(params?: GetUsersParams): Promise<UserListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<UserListResponse>(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserListResponse> {
    try {
      const response = await apiClient.get<UserListResponse>(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async changeUserRole(userIdToChange: string, roleData: ChangeRoleRequest): Promise<AdminMessageResponse> {
    try {
      const response = await apiClient.patch<AdminMessageResponse>(`/users/${userIdToChange}/role`, roleData);
      console.log('Change role response:', response); // Debug log
      return response;
    } catch (error) {
      console.error('Change role error:', error); // Debug log
      throw error;
    }
  }
  async deleteUser(userIdToDelete: string): Promise<AdminMessageResponse> {
    try {
      const response = await apiClient.delete<AdminMessageResponse>(`/users/${userIdToDelete}`);
      console.log('Delete user response:', response); // Debug log
      return response;
    } catch (error) {
      console.error('Delete user error:', error); // Debug log
      throw error;
    }
  }
}
