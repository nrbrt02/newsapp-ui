import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../services/categoryService';
import type { Category, CategoryFormData } from '../../types/categories.types';

// Define the state types
interface CategoriesState {
  categories: Category[];
  currentCategory: Category | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

// Define initial state
const initialState: CategoriesState = {
  categories: [],
  currentCategory: null,
  loading: 'idle',
  error: null
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await categoryService.getAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await categoryService.getById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (data: CategoryFormData, { rejectWithValue }) => {
    try {
      return await categoryService.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }: { id: number, data: CategoryFormData }, { rejectWithValue }) => {
    try {
      return await categoryService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await categoryService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create the slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategoryError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string || 'Failed to fetch categories';
      })
      
      // Fetch category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.currentCategory = action.payload;
        // Also update the category in the list if it exists
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        } else {
          state.categories.push(action.payload);
        }
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string || 'Failed to fetch category';
      })
      
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.categories.push(action.payload);
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string || 'Failed to create category';
      })
      
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string || 'Failed to update category';
      })
      
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.categories = state.categories.filter(c => c.id !== action.payload);
        if (state.currentCategory?.id === action.payload) {
          state.currentCategory = null;
        }
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string || 'Failed to delete category';
      });
  }
});

export const { resetCategoryError, clearCurrentCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;