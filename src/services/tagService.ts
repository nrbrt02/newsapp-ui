import api from './api';
import type { Tag, TagFormData } from '../types/tag.types';

const TAGS_ENDPOINT = '/tags';

export const tagService = {
  getAll: async (): Promise<Tag[]> => {
    try {
      const response = await api.get<Tag[]>(TAGS_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Tag> => {
    try {
      const response = await api.get<Tag>(`${TAGS_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tag ${id}:`, error);
      throw error;
    }
  },

  create: async (data: TagFormData): Promise<Tag> => {
    try {
      const response = await api.post<Tag>(TAGS_ENDPOINT, data);
      return response.data;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  },

  update: async (id: number, data: TagFormData): Promise<Tag> => {
    try {
      const response = await api.put<Tag>(`${TAGS_ENDPOINT}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating tag ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete<void>(`${TAGS_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting tag ${id}:`, error);
      throw error;
    }
  },
};

export default tagService;