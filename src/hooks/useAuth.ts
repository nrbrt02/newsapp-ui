import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { 
  login,
  register,
  logout,
  getUserProfile,
  updateProfile,
  setInitialAuthState,
  clearError
} from '../features/auth/authSlice';
import type { 
  LoginRequest, 
  RegisterRequest,
  User
} from '../types/auth.types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Set initial auth state from localStorage
    dispatch(setInitialAuthState());
  }, [dispatch]);

  const loginUser = async (credentials: LoginRequest) => {
    try {
      await dispatch(login(credentials)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (userData: RegisterRequest) => {
    try {
      await dispatch(register(userData)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const fetchUserProfile = async () => {
    if (isAuthenticated) {
      try {
        await dispatch(getUserProfile()).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  const updateUserProfile = async (userId: number, userData: Partial<User>) => {
    try {
      await dispatch(updateProfile({ userId, userData })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const resetError = () => {
    dispatch(clearError());
  };

    const memoizedFetchProfile = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await dispatch(getUserProfile()).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  }, [dispatch, isAuthenticated]);

  const memoizedUpdateProfile = useCallback(async (userId: number, userData: Partial<User>) => {
    try {
      await dispatch(updateProfile({ userId, userData })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    clearError: resetError,
    fetchUserProfile: memoizedFetchProfile,
    updateUserProfile: memoizedUpdateProfile,
  };
};