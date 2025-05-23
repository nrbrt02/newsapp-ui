import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { 
  fetchUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
  changeUserRoleById,
  clearUser,
  clearError
} from '../features/users/usersSlice';
import type { UserUpdateRequest, UserCreateRequest } from '../types/user.types';
import { 
  getAllUsers, 
  getUserById, 
  getUserProfile, 
  updateUser, 
  deleteUser, 
  changeUserRole,
  createUser
} from '../services/userService';

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    users, 
    user, 
    isLoading, 
    error, 
    totalPages, 
    currentPage 
  } = useSelector((state: RootState) => state.users);
  
  const getUsers = async (page = 0, size = 10, search = '') => {
    try {
      await dispatch(fetchUsers({ page, size, search })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const getUserById = async (id: number) => {
    try {
      await dispatch(fetchUserById(id)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const createUserHandler = async (userData: UserCreateRequest) => {
    try {
      const newUser = await createUser(userData);
      await getUsers(currentPage);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (id: number, userData: UserUpdateRequest) => {
    try {
      const result = await dispatch(updateUserById({ id, userData })).unwrap();
      return result;
    } catch (error) {
      return null;
    }
  };
  
  const deleteUser = async (id: number) => {
    try {
      await dispatch(deleteUserById(id)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const changeUserRole = async (id: number, role: string) => {
    try {
      const result = await dispatch(changeUserRoleById({ id, role })).unwrap();
      return result;
    } catch (error) {
      return null;
    }
  };

  const resetUser = () => {
    dispatch(clearUser());
  };

  const resetError = () => {
    dispatch(clearError());
  };

  return {
    users,
    user,
    isLoading,
    error,
    totalPages,
    currentPage,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    changeUserRole,
    createUser: createUserHandler,
    resetUser,
    resetError
  };
};