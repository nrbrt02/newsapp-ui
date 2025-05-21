import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';
import { FiMessageSquare } from 'react-icons/fi';
import Comment from './Comment';
import CommentForm from './CommentForm';
import type { Comment as CommentType } from '../../types/article.types';
import { commentService } from '../../services/commentService';

interface CommentsSectionProps {
  articleId: number;
}

const CommentsSection = ({ articleId }: CommentsSectionProps) => {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const loadedRef = useRef(false);
  
  // Load comments only once per articleId
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadComments = async () => {
      // Skip if invalid articleId
      if (!articleId || articleId <= 0) {
        if (isMounted) {
          setComments([]);
          setError(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await commentService.getCommentsByArticle(
          articleId, 
          0, 
          10,
          { signal: controller.signal }
        );
        
        // Only update state if the component is still mounted
        if (isMounted && !controller.signal.aborted) {
          setComments(response.content || []);
          setPage(0);
          setHasMore(!response.last);
          setError(null);
        }
      } catch (err) {
        // Only set error if it's not a canceled request and component is mounted
        if (isMounted && 
            err instanceof Error && 
            err.name !== 'CanceledError' && 
            err.name !== 'AbortError') {
          setError('Failed to load comments');
          console.error('Error loading comments:', err);
        }
      } finally {
        // Only update loading state if component is mounted
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadComments();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [articleId]);

  // Separate function for loading more comments (pagination)
  const handleLoadMore = async () => {
    if (!articleId || isLoading) return;
    
    const controller = new AbortController();
    
    try {
      setIsLoading(true);
      
      const nextPage = page + 1;
      const response = await commentService.getCommentsByArticle(
        articleId, 
        nextPage, 
        10,
        { signal: controller.signal }
      );
      
      setComments(prev => [...prev, ...(response.content || [])]);
      setPage(nextPage);
      setHasMore(!response.last);
    } catch (err) {
      if (err instanceof Error && 
          err.name !== 'CanceledError' && 
          err.name !== 'AbortError') {
        showToast('Failed to load more comments', 'error');
        console.error('Error loading more comments:', err);
      }
    } finally {
      setIsLoading(false);
    }

    return () => controller.abort();
  };

  const handleAddComment = async (content: string) => {
    if (!isAuthenticated || !user) {
      showToast('You must be logged in to comment', 'error');
      return false;
    }
    
    try {
      setIsSubmitting(true);
      const newComment = await commentService.createComment({
        comment: content,
        articleId
      });
      
      setComments(prev => [newComment, ...prev]);
      showToast('Comment added successfully', 'success');
      return true;
    } catch (err) {
      showToast('Failed to add comment', 'error');
      console.error('Error adding comment:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReply = async (commentId: number, content: string) => {
    if (!isAuthenticated || !user) {
      showToast('You must be logged in to reply', 'error');
      return false;
    }
    
    try {
      const newReply = await commentService.createReply({
        content,
        commentId,
        parentReplyId: null
      });
      
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          }
          return comment;
        })
      );
      
      showToast('Reply added successfully', 'success');
      return true;
    } catch (err) {
      showToast('Failed to add reply', 'error');
      console.error('Error adding reply:', err);
      return false;
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!isAuthenticated) {
      showToast('You must be logged in to like comments', 'error');
      return false;
    }
    
    try {
      const updatedComment = await commentService.likeComment(commentId);
      
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: updatedComment.likes
            };
          }
          return comment;
        })
      );
      return true;
    } catch (err) {
      showToast('Failed to like comment', 'error');
      console.error('Error liking comment:', err);
      return false;
    }
  };

  const handleLikeReply = async (replyId: number) => {
    if (!isAuthenticated) {
      showToast('You must be logged in to like replies', 'error');
      return false;
    }
    
    try {
      const updatedReply = await commentService.likeReply(replyId);
      
      setComments(prev => 
        prev.map(comment => {
          if (comment.replies) {
            const replyIndex = comment.replies.findIndex(reply => reply.id === replyId);
            if (replyIndex !== -1) {
              const updatedReplies = [...comment.replies];
              updatedReplies[replyIndex] = {
                ...updatedReplies[replyIndex],
                likes: updatedReply.likes
              };
              return {
                ...comment,
                replies: updatedReplies
              };
            }
          }
          return comment;
        })
      );
      return true;
    } catch (err) {
      showToast('Failed to like reply', 'error');
      console.error('Error liking reply:', err);
      return false;
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentService.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      showToast('Comment deleted successfully', 'success');
      return true;
    } catch (err) {
      showToast('Failed to delete comment', 'error');
      console.error('Error deleting comment:', err);
      return false;
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    try {
      await commentService.deleteReply(replyId);
      setComments(prev => 
        prev.map(comment => {
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== replyId)
            };
          }
          return comment;
        })
      );
      showToast('Reply deleted successfully', 'success');
      return true;
    } catch (err) {
      showToast('Failed to delete reply', 'error');
      console.error('Error deleting reply:', err);
      return false;
    }
  };

  // Reset the component when article changes
  useEffect(() => {
    return () => {
      loadedRef.current = false;
    };
  }, [articleId]);

  return (
    <div className="mt-10 border-t border-gray-200 pt-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FiMessageSquare className="mr-2" />
        Comments
        {comments.length > 0 && <span className="ml-2 text-gray-500">({comments.length})</span>}
      </h2>
      
      {/* Comment Form */}
      {isAuthenticated ? (
        <div className="mb-8">
          <CommentForm
            onSubmit={handleAddComment}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 text-center">
          <p className="mb-3">You need to be logged in to comment.</p>
          <Link to="/login" className="btn btn-primary">Log In</Link>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-2">
        {isLoading && comments.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            <span className="ml-2">Loading comments...</span>
          </div>
        ) : comments.length > 0 ? (
          <>
            {comments.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                onReply={handleAddReply}
                onLike={handleLikeComment}
                onDelete={handleDeleteComment}
                onLikeReply={handleLikeReply}
                onDeleteReply={handleDeleteReply}
              />
            ))}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-6">
                <button
                  className="btn btn-secondary"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Load More Comments'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;