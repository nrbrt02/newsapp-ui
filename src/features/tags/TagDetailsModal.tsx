// src/features/tags/TagDetailsModal.tsx
import React from 'react';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiTag, FiFileText } from 'react-icons/fi';
import type { Tag } from '../../types/tag.types';

interface TagDetailsModalProps {
  tag: Tag;
  articleCount: any[];
}

const TagDetailsModal: React.FC<TagDetailsModalProps> = ({ tag }) => {
  const formattedDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy, h:mm a');
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Tag Information</h2>
          <div className="flex items-center">
            <FiTag className="text-primary-600 mr-2" size={20} />
            <p className="text-2xl font-bold text-gray-800">{tag.name}</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Details</h2>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center">
              <span className="text-gray-500 w-24">ID:</span>
              <span className="text-gray-800 font-medium">{tag.id}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-24">Name:</span>
              <span className="text-gray-800 font-medium">{tag.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-24">Created:</span>
              <div className="flex items-center text-gray-800">
                <FiCalendar className="mr-2 text-gray-500" />
                {formattedDate(tag.createdAt)}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-24">Updated:</span>
              <div className="flex items-center text-gray-800">
                <FiClock className="mr-2 text-gray-500" />
                {formattedDate(tag.updatedAt)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Added articles count if available in your Tag type */}
        {tag.articleCount !== undefined && (
          <div className="border-t pt-4">
            <div className="flex items-center">
              <FiFileText className="text-primary-600 mr-2" />
              <span className="text-gray-800">
                <strong>{tag.articleCount}</strong> articles use this tag
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagDetailsModal;