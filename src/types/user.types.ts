import type { UserRole } from './auth.types';

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

export interface UserCreateRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePic?: string | null;
  role: UserRole;
  isActive: boolean;
  password: string;
  confirmPassword?: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profilePic?: string | null;
  role?: UserRole;
  isActive?: boolean;
  password?: string;
  confirmPassword?: string;
}

export interface UsersState {
  users: User[];
  user: User | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedUsersResponse {
  content: User[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}