export interface User {
  id: string;
  name: string;
  email: string;
  hasProfilePicture: boolean;
  profilePictureMimeType: string;
  profilePicture: string;
  age: number;
  height: number;
  weight: number;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string; // Optional for API, required for form validation
}

export interface AuthResponse {
  status: string;
  message: string;
  accessToken: string;
}
