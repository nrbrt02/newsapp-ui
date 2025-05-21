import api from './api';
import type { 
  Article, 
  ArticleCreateRequest, 
  ArticleUpdateRequest, 
  PaginatedResponse, 
  ArticlePreview,
  Category,
  Tag
} from '../types/article.types';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post<{ imageUrl: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.imageUrl;
  } catch (error) {
    throw error;
  }
};

export const getArticles = async (
  page = 0, 
  size = 10, 
  sort = 'createdAt,desc'
): Promise<PaginatedResponse<ArticlePreview>> => {
  try {
    const response = await api.get<PaginatedResponse<ArticlePreview>>(
      `/articles?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyArticles = async (
  page = 0, 
  size = 10, 
  sort = 'createdAt,desc'
): Promise<PaginatedResponse<ArticlePreview>> => {
  try {
    const response = await api.get<PaginatedResponse<ArticlePreview>>(
      `/articles/my-articles?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get published articles
export const getPublishedArticles = async (
  page = 0, 
  size = 10, 
  sort = 'createdAt,desc'
): Promise<PaginatedResponse<ArticlePreview>> => {
  try {
    const response = await api.get<PaginatedResponse<ArticlePreview>>(
      `/articles/published?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get article by ID
export const getArticleById = async (id: number): Promise<Article> => {
  try {
    console.log('Making API call to fetch article:', id);
    const response = await api.get<Article>(`/articles/${id}`);
    console.log('API response for article:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

// Get articles by author
export const getArticlesByAuthor = async (
  authorId: number,
  page = 0, 
  size = 10, 
  sort = 'createdAt,desc'
): Promise<PaginatedResponse<ArticlePreview>> => {
  try {
    const response = await api.get<PaginatedResponse<ArticlePreview>>(
      `/articles/author/${authorId}?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get articles by category
export const getArticlesByCategory = async (
  categoryId: number,
  page = 0, 
  size = 10, 
  sort = 'createdAt,desc'
): Promise<PaginatedResponse<ArticlePreview>> => {
  try {
    const response = await api.get<PaginatedResponse<ArticlePreview>>(
      `/articles/category/${categoryId}?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search articles
export const searchArticles = async (
  keyword: string,
  page = 0, 
  size = 10, 
  sort = 'createdAt,desc'
): Promise<PaginatedResponse<ArticlePreview>> => {
  try {
    const response = await api.get<PaginatedResponse<ArticlePreview>>(
      `/articles/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get top articles
export const getTopArticles = async (count = 5): Promise<ArticlePreview[]> => {
  try {
    const response = await api.get<ArticlePreview[]>(`/articles/top?count=${count}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create article
export const createArticle = async (article: ArticleCreateRequest): Promise<Article> => {
  try {
    const response = await api.post<Article>('/articles', article);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update article
export const updateArticle = async (id: number, article: ArticleUpdateRequest): Promise<Article> => {
  try {
    const response = await api.put<Article>(`/articles/${id}`, article);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update article status
export const updateArticleStatus = async (id: number, status: string): Promise<Article> => {
  try {
    const response = await api.patch<Article>(`/articles/${id}/status?status=${status}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete article
export const deleteArticle = async (id: number): Promise<void> => {
  try {
    await api.delete(`/articles/${id}`);
  } catch (error) {
    throw error;
  }
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all tags
export const getTags = async (): Promise<Tag[]> => {
  try {
    const response = await api.get<Tag[]>('/tags');
    return response.data;
  } catch (error) {
    throw error;
  }
};