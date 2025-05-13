import React from 'react';
import { format } from 'date-fns';
import { FiCalendar, FiClock } from 'react-icons/fi';
import type { Category } from '../../types/categories.types';

interface CategoryDetailsModalProps {
  category: Category;
}

const CategoryDetailsModal: React.FC<CategoryDetailsModalProps> = ({ category }) => {
  const formattedDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy, h:mm a');
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
          <p className="text-gray-600">{category.description}</p>
        </div>
        
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Details</h2>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center">
              <span className="text-gray-500 w-24">ID:</span>
              <span className="text-gray-800 font-medium">{category.id}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-24">Created:</span>
              <div className="flex items-center text-gray-800">
                <FiCalendar className="mr-2 text-gray-500" />
                {formattedDate(category.createdAt)}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-24">Updated:</span>
              <div className="flex items-center text-gray-800">
                <FiClock className="mr-2 text-gray-500" />
                {formattedDate(category.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsModal;