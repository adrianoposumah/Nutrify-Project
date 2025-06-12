export interface ApiResponse<T> {
  data: T;
  status: string;
  message: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface PaginatedApiResponse<T> {
  data: T;
  status: string;
  message: string;
  pagination: PaginationInfo;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
