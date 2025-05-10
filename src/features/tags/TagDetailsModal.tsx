import React from 'react';
import { format } from 'date-fns';
import type { Tag } from '../../types/tag.types';

interface TagDetailsModalProps {
  tag: Tag;
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
          <p className="text-2xl font-bold text-gray-800">{tag.name}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">ID</p>
              <p className="text-gray-800 font-medium">{tag.id}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="text-gray-800 font-medium">{tag.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Created At</p>
              <p className="text-gray-800">{formattedDate(tag.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Last Updated</p>
              <p className="text-gray-800">{formattedDate(tag.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagDetailsModal;