// src/components/article/Comment.tsx
import { useState } from 'react';
import { format } from 'date-fns';
import { FiHeart, FiMessageSquare, FiMoreVertical, FiTrash } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import Reply from './Reply';
import ReplyForm from './ReplyForm';
import type { Comment as CommentType, Reply as ReplyType } from '../../types/article.types';
import ConfirmModal from '../ui/ConfirmModal';

interface CommentProps {
  comment: CommentType;
  onReply: (commentId: number, content: string) => Promise<boolean>;
  onLike: (commentId: number) => Promise<boolean>;
  onDelete: (commentId: number) => Promise<boolean>;
  onLikeReply: (replyId: number) => Promise<boolean>;
  onDeleteReply: (replyId: number) => Promise<boolean>;
}

const Comment = ({ 
  comment, 
  onReply, 
  onLike, 
  onDelete,
  onLikeReply,
  onDeleteReply
}: CommentProps) => {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canDelete = user && (
    user.role === 'ADMIN' || 
    user.id === comment.user.id
  );

  const handleReplySubmit = async (content: string) => {
    setIsSubmitting(true);
    const success = await onReply(comment.id, content);
    setIsSubmitting(false);
    
    if (success) {
      setShowReplyForm(false);
    }
    
    return success;
  };

  const handleLike = async () => {
    await onLike(comment.id);
  };

  const handleDeleteClick = () => {
    setShowOptions(false);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    const success = await onDelete(comment.id);
    setIsSubmitting(false);
    
    if (success) {
      setShowDeleteModal(false);
    }
    
    return success;
  };

  return (
    <div className="border-b border-gray-200 last:border-0 py-6">
      <div className="flex">
        {/* User Avatar */}
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
          {comment.user.firstName?.charAt(0) || comment.user.username.charAt(0)}
        </div>
        
        {/* Comment Content */}
        <div className="ml-3 flex-grow">
          <div className="flex justify-between">
            <div>
              <span className="font-medium text-gray-800">
                {comment.user.firstName && comment.user.lastName 
                  ? `${comment.user.firstName} ${comment.user.lastName}`
                  : comment.user.username}
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {format(new Date(comment.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            
            {/* Comment Options */}
            {canDelete && (
              <div className="relative">
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowOptions(!showOptions)}
                >
                  <FiMoreVertical />
                </button>
                
                {showOptions && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={handleDeleteClick}
                    >
                      <FiTrash className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <p className="text-gray-700 mt-1">{comment.comment}</p>
          
          {/* Comment Actions */}
          <div className="flex items-center mt-2 text-sm">
            <button 
              className="flex items-center text-gray-500 hover:text-primary-600"
              onClick={handleLike}
            >
              <FiHeart className="mr-1" />
              {comment.likes > 0 && <span className="mr-1">{comment.likes}</span>}
              Like
            </button>
            
            <button 
              className="flex items-center text-gray-500 hover:text-primary-600 ml-4"
              onClick={() => {
                setShowReplyForm(!showReplyForm);
                setShowReplies(true);
              }}
            >
              <FiMessageSquare className="mr-1" />
              Reply
            </button>
            
            {comment.replies && comment.replies.length > 0 && (
              <button 
                className="flex items-center text-gray-500 hover:text-primary-600 ml-4"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? 'Hide' : 'View'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
          
          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4">
              <ReplyForm 
                onSubmit={handleReplySubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
          
          {/* Replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l border-gray-200">
              {comment.replies.map((reply: ReplyType) => (
                <Reply 
                  key={reply.id}
                  reply={reply}
                  onLike={onLikeReply}
                  onDelete={onDeleteReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel={isSubmitting ? "Deleting..." : "Delete"}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isSubmitting={isSubmitting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default Comment;