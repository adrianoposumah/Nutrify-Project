export interface AdminUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface UserListResponse {
  users: AdminUser[];
  pagination: Pagination;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
}

export interface ChangeRoleRequest {
  newRole: string;
}

export interface AdminMessageResponse {
  status: string;
  message: string;
}
