/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdminModel } from '@/models/AdminModel';
import { AdminUser, UserListResponse, GetUsersParams, ChangeRoleRequest, ApiError, Pagination } from '@/types/index';

export interface AdminView {
  users: AdminUser[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  setUsers: (users: AdminUser[]) => void;
  setPagination: (pagination: Pagination) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
}

export class AdminPresenter {
  private model: AdminModel;
  private view: AdminView;

  constructor(view: AdminView) {
    this.model = new AdminModel();
    this.view = view;
  }

  async getUsers(params?: GetUsersParams): Promise<boolean> {
    try {
      this.view.setLoading(true);
      this.view.setError(null);

      const result = await this.model.getUsers(params);
      this.view.setUsers(result.users);
      this.view.setPagination(result.pagination);

      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.setError(apiError.message || 'Failed to fetch users');
      return false;
    } finally {
      this.view.setLoading(false);
    }
  }
  async changeUserRole(userIdToChange: string, newRole: string): Promise<boolean> {
    try {
      this.view.setLoading(true);
      this.view.setError(null);
      this.view.setSuccessMessage(null);

      const roleData: ChangeRoleRequest = { newRole };
      const result = await this.model.changeUserRole(userIdToChange, roleData);

      console.log('Change role result:', result); // Debug log

      if (result && result.message) {
        this.view.setSuccessMessage(result.message);
      } else {
        this.view.setSuccessMessage('User role updated successfully');
      }

      // Refresh the users list
      await this.getUsers();

      return true;
    } catch (error) {
      console.error('Change role presenter error:', error); // Debug log
      const apiError = error as ApiError;
      this.view.setError(apiError.message || 'Failed to change user role');
      return false;
    } finally {
      this.view.setLoading(false);
    }
  }
  async deleteUser(userIdToDelete: string): Promise<boolean> {
    try {
      this.view.setLoading(true);
      this.view.setError(null);
      this.view.setSuccessMessage(null);

      const result = await this.model.deleteUser(userIdToDelete);

      console.log('Delete user result:', result); // Debug log

      if (result && result.message) {
        this.view.setSuccessMessage(result.message);
      } else {
        this.view.setSuccessMessage('User deleted successfully');
      }

      // Refresh the users list
      await this.getUsers();

      return true;
    } catch (error) {
      console.error('Delete user presenter error:', error); // Debug log
      const apiError = error as ApiError;
      this.view.setError(apiError.message || 'Failed to delete user');
      return false;
    } finally {
      this.view.setLoading(false);
    }
  }

  clearMessages(): void {
    this.view.setError(null);
    this.view.setSuccessMessage(null);
  }
}
