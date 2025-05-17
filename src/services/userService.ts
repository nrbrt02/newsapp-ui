import api from './api';
import type { User, UserUpdateRequest } from '../types/user.types';

// Get all users (admin only)
export const getAllUsers = async (page = 0, size = 10): Promise<any> => {
  try {
    const response = await api.get(`/users?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const createUser = async (userData: {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePic?: string | null;
  role: string;
  isActive: boolean;
  password: string;
}): Promise<User> => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user profile
export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user
export const updateUser = async (id: number, userData: UserUpdateRequest): Promise<User> => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete user
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    throw error;
  }
};

// Change user role (admin only)
export const changeUserRole = async (id: number, role: string): Promise<User> => {
  try {
    const response = await api.patch(`/users/${id}/role?role=${role}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};