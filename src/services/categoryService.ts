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
    return api.get<Category[]>(CATEGORIES_ENDPOINT);
  },

  /**
   * Get a category by ID
   * @param id Category ID
   * @returns Promise with category data
   */
  getById: async (id: number): Promise<Category> => {
    return api.get<Category>(`${CATEGORIES_ENDPOINT}/${id}`);
  },

  /**
   * Create a new category
   * @param data Category form data
   * @returns Promise with created category
   */
  create: async (data: CategoryFormData): Promise<Category> => {
    return api.post<Category>(CATEGORIES_ENDPOINT, data);
  },

  /**
   * Update an existing category
   * @param id Category ID
   * @param data Category form data
   * @returns Promise with updated category
   */
  update: async (id: number, data: CategoryFormData): Promise<Category> => {
    return api.put<Category>(`${CATEGORIES_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a category
   * @param id Category ID
   * @returns Promise with no content
   */
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`${CATEGORIES_ENDPOINT}/${id}`);
  },
};

export default categoryService;