export interface ApiResponse<T> {
  data: T;
  status: string;
  message: string;
}
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
