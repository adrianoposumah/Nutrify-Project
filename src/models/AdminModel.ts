import { UserListResponse, GetUsersParams, ChangeRoleRequest, AdminMessageResponse, ApiResponse } from '@/types/index';
import { apiClient } from '@/lib/apiClient';

export class AdminModel {
  async getUsers(params?: GetUsersParams): Promise<UserListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<ApiResponse<UserListResponse>>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async changeUserRole(userIdToChange: string, roleData: ChangeRoleRequest): Promise<AdminMessageResponse> {
    try {
      const response = await apiClient.patch<ApiResponse<AdminMessageResponse>>(`/admin/users/${userIdToChange}/role`, roleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userIdToDelete: string): Promise<AdminMessageResponse> {
    try {
      const response = await apiClient.delete<ApiResponse<AdminMessageResponse>>(`/admin/users/${userIdToDelete}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
