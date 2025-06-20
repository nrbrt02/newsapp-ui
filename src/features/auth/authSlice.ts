import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  AuthState, 
  LoginRequest, 
  RegisterRequest, 
  User, 
  LoginResponse,
  VerifyLoginRequest,
  VerifyResetPasswordRequest,
  ResendCodeRequest
} from '../../types/auth.types';
import { 
  loginUser as loginService, 
  registerUser as registerService,
  getCurrentUser as getCurrentUserService,
  updateUserProfile as updateProfileService,
  logoutUser as logoutService,
  getStoredUser,
  isAuthenticated as checkAuthenticated,
  verifyLogin as verifyLoginService,
  verifyResetPassword as verifyResetPasswordService,
  resendCode as resendCodeService
} from '../../services/authService';

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: checkAuthenticated(),
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginService(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await registerService(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserService();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, userData }: { userId: number, userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await updateProfileService(userId, userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const verifyLogin = createAsyncThunk(
  'auth/verifyLogin',
  async (request: VerifyLoginRequest, { rejectWithValue }) => {
    try {
      const response = await verifyLoginService(request);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Verification failed');
    }
  }
);

export const verifyResetPassword = createAsyncThunk(
  'auth/verifyResetPassword',
  async (request: VerifyResetPasswordRequest, { rejectWithValue }) => {
    try {
      await verifyResetPasswordService(request);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset verification failed');
    }
  }
);

export const resendCode = createAsyncThunk(
  'auth/resendCode',
  async (request: ResendCodeRequest, { rejectWithValue }) => {
    try {
      await resendCodeService(request);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resend code');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      logoutService();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setInitialAuthState: (state) => {
      const storedUser = getStoredUser();
      if (storedUser) {
        state.user = storedUser as unknown as User;
        state.token = storedUser.token;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    // Login handling
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload as unknown as User;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

    // Register handling
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Get user profile handling
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload } as User;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Update profile handling
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload } as User;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Verify login handling
      .addCase(verifyLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyLogin.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload as unknown as User;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(verifyLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

    // Verify reset password handling
      .addCase(verifyResetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyResetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(verifyResetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Resend code handling
      .addCase(resendCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendCode.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { logout, clearError, setInitialAuthState } = authSlice.actions;

// Export reducer
export default authSlice.reducer;