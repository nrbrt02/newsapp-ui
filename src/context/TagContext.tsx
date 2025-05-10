import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type{ ReactNode } from 'react';
import { tagService } from '../services/tagService';
import type { Tag, TagFormData } from '../types/tag.types';

interface TagContextType {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  fetchTagById: (id: number) => Promise<Tag | null>;
  createTag: (data: TagFormData) => Promise<Tag | null>;
  updateTag: (id: number, data: TagFormData) => Promise<Tag | null>;
  deleteTag: (id: number) => Promise<boolean>;
  clearError: () => void;
}

const TagContext = createContext<TagContextType | undefined>(undefined);

interface TagProviderProps {
  children: ReactNode;
}

export const TagProvider: React.FC<TagProviderProps> = ({ children }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Fetch all tags - memoized to prevent recreating on every render
  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagService.getAll();
      setTags(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch tags';
      setError(errorMessage);
      console.error('Error fetching tags:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize tags only once
  useEffect(() => {
    if (!initialized) {
      fetchTags();
      setInitialized(true);
    }
  }, [initialized, fetchTags]);

  const fetchTagById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagService.getById(id);
      const updatedTags = [...tags];
      const index = updatedTags.findIndex(t => t.id === id);
      if (index !== -1) {
        updatedTags[index] = data;
        setTags(updatedTags);
      } else {
        setTags([...tags, data]);
      }
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch tag';
      setError(errorMessage);
      console.error('Error fetching tag:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (data: TagFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newTag = await tagService.create(data);
      setTags([...tags, newTag]);
      return newTag;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create tag';
      setError(errorMessage);
      console.error('Error creating tag:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTag = async (id: number, data: TagFormData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTag = await tagService.update(id, data);
      const updatedTags = tags.map(tag => 
        tag.id === id ? updatedTag : tag
      );
      setTags(updatedTags);
      return updatedTag;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update tag';
      setError(errorMessage);
      console.error('Error updating tag:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTag = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await tagService.delete(id);
      setTags(tags.filter(tag => tag.id !== id));
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete tag';
      setError(errorMessage);
      console.error('Error deleting tag:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: TagContextType = {
    tags,
    loading,
    error,
    fetchTags,
    fetchTagById,
    createTag,
    updateTag,
    deleteTag,
    clearError
  };

  return (
    <TagContext.Provider value={value}>
      {children}
    </TagContext.Provider>
  );
};

export const useTags = () => {
  const context = useContext(TagContext);
  if (context === undefined) {
    throw new Error('useTags must be used within a TagProvider');
  }
  return context;
};