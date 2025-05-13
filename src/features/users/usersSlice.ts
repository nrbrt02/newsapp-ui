import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  User, 
  UserUpdateRequest, 
  UsersState,
  PaginatedUsersResponse
} from '../../types/user.types';
import * as userService from '../../services/userService';

// Initial state
const initialState: UsersState = {
  users: [],
  user: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 0
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 0, size = 10 }: { page?: number, size?: number }, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers(page, size);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const updateUserById = createAsyncThunk(
  'users/updateUserById',
  async ({ id, userData }: { id: number, userData: UserUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(id, userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUserById = createAsyncThunk(
  'users/deleteUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const changeUserRoleById = createAsyncThunk(
  'users/changeUserRoleById',
  async ({ id, role }: { id: number, role: string }, { rejectWithValue }) => {
    try {
      const response = await userService.changeUserRole(id, role);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change user role');
    }
  }
);

// Users slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchUsers
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
  state.isLoading = false;
  state.users = action.payload;
  state.totalPages = 1;
  state.currentPage = 0;
  state.error = null;
})
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchUserById
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // updateUserById
    builder
      .addCase(updateUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        
        // Update user in the list if it exists
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // deleteUserById
    builder
      .addCase(deleteUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserById.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // changeUserRoleById
    builder
      .addCase(changeUserRoleById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeUserRoleById.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        
        // Update user in the list if it exists
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(changeUserRoleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser, clearError } = usersSlice.actions;
export default usersSlice.reducer;