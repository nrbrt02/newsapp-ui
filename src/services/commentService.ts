// src/services/commentService.ts
import api from './api';
import type { Comment, CommentRequest, Reply, ReplyRequest, PaginatedResponse } from '../types/article.types';

// Define the API endpoints
const COMMENTS_ENDPOINT = '/comments';
const REPLIES_ENDPOINT = '/replies';

export const commentService = {
  // Get comments for an article
getCommentsByArticle: async (
  articleId: number,
  page = 0,
  size = 10,
  options?: { signal?: AbortSignal }
): Promise<PaginatedResponse<Comment>> => {
  try {
    const response = await api.get<PaginatedResponse<Comment>>(
      `${COMMENTS_ENDPOINT}/article/${articleId}`,
      {
        params: { page, size },
        signal: options?.signal
      }
    );
    return response.data;
  } catch (error) {
    // Don't rethrow canceled requests
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return { 
        content: [], 
        totalPages: 0,
        totalElements: 0, 
        last: true,
        number: page,
        // Add other required fields with default values
      };
    }
    console.error(`Error fetching comments for article ${articleId}:`, error);
    throw error;
  }
},
  // Create a new comment
  createComment: async (comment: CommentRequest): Promise<Comment> => {
    try {
      const response = await api.post<Comment>(COMMENTS_ENDPOINT, comment);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Like a comment
  likeComment: async (commentId: number): Promise<Comment> => {
    try {
      const response = await api.post<Comment>(`${COMMENTS_ENDPOINT}/${commentId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId: number): Promise<void> => {
    try {
      await api.delete(`${COMMENTS_ENDPOINT}/${commentId}`);
    } catch (error) {
      throw error;
    }
  },

  // Get replies for a comment
  getRepliesByComment: async (
    commentId: number,
    page = 0,
    size = 10,
    options?: { signal?: AbortSignal }
  ): Promise<PaginatedResponse<Reply>> => {
    try {
      const response = await api.get<PaginatedResponse<Reply>>(
        `${REPLIES_ENDPOINT}/comment/${commentId}`,
        {
          params: { page, size },
          signal: options?.signal
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new reply
  createReply: async (reply: ReplyRequest): Promise<Reply> => {
    try {
      const response = await api.post<Reply>(REPLIES_ENDPOINT, reply);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Like a reply
  likeReply: async (replyId: number): Promise<Reply> => {
    try {
      const response = await api.post<Reply>(`${REPLIES_ENDPOINT}/${replyId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a reply
  deleteReply: async (replyId: number): Promise<void> => {
    try {
      await api.delete(`${REPLIES_ENDPOINT}/${replyId}`);
    } catch (error) {
      throw error;
    }
  }
};

export default commentService;