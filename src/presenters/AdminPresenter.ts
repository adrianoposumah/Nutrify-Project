/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdminModel } from '@/models/AdminModel';
import { AdminUser, UserListResponse, GetUsersParams, ChangeRoleRequest, ApiError, Pagination } from '@/types/index';

export interface AdminView {
  users: AdminUser[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  setUsers: (users: AdminUser[]) => void;
  setPagination: (pagination: Pagination) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export class AdminPresenter {
  private model: AdminModel;
  private view: AdminView;

  constructor(view: AdminView) {
    this.model = new AdminModel();
    this.view = view;
  }
  private getErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object') {
      // Check for axios error structure
      const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
      const maybeData = maybeResponse?.data;
      if (maybeData && typeof maybeData.message === 'string') {
        return maybeData.message;
      }
      // Check for direct message property
      if ('message' in error && typeof (error as { message?: string }).message === 'string') {
        return (error as { message?: string }).message as string;
      }
    }
    if (typeof error === 'string') {
      return error;
    }
    return fallback;
  }
  async getUsers(params?: GetUsersParams): Promise<boolean> {
    try {
      this.view.setLoading(true);
      this.view.setError(null);

      const result = await this.model.getUsers(params);
      this.view.setUsers(result.users || []);
      this.view.setPagination(result.pagination);

      return true;
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      const errorMessage = this.getErrorMessage(error, 'Failed to fetch users');
      this.view.setError(errorMessage);
      this.view.setUsers([]); // Set empty array on error
      return false;
    } finally {
      this.view.setLoading(false);
    }
  }
  async changeUserRole(userIdToChange: string, newRole: string): Promise<{ success: boolean; errorMessage?: string }> {
    try {
      this.view.setLoading(true);
      this.view.setError(null);

      const roleData: ChangeRoleRequest = { newRole };
      await this.model.changeUserRole(userIdToChange, roleData);

      // Refresh the users list
      await this.getUsers();

      return { success: true };
    } catch (error: unknown) {
      console.error('Error updating user role:', error);
      const errorMessage = this.getErrorMessage(error, 'Failed to change user role');
      this.view.setError(errorMessage);
      return { success: false, errorMessage };
    } finally {
      this.view.setLoading(false);
    }
  }
  async deleteUser(userIdToDelete: string): Promise<boolean> {
    try {
      this.view.setLoading(true);
      this.view.setError(null);

      await this.model.deleteUser(userIdToDelete);

      // Refresh the users list
      await this.getUsers();

      return true;
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      const errorMessage = this.getErrorMessage(error, 'Failed to delete user');
      this.view.setError(errorMessage);
      return false;
    } finally {
      this.view.setLoading(false);
    }
  }
  clearMessages(): void {
    this.view.setError(null);
  }
}
