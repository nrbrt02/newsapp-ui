import api from './api';
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User 
} from '../types/auth.types';

const API_URL = "http://localhost:8080/api/"
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Store token and user data in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Register user
export const registerUser = async (userData: RegisterRequest): Promise<User> => {
  try {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/users/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId: number, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put<User>(`/users/${userId}`, userData);
    
    // Update stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get user from localStorage
export const getStoredUser = (): LoginResponse | null => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};