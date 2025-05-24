export type UserRole = 'ADMIN' | 'WRITER' | 'READER';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profilePic: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface VerifyLoginRequest {
  email: string;
  code: string;
}

export interface VerifyResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResendCodeRequest {
  username: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  requiresTwoFactor: boolean;
  message?: string;
  token?: string;
  type?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}