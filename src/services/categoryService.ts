import api from './api';
import type { Category, CategoryFormData } from '../types/categories.types';

// Define the base endpoint for categories
const CATEGORIES_ENDPOINT = '/categories';

// Define the category service with CRUD operations
export const categoryService = {
  /**
   * Get all categories
   * @returns Promise with array of categories
   */
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get<Category[]>(CATEGORIES_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get a category by ID
   * @param id Category ID
   * @returns Promise with category data
   */
  getById: async (id: number): Promise<Category> => {
    try {
      const response = await api.get<Category>(`${CATEGORIES_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new category
   * @param data Category form data
   * @returns Promise with created category
   */
  create: async (data: CategoryFormData): Promise<Category> => {
    try {
      const response = await api.post<Category>(CATEGORIES_ENDPOINT, data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Update an existing category
   * @param id Category ID
   * @param data Category form data
   * @returns Promise with updated category
   */
  update: async (id: number, data: CategoryFormData): Promise<Category> => {
    try {
      const response = await api.put<Category>(`${CATEGORIES_ENDPOINT}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a category
   * @param id Category ID
   * @returns Promise with no content
   */
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete<void>(`${CATEGORIES_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
};

export default categoryService;