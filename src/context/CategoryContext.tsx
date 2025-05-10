import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category, CategoryFormData } from '../types/categories.types';

// Define the context shape
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

// Create the context
const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// Define the props for the provider
interface CategoryProviderProps {
  children: ReactNode;
}

// Create the provider component
export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single category by ID
  const fetchCategoryById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getById(id);
      // Update the category in the list if it exists
      const updatedCategories = [...categories];
      const index = updatedCategories.findIndex(c => c.id === id);
      if (index !== -1) {
        updatedCategories[index] = data;
        setCategories(updatedCategories);
      }
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new category
  const createCategory = async (data: CategoryFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newCategory = await categoryService.create(data);
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing category
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
      setError(err.message || 'Failed to update category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a category
  const deleteCategory = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await categoryService.delete(id);
      setCategories(categories.filter(category => category.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear any error
  const clearError = () => {
    setError(null);
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Create the context value
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

// Create a custom hook to use the category context
export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

// Custom hook to fetch and use a single category
export const useCategory = (id: number) => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  useEffect(() => {
    const loadCategory = async () => {
      setIsLoading(true);
      setIsError(false);
      
      // First check if we already have it in context
      const existingCategory = context.categories.find(c => c.id === id);
      
      if (existingCategory) {
        setCategory(existingCategory);
        setIsLoading(false);
      } else {
        try {
          const result = await context.fetchCategoryById(id);
          if (result) {
            setCategory(result);
          } else {
            setIsError(true);
          }
        } catch (err) {
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadCategory();
  }, [context, id]);
  
  return {
    data: category,
    isLoading,
    isError
  };
};