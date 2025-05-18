import { useState } from 'react';
import { format } from 'date-fns';
import { FiHeart, FiMoreVertical, FiTrash } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import type { Reply as ReplyType } from '../../types/article.types';
import ConfirmModal from '../ui/ConfirmModal';

interface ReplyProps {
  reply: ReplyType;
  onLike: (replyId: number) => Promise<boolean>;
  onDelete: (replyId: number) => Promise<boolean>;
}

const Reply = ({ reply, onLike, onDelete }: ReplyProps) => {
  const { user } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canDelete = user && (
    user.role === 'ADMIN' || 
    user.id === reply.user.id
  );

  const handleLike = async () => {
    await onLike(reply.id);
  };

  const handleDeleteClick = () => {
    setShowOptions(false);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    const success = await onDelete(reply.id);
    setIsSubmitting(false);
    
    if (success) {
      setShowDeleteModal(false);
    }
    
    return success;
  };

  return (
    <div className="py-3">
      <div className="flex">
        {/* User Avatar */}
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
          {reply.user.firstName?.charAt(0) || reply.user.username.charAt(0)}
        </div>
        
        {/* Reply Content */}
        <div className="ml-3 flex-grow">
          <div className="flex justify-between">
            <div>
              <span className="font-medium text-gray-800">
                {reply.user.firstName && reply.user.lastName 
                  ? `${reply.user.firstName} ${reply.user.lastName}`
                  : reply.user.username}
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {format(new Date(reply.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            
            {/* Reply Options */}
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
          
          <p className="text-gray-700 mt-1">{reply.content}</p>
          
          {/* Reply Actions */}
          <div className="flex items-center mt-2 text-sm">
            <button 
              className="flex items-center text-gray-500 hover:text-primary-600"
              onClick={handleLike}
            >
              <FiHeart className="mr-1" />
              {reply.likes > 0 && <span className="mr-1">{reply.likes}</span>}
              Like
            </button>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Reply"
        message="Are you sure you want to delete this reply? This action cannot be undone."
        confirmLabel={isSubmitting ? "Deleting..." : "Delete"}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isSubmitting={isSubmitting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default Reply;