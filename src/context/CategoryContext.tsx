import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category, CategoryFormData } from '../types/categories.types';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchCategoryById: (id: number) => Promise<Category | null>;
  createCategory: (data: CategoryFormData) => Promise<Category | null>;
  updateCategory: (id: number, data: CategoryFormData) => Promise<Category | null>;
  deleteCategory: (id: number) => Promise<boolean>;
  clearError: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Fetch all categories - memoized to prevent recreating on every render
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize categories only once
  useEffect(() => {
    if (!initialized) {
      fetchCategories();
      setInitialized(true);
    }
  }, [initialized, fetchCategories]);

  // Rest of the functions remain the same...
  const fetchCategoryById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getById(id);
      const updatedCategories = [...categories];
      const index = updatedCategories.findIndex(c => c.id === id);
      if (index !== -1) {
        updatedCategories[index] = data;
        setCategories(updatedCategories);
      } else {
        setCategories([...categories, data]);
      }
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch category';
      setError(errorMessage);
      console.error('Error fetching category:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data: CategoryFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newCategory = await categoryService.create(data);
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create category';
      setError(errorMessage);
      console.error('Error creating category:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, data: CategoryFormData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategory = await categoryService.update(id, data);
      const updatedCategories = categories.map(category => 
        category.id === id ? updatedCategory : category
      );
      setCategories(updatedCategories);
      return updatedCategory;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update category';
      setError(errorMessage);
      console.error('Error updating category:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await categoryService.delete(id);
      setCategories(categories.filter(category => category.id !== id));
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete category';
      setError(errorMessage);
      console.error('Error deleting category:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: CategoryContextType = {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};