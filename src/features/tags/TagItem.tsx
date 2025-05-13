// src/features/tags/TagItem.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import type { Tag } from '../../types/tag.types';
import Modal from '../categories/Modal';
import TagForm from './TagForm';
import type { TagFormData } from '../../types/tag.types';
import { useTags } from '../../context/TagContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../hooks/useAuth';

interface TagItemProps {
  tag: Tag;
  onDelete: (id: number) => void;
  onViewDetails: (tag: Tag) => void;
}

const TagItem: React.FC<TagItemProps> = ({ tag, onDelete, onViewDetails }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateTag } = useTags();
  const { showToast } = useToast();
  const { user } = useAuth();

  const formattedDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleUpdateTag = async (data: TagFormData) => {
    setIsUpdating(true);
    const result = await updateTag(tag.id, data);
    setIsUpdating(false);
    
    if (result) {
      setShowEditModal(false);
      showToast('Tag updated successfully', 'success');
    } else {
      showToast('Failed to update tag', 'error');
    }
  };

  // Check if user can edit/delete
  const canEditTag = user?.role === 'ADMIN' || (user?.role === 'WRITER' && tag.createdBy === user.id);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-600 cursor-pointer"
                onClick={() => onViewDetails(tag)}>
              {tag.name}
            </h3>
            <div className="text-sm text-gray-500 mt-1">
              <span>Created: {formattedDate(tag.createdAt)}</span>
              <span className="mx-2">•</span>
              <span>Updated: {formattedDate(tag.updatedAt)}</span>
            </div>
          </div>
          
          <div className="flex flex-shrink-0 space-x-2">
            <button
              onClick={() => onViewDetails(tag)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
              title="View Details"
              aria-label="View tag details"
            >
              <FiInfo className="text-xl" />
            </button>
            
            {canEditTag && (
              <>
                <button
                  onClick={handleEditClick}
                  className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-full transition-colors"
                  title="Edit Tag"
                  aria-label="Edit tag"
                >
                  <FiEdit className="text-xl" />
                </button>
                <button 
                  onClick={() => onDelete(tag.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Tag"
                  aria-label="Delete tag"
                >
                  <FiTrash2 className="text-xl" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Tag Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title={`Edit Tag: ${tag.name}`}
      >
        <div className="p-6">
          <TagForm 
            initialData={tag}
            onSubmit={handleUpdateTag} 
            isSubmitting={isUpdating} 
          />
        </div>
      </Modal>
    </>
  );
};

export default TagItem;