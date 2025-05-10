import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { 
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../features/categories/categoriesSlice';
import type { Category, CategoryFormData } from '../types/categories.types';

export const useCategories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return {
    data: categories,
    isLoading: loading === 'pending',
    isError: error !== null
  };
};

export const useCategory = (id: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector((state: RootState) => state.categories);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    // First check if we already have it in the Redux store
    const existingCategory = categories.find(c => c.id === id);
    if (existingCategory) {
      setCategory(existingCategory);
    } else {
      dispatch(fetchCategoryById(id));
    }
  }, [dispatch, id, categories]);

  return {
    data: category,
    isLoading: loading === 'pending',
    isError: error !== null
  };
};

export const useCreateCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.categories);

  const mutate = async (data: CategoryFormData, options?: { onSuccess?: () => void }) => {
    try {
      await dispatch(createCategory(data)).unwrap();
      if (options?.onSuccess) {
        options.onSuccess();
      }
      // Here you would show a success notification
      // Since react-hot-toast is not available, you could use a built-in alert
      // or implement a custom notification system
      alert('Category created successfully');
      return true;
    } catch (error: any) {
      // Show error notification
      alert(error.message || 'Failed to create category');
      return false;
    }
  };

  return {
    mutate,
    isPending: loading === 'pending'
  };
};

export const useUpdateCategory = (id: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.categories);

  const mutate = async (data: CategoryFormData, options?: { onSuccess?: () => void }) => {
    try {
      await dispatch(updateCategory({ id, data })).unwrap();
      if (options?.onSuccess) {
        options.onSuccess();
      }
      // Success notification
      alert('Category updated successfully');
      return true;
    } catch (error: any) {
      // Error notification
      alert(error.message || 'Failed to update category');
      return false;
    }
  };

  return {
    mutate,
    isPending: loading === 'pending'
  };
};

export const useDeleteCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.categories);

  const mutate = async (id: number, options?: { onSuccess?: () => void }) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      if (options?.onSuccess) {
        options.onSuccess();
      }
      // Success notification
      alert('Category deleted successfully');
      return true;
    } catch (error: any) {
      // Error notification
      alert(error.message || 'Failed to delete category');
      return false;
    }
  };

  return {
    mutate,
    isPending: loading === 'pending'
  };
};