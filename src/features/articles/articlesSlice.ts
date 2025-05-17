import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  ArticlesState,
  ArticlePreview,
  Article,
  PaginatedResponse,
  Category,
  Tag,
  ArticleCreateRequest,
  ArticleUpdateRequest
} from '../../types/article.types';
import * as articleService from '../../services/articleService';

// Initial state
const initialState: ArticlesState = {
  articles: null,
  article: null,
  categories: [],
  tags: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async ({ page = 0, size = 10, sort = 'createdAt,desc' }: { page?: number, size?: number, sort?: string }, { rejectWithValue }) => {
    try {
      const response = await articleService.getArticles(page, size, sort);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch articles');
    }
  }
);

export const fetchArticlesByCurrentUser = createAsyncThunk(
  'articles/fetchArticlesByCurrentUser',
  async ({ page = 0, size = 10, sort = 'createdAt,desc' }: { page?: number, size?: number, sort?: string }, { rejectWithValue }) => {
    try {
      const response = await articleService.getMyArticles(page, size, sort);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your articles');
    }
  }
);

export const fetchPublishedArticles = createAsyncThunk(
  'articles/fetchPublishedArticles',
  async ({ page = 0, size = 10, sort = 'createdAt,desc' }: { page?: number, size?: number, sort?: string }, { rejectWithValue }) => {
    try {
      const response = await articleService.getPublishedArticles(page, size, sort);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch published articles');
    }
  }
);

export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await articleService.getArticleById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch article');
    }
  }
);

export const fetchArticlesByAuthor = createAsyncThunk(
  'articles/fetchArticlesByAuthor',
  async ({ 
    authorId, 
    page = 0, 
    size = 10, 
    sort = 'createdAt,desc' 
  }: { 
    authorId: number, 
    page?: number, 
    size?: number, 
    sort?: string 
  }, { rejectWithValue }) => {
    try {
      const response = await articleService.getArticlesByAuthor(authorId, page, size, sort);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch articles by author');
    }
  }
);

export const fetchArticlesByCategory = createAsyncThunk(
  'articles/fetchArticlesByCategory',
  async ({ 
    categoryId, 
    page = 0, 
    size = 10, 
    sort = 'createdAt,desc' 
  }: { 
    categoryId: number, 
    page?: number, 
    size?: number, 
    sort?: string 
  }, { rejectWithValue }) => {
    try {
      const response = await articleService.getArticlesByCategory(categoryId, page, size, sort);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch articles by category');
    }
  }
);

export const searchArticles = createAsyncThunk(
  'articles/searchArticles',
  async ({ 
    keyword, 
    page = 0, 
    size = 10, 
    sort = 'createdAt,desc' 
  }: { 
    keyword: string, 
    page?: number, 
    size?: number, 
    sort?: string 
  }, { rejectWithValue }) => {
    try {
      const response = await articleService.searchArticles(keyword, page, size, sort);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search articles');
    }
  }
);

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (articleData: ArticleCreateRequest, { rejectWithValue }) => {
    try {
      const response = await articleService.createArticle(articleData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create article');
    }
  }
);

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ id, articleData }: { id: number, articleData: ArticleUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await articleService.updateArticle(id, articleData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update article');
    }
  }
);

export const updateArticleStatus = createAsyncThunk(
  'articles/updateArticleStatus',
  async ({ id, status }: { id: number, status: string }, { rejectWithValue }) => {
    try {
      const response = await articleService.updateArticleStatus(id, status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update article status');
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (id: number, { rejectWithValue }) => {
    try {
      await articleService.deleteArticle(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete article');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'articles/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await articleService.getCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchTags = createAsyncThunk(
  'articles/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await articleService.getTags();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tags');
    }
  }
);

// Articles slice
const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearArticle: (state) => {
      state.article = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchArticles
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<PaginatedResponse<ArticlePreview>>) => {
        state.isLoading = false;
        state.articles = action.payload;
        state.error = null;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle fetchPublishedArticles
    builder
      .addCase(fetchPublishedArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublishedArticles.fulfilled, (state, action: PayloadAction<PaginatedResponse<ArticlePreview>>) => {
        state.isLoading = false;
        state.articles = action.payload;
        state.error = null;
      })
      .addCase(fetchPublishedArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle fetchArticleById
    builder
      .addCase(fetchArticleById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<Article>) => {
        state.isLoading = false;
        state.article = action.payload;
        state.error = null;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

        builder
    .addCase(fetchArticlesByCurrentUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchArticlesByCurrentUser.fulfilled, (state, action: PayloadAction<PaginatedResponse<ArticlePreview>>) => {
      state.isLoading = false;
      state.articles = action.payload;
      state.error = null;
    })
    .addCase(fetchArticlesByCurrentUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Handle fetchArticlesByAuthor
    builder
      .addCase(fetchArticlesByAuthor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticlesByAuthor.fulfilled, (state, action: PayloadAction<PaginatedResponse<ArticlePreview>>) => {
        state.isLoading = false;
        state.articles = action.payload;
        state.error = null;
      })
      .addCase(fetchArticlesByAuthor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle fetchArticlesByCategory
    builder
      .addCase(fetchArticlesByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticlesByCategory.fulfilled, (state, action: PayloadAction<PaginatedResponse<ArticlePreview>>) => {
        state.isLoading = false;
        state.articles = action.payload;
        state.error = null;
      })
      .addCase(fetchArticlesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle searchArticles
    builder
      .addCase(searchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchArticles.fulfilled, (state, action: PayloadAction<PaginatedResponse<ArticlePreview>>) => {
        state.isLoading = false;
        state.articles = action.payload;
        state.error = null;
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle createArticle
    builder
      .addCase(createArticle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action: PayloadAction<Article>) => {
        state.isLoading = false;
        state.article = action.payload;
        state.error = null;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle updateArticle
    builder
      .addCase(updateArticle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action: PayloadAction<Article>) => {
        state.isLoading = false;
        state.article = action.payload;
        state.error = null;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle updateArticleStatus
    builder
      .addCase(updateArticleStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateArticleStatus.fulfilled, (state, action: PayloadAction<Article>) => {
        state.isLoading = false;
        state.article = action.payload;
        state.error = null;
      })
      .addCase(updateArticleStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle deleteArticle
    builder
      .addCase(deleteArticle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        if (state.articles && state.articles.content) {
          state.articles.content = state.articles.content.filter(
            article => article.id !== action.payload
          );
        }
        state.error = null;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle fetchCategories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle fetchTags
    builder
      .addCase(fetchTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action: PayloadAction<Tag[]>) => {
        state.isLoading = false;
        state.tags = action.payload;
        state.error = null;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearArticle, clearError } = articlesSlice.actions;

// Export reducer
export default articlesSlice.reducer;