import React, { useState } from 'react';
import { format } from 'date-fns';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import type { Tag } from '../../types/tag.types';
import Modal from '../categories/Modal';
import TagForm from './TagForm';
import type { TagFormData } from '../../types/tag.types';
import { useTags } from '../../context/TagContext';
import { useToast } from '../../context/ToastContext';

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

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all hover:shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{tag.name}</h3>
            <div className="text-sm text-gray-500 mt-1">
              <span>Created: {formattedDate(tag.createdAt)}</span>
              <span className="mx-2">•</span>
              <span>Updated: {formattedDate(tag.updatedAt)}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onViewDetails(tag)}
              className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
              title="View Details"
            >
              <FiInfo className="text-xl" />
            </button>
            <button
              onClick={handleEditClick}
              className="p-2 text-yellow-600 hover:text-yellow-800 transition-colors"
              title="Edit"
            >
              <FiEdit className="text-xl" />
            </button>
            <button 
              onClick={() => onDelete(tag.id)}
              className="p-2 text-red-600 hover:text-red-800 transition-colors"
              title="Delete"
            >
              <FiTrash2 className="text-xl" />
            </button>
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