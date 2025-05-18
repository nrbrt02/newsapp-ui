import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { 
  fetchArticles,
  fetchPublishedArticles,
  fetchArticleById,
  fetchArticlesByAuthor,
  fetchArticlesByCategory,
  searchArticles,
  createArticle,
  updateArticle,
  fetchArticlesByCurrentUser,
  updateArticleStatus,
  deleteArticle,
  fetchCategories,
  fetchTags,
  clearArticle,
  clearError
} from '../features/articles/articlesSlice';
import type { 
  ArticleCreateRequest,
  ArticleUpdateRequest
} from '../types/article.types';

export const useArticle = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    articles, 
    article, 
    categories, 
    tags, 
    isLoading, 
    error 
  } = useSelector((state: RootState) => state.articles);

  // Memoize the loadCategories and loadTags functions to prevent unnecessary re-renders
  const loadCategories = useCallback(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const loadTags = useCallback(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  // Load categories and tags when needed, not automatically on hook mount
  const reloadCategories = async () => {
    try {
      await dispatch(fetchCategories()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const reloadTags = async () => {
    try {
      await dispatch(fetchTags()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

const getArticles = useCallback(async (page = 0, size = 10, sort = 'createdAt,desc') => {
  try {
    await dispatch(fetchArticles({ page, size, sort })).unwrap();
    return true;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return false;
  }
}, [dispatch]);

  const getArticlesByCurrentUser = async (page = 0, size = 10, sort = 'createdAt,desc') => {
    try {
      await dispatch(fetchArticlesByCurrentUser({ page, size, sort })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

const getPublishedArticles = useCallback(async (
  page = 0, 
  sort: 'newest' | 'oldest' | 'views' = 'newest',
  categoryId: string | null = null
) => {
  try {
    // Convert our sort option to API expected format
    let sortParam = '';
    let direction = 'desc';
    
    switch(sort) {
      case 'newest':
        sortParam = 'createdAt';
        direction = 'desc';
        break;
      case 'oldest':
        sortParam = 'createdAt';
        direction = 'asc';
        break;
      case 'views':
        sortParam = 'views';
        direction = 'desc';
        break;
    }

    await dispatch(fetchPublishedArticles({ 
      page, 
      sort: sortParam, 
      direction,
      categoryId 
    })).unwrap();
    return true;
  } catch (error) {
    return false;
  }
}, [dispatch]);

const getArticleById = useCallback(async (id: number) => {
  try {
    if (!article || article.id !== id) {
      await dispatch(fetchArticleById(id)).unwrap();
    }
    return true;
  } catch (error) {
    return false;
  }
}, [dispatch, article]);

  const getArticlesByAuthor = async (authorId: number, page = 0, size = 10, sort = 'createdAt,desc') => {
    try {
      await dispatch(fetchArticlesByAuthor({ authorId, page, size, sort })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const getArticlesByCategory = async (categoryId: number, page = 0, size = 10, sort = 'createdAt,desc') => {
    try {
      await dispatch(fetchArticlesByCategory({ categoryId, page, size, sort })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

const searchForArticles = useCallback(async (keyword: string, page = 0, size = 10, sort = 'createdAt,desc') => {
  try {
    await dispatch(searchArticles({ keyword, page, size, sort })).unwrap();
    return true;
  } catch (error) {
    return false;
  }
}, [dispatch]);

  const createNewArticle = async (articleData: ArticleCreateRequest) => {
    try {
      const result = await dispatch(createArticle(articleData)).unwrap();
      return result;
    } catch (error) {
      return null;
    }
  };

  const updateExistingArticle = async (id: number, articleData: ArticleUpdateRequest) => {
    try {
      const result = await dispatch(updateArticle({ id, articleData })).unwrap();
      return result;
    } catch (error) {
      return null;
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const result = await dispatch(updateArticleStatus({ id, status })).unwrap();
      return result;
    } catch (error) {
      return null;
    }
  };

  const removeArticle = async (id: number) => {
    try {
      await dispatch(deleteArticle(id)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const clearCurrentArticle = () => {
    dispatch(clearArticle());
  };

  const clearCurrentError = () => {
    dispatch(clearError());
  };

  return {
    articles,
    article,
    categories,
    tags,
    isLoading,
    error,
    getArticles,
    getPublishedArticles,
    getArticleById,
    getArticlesByAuthor,
    getArticlesByCategory,
    getArticlesByCurrentUser,
    searchArticles: searchForArticles,
    createArticle: createNewArticle,
    updateArticle: updateExistingArticle,
    updateArticleStatus: updateStatus,
    deleteArticle: removeArticle,
    clearArticle: clearCurrentArticle,
    clearError: clearCurrentError,
    loadCategories,
    loadTags,
    reloadCategories,
    reloadTags
  };
};